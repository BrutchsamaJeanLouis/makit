import { defineConfig } from "vite";
import fs from "fs";
import dynamicImportVars from "@rollup/plugin-dynamic-import-vars";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const files = fs
  .readdirSync("src/database/models")
  .filter(file => {
    return file.indexOf(".") !== 0 && (file.slice(-3) === ".js" || file.slice(-3) === ".ts");
  })
  .map(f => `src/database/models/${f}`);

const filesNames = fs.readdirSync("src/database/models").filter(file => {
  return file.indexOf(".") !== 0 && (file.slice(-3) === ".js" || file.slice(-3) === ".ts");
});

let current;

export default defineConfig({
  plugins: [
    nodeResolve({}),
    dynamicImportVars(),
    commonjs({
      ignoreDynamicRequires: false,
      dynamicRequireTargets: ["src/database/models/index.js", "dotenv", "sequelize"]
    })
  ],
  build: {
    minify: false,
    target: "es2020",
    outDir: "../../../dist/src/database/models",
    lib: {
      entry: "index.js",
      name: "index",
      formats: ["cjs"]
    },
    rollupOptions: {
      // plugins: [
      //   nodeResolve(),
      //   commonjs()
      //   // dynamicImportVars(),
      //   // commonjs({
      //   //   ignoreDynamicRequires: false,
      //   //   // dynamicRequireTargets: ["src/database/models/index.js", ".env.development", ".env.production"]
      //   // })
      // ],
      input: [...files],
      output: {
        preserveModules: false,
        entryFileNames: chunk => {
          const fileLocationPaths = chunk.name.split("/");
          const fileName = fileLocationPaths[fileLocationPaths.length - 1];
          return `${fileName}.js`;
        }
        // : [...files]
      }
    },
    emptyOutDir: true,
    sourcemap: true
  },
  root: "./src/database/models"
});
