import type { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import path from "path";
import express from "express";
import session from "express-session";
import compression from "compression";
import serveStatic from "serve-static";
import { createServer as createViteServer } from "vite";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
// import apiRouter from "./src/server/api-router";

const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

const resolve = (p: string) => path.resolve(__dirname, p);

async function initialiseModels() {
  // Init Models
  const User = await (await import("./src/database/models/user")).default;
  const Project = await (await import("./src/database/models/project")).default;
  const ProjectTenant = await (await import("./src/database/models/project_tenant")).default;
  const ProjectInvite = await (await import("./src/database/models/project_invite")).default;
  const Location = await (await import("./src/database/models/location")).default;
  const Rating = await (await import("./src/database/models/rating")).default;
  const Fund = await (await import("./src/database/models/fund")).default;
  const Media = await (await import("./src/database/models/media")).default;
  const Comment = await (await import("./src/database/models/comment")).default;

  // adding console logs after sync is called.
  // This is to catch and determine what caused the sync to fail
  await User.sync({ alter: true })
    .then(() => console.log("server synced user Model"))
    .catch(err => console.error("user Model failed to sync", err));

  await Project.sync({ alter: true })
    .then(() => console.log("server synced project Model"))
    .catch(err => console.error("project Model failed to sync", err));

  await ProjectTenant.sync({ alter: true })
    .then(() => console.log("server synced projectTenant Model"))
    .catch(err => console.error("projectTenant Model failed to sync", err));

  await ProjectInvite.sync({ alter: true })
    .then(() => console.log("server synced projectInvite Model"))
    .catch(err => console.error("projectInvite Model failed to sync", err));

  await Location.sync({ alter: true })
    .then(() => console.log("server synced Location Model"))
    .catch(err => console.error("location Model failed to sync", err));

  await Rating.sync({ alter: true })
    .then(() => console.log("server synced Rating Model"))
    .catch(err => console.error("rating Model failed to sync", err));

  await Fund.sync({ alter: true })
    .then(() => console.log("server synced Fund Model"))
    .catch(err => console.error("fund Model failed to sync", err));

  await Media.sync({ alter: true })
    .then(() => console.log("server synced Media Model"))
    .catch(err => console.error("media Model failed to sync", err));

  await Comment.sync({ alter: true })
    .then(() => console.log("server synced Comment Model"))
    .catch(err => console.error("comment Model failed to sync", err));
}

const getStyleSheets = async () => {
  const assetpath = resolve("dist/assets");
  const files = await fs.readdir(assetpath);
  const cssAssets = files.filter(l => l.endsWith(".css"));
  const allContent = [];
  for (const asset of cssAssets) {
    const content = await fs.readFile(path.join(assetpath, asset), "utf-8");
    // @ts-ignore
    allContent.push(`<style type="text/css">${content}</style>`);
  }
  return allContent.join("\n");
};

async function createServer(isProd = process.env.NODE_ENV === "production") {
  // Imports
  const { Pool } = await import("pg");
  const pgSession = require("connect-pg-simple")(session);

  // Middleware setups
  const postgresConnectionPool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  });

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // Create Vite server in middleware mode and configure the app type as
  // 'custom', disabling Vite's own HTML serving logic so parent server
  // can take control
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: isTest ? "error" : "info"
  });

  // use vite's connect instance as middleware
  // if you use your own express router (express.Router()), you should use router.use
  const oneDay = 86400;
  const thirtyDays = 2592000000;
  const oneMinute = 60000;
  const twoMinute = 120000;
  app.use(vite.middlewares);
  const requestHandler = express.static(resolve("assets"));
  app.use(requestHandler);
  app.use(
    session({
      store: new pgSession({
        // connect-pg-simple options here
        pool: postgresConnectionPool,
        createTableIfMissing: true,
        tableName: "session", // default "session"
        schemaName: "public"
      }),
      saveUninitialized: false,
      secret: "makit_hush",
      resave: false,
      cookie: { maxAge: thirtyDays }
      // Insert express-session options here
    })
  );

  app.use("/assets", requestHandler);
  app.use("/api", await (await import("./src/server/api-router")).default);

  if (isProd) {
    app.use(compression());
    app.use(
      serveStatic(resolve("dist/client"), {
        index: false
      })
    );
  }
  const stylesheets = getStyleSheets();
  app.use("*", async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;

    try {
      // 1. Read index.html
      let template = await fs.readFile(isProd ? resolve("dist/client/index.html") : resolve("index.html"), "utf-8");

      // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
      //    also applies HTML transforms from Vite plugins, e.g. global preambles
      //    from @vitejs/plugin-react
      template = await vite.transformIndexHtml(url, template);

      // 3. Load the server entry. vite.ssrLoadModule automatically transforms
      //    your ESM source code to be usable in Node.js! There is no bundling
      //    required, and provides efficient invalidation similar to HMR.
      let productionBuildPath = path.join(__dirname, "./dist/server/entry-server.mjs");
      let devBuildPath = path.join(__dirname, "./src/client/entry-server.tsx");
      const { render } = await vite.ssrLoadModule(isProd ? productionBuildPath : devBuildPath);

      // 4. render the app HTML. This assumes entry-server.js's exported `render`
      //    function calls appropriate framework SSR APIs,
      //    e.g. ReactDOMServer.renderToString()
      const appHtml = await render(url);
      const cssAssets = isProd ? "" : await stylesheets;

      // 5. Inject the app-rendered HTML into the template.
      const html = template.replace(`<!--app-html-->`, appHtml).replace(`<!--head-->`, cssAssets);

      // 6. Send the rendered HTML back.
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e: any) {
      !isProd && vite.ssrFixStacktrace(e);
      console.log(e.stack);
      // If an error is caught, let Vite fix the stack trace so it maps back to
      // your actual source code.
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
  const port = process.env.SERVER_PORT || 8080;
  app.listen(Number(port), "0.0.0.0", () => {
    console.log(`App is listening on http://localhost:${port} with environment >> ${process.env.NODE_ENV}`);
  });
}

// Start Func
(async function () {
  if (process.env.NODE_ENV) {
    require("dotenv").config({
      path: path.join(__dirname, `./.env.${process.env.NODE_ENV}`)
    });
    await initialiseModels()
      .then(() => createServer())
      .catch(() => createServer());
  } else {
    console.error("No NODE_ENV provided please provide an environment with your script command");
    process.exit();
  }
})();
