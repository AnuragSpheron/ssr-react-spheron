import React from "react";
import AppServer from "./AppServer";

interface IProps {
  response: any[];
  css: string[];
}

const SSRWrapper = ({ response, css }: IProps) => {
  console.log("RENDERING ON SERVER");
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>SSR KOA</title>
        {css.map((cssPath) => (
          <link key={cssPath} rel="stylesheet" href={cssPath}></link>
        ))}
      </head>
      <body>
        <div id="root">
          <AppServer />
        </div>
      </body>
    </html>
  );
};

export default SSRWrapper;
