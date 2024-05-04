import React from "react";

const AppServer = () => {
  return (
    <p onClick={() => console.log("OK")} className="text-red-500 text-4xl">
      Server Side Rendered Page
    </p>
  );
};

export default AppServer;
