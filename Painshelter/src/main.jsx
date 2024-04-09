import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Member from "./pages/Member/index.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="member" element={<Member />} />
      </Routes>
    </BrowserRouter>

    {/* <App /> */}
  </React.StrictMode>
);
