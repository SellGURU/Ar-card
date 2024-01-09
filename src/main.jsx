import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import HandDetect from "./HandDetect.jsx";
// import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
// import HandDetect2 from "./HandDetect2.jsx";
import App from "./App.jsx";
import 'symphony-ui/Themes/index.scss';
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App></App>
    {/* <HashRouter>
      <Routes>
        <Route index element={<Navigate replace to="/detect2" />} />
        <Route path="/detect1" element={<HandDetect />} />
        <Route path="/detect2" element={<HandDetect2 />} />
      </Routes>
    </HashRouter> */}
  </React.StrictMode>
);
