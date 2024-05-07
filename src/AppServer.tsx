import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Suspense, lazy } from "react";

const About = lazy(
  () => import("./pages/About" /* webpackChunkName:"about" */)
);

const LoadingScreen = () => {
  return <div>Loading...</div>;
};

function CustomRoute() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route
        element={
          <Suspense fallback={<>Loading..</>}>
            <About />
          </Suspense>
        }
        path="/about"
      />
    </Routes>
  );
}

export default CustomRoute;
