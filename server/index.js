import express from "express";
import path from "path";
import fs from "fs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import AppServer from "../src/AppServer";

const app = express();

const PORT = process.env.PORT || 3002;

const staticPathRoot = `../build/static`;

const bootstrapScripts = [];
const bootstrapCSS = [];

const ReadDirectoryContentToArray = (folderPath, array) => {
  fs.readdir(path.join(__dirname, folderPath), (err, files) => {
    if (err) {
      return console.log(`Unable to scan this folder: ${folderPath}`);
    }

    files.forEach((fileName) => {
      console.log("FF", fileName);
      if (
        (fileName.startsWith("main.") && fileName.endsWith(".js")) ||
        fileName.endsWith(".css")
      ) {
        array.push(`${folderPath}/${fileName}`);
        console.log("ARRA", array);
      }
    });
  });
};

ReadDirectoryContentToArray(`${staticPathRoot}/js`, bootstrapScripts);
ReadDirectoryContentToArray(`${staticPathRoot}/css`, bootstrapCSS);

app.get("/", (req, res) => {
  const content = ReactDOMServer.renderToString(<AppServer />);
  const cssLinks = bootstrapCSS
    .map(
      (css) => `<link rel="stylesheet" href="${css.slice(9, css.listen)}" />`
    )
    .join("\n");

  const scriptTags = bootstrapScripts
    .map((js) => `<script src="/${js.slice(9, js.length)}" defer></script>`)
    .join("\n");

  console.log("OKOK1", cssLinks);
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>React SSR</title>
          ${cssLinks}
      </head>
    
      <body>
        <div id="root">${content}</div>
      </body>
      ${scriptTags}
    </html>
  `;

  res.send(html);
});

app.use(express.static(path.resolve(__dirname, "../build")));
console.log("OKOK", bootstrapCSS, bootstrapScripts);

app.listen(PORT, () => {
  console.log(`Server Running on PORT:${PORT}`);
});
