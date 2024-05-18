import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import Koa from "koa";
import Router from "@koa/router";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import path from "path";
import fs from "fs";
import SSRWrapper from "../src/SSRWrapper";
import React from "react";
import serve from "koa-static";
import AssetManifest from "../build/asset-manifest.json";

const app = new Koa();
const router = new Router();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(serve(path.join(__dirname, "../build")));

const staticPathRoot = `/static`;

let bootstrapScripts = [];
const bootstrapCSS = [];

const ReadDirectoryContentToArray = (folderPath, array) => {
  fs.readdir(path.join(__dirname, folderPath), (err, files) => {
    if (err) {
      return console.log(`Unable to scan this folder: ${folderPath}`);
    }

    files.forEach((fileName) => {
      if (
        (fileName.startsWith("main.") && fileName.endsWith(".js")) ||
        fileName.endsWith(".css")
      ) {
        array.push(`${folderPath}/${fileName}`);
      }
    });
  });
};

ReadDirectoryContentToArray(`${staticPathRoot}/js`, bootstrapScripts);
ReadDirectoryContentToArray(`${staticPathRoot}/css`, bootstrapCSS);

router.get("/", async (ctx) => {
  console.log("OKOK", ctx);
  const instanceData = await fetch(
    "https://api-dev.spheron.network/v1/compute-project/65d5043df16838001253897a/instances?skip=0&limit=6&topupReport=n&state=",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_JWT}`,
        "Content-Type": "application/json",
      },
    }
  );

  const resp = await instanceData.json();
  console.log(resp);
  const context = {};
  await render(ctx, resp);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const render = (ctx, resp) => {
  let didError = false;
  return new Promise((resolve, reject) => {
    const stream = ReactDOMServer.renderToPipeableStream(
      <StaticRouter location={ctx.url} context={{}}>
        <SSRWrapper css={bootstrapCSS} response={resp.extendedInstances} />
      </StaticRouter>,

      {
        bootstrapScripts,
        onShellReady() {
          ctx.res.statusCode = didError ? 500 : 200;
          ctx.set({ "Content-Type": "text/html" });
          stream.pipe(ctx.res);
          ctx.res.end();
        },
        onError: (error) => {
          didError = true;
          console.log("Error", error);
          reject();
        },
      }
    );
  });
};
