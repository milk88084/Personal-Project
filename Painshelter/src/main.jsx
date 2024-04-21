import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/index.jsx";
import Signup from "./pages/Signup/index.jsx";
import History from "./pages/History/index.jsx";
import Disagree from "./pages/Disagree/index.jsx";
import Help from "./pages/Help/index.jsx";
import Edit from "./pages/Edit/index.jsx";
import VisitAuthor from "./pages/VisitAuthor/index.jsx";
import Openrouteservice from "./components/LocationSearch.jsx";
import Type from "./components/Chart.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="history" element={<History />} />
        <Route path="disagree" element={<Disagree />} />
        <Route path="help" element={<Help />} />
        <Route path="edit" element={<Edit />} />
        <Route path="visit" element={<VisitAuthor />} />
        <Route path="go" element={<Openrouteservice />} />
        <Route path="type" element={<Type />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
