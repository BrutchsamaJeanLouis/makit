import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { App } from "./App";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";
import initAxios from "../utils/initAxios";

initAxios();

export function render(url: string) {
  return ReactDOMServer.renderToString(
    // TODO in production enable strict mode
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}
