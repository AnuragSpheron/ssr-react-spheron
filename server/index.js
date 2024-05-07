import express from "express";
import path from "path";
import fs from "fs";
import React from "react";
import { StaticRouter } from "react-router-dom/server";
import ReactDOMServer from "react-dom/server";
import SSRWrapper from "../src/SSRWrapper";
import AssetManifest from "../build/asset-manifest.json";

const app = express();

const PORT = process.env.PORT || 3002;

const staticPathRoot = `../build/static`;

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

app.use(
  "/build/static",
  express.static(path.join(__dirname, "../build/static"))
);
app.get("*", async (req, res) => {
  if (req.url === "/about") {
    bootstrapScripts = [
      ...bootstrapScripts,
      AssetManifest.files[`${req.url.split("/")[1]}.js`],
    ];
  }
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

  const context = {};
  let didError = false;

  const content = ReactDOMServer.renderToPipeableStream(
    <StaticRouter location={req.url} context={{}}>
      <SSRWrapper css={bootstrapCSS} response={resp.extendedInstances} />
    </StaticRouter>,

    {
      bootstrapScripts,
      onShellReady: () => {
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");
        content.pipe(res);
      },
      onError: (error) => {
        didError = true;
        console.log("Error", error);
      },
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server Running on PORT:${PORT}`);
});
