import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";
import AppServer from "../src/AppServer";

const app = express();

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  const content = ReactDOMServer.renderToString(<AppServer />);
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>React SSR</title>
      </head>
      <body>
        <div id="root">${content}</div>
      </body>
    </html>
  `;

  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server Running on PORT:${PORT}`);
});
