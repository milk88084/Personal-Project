import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Member from "./pages/Member/index.jsx";
import Login from "./pages/Login/index.jsx";
import Signup from "./pages/Signup/index.jsx";
import History from "./pages/History/index.jsx";
import Post from "./pages/Post/index.jsx";
import Disagree from "./pages/Disagree/index.jsx";
import Help from "./pages/Help/index.jsx";
import Edit from "./pages/Edit/index.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="member" element={<Member />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="history" element={<History />} />
        <Route path="post" element={<Post />} />
        <Route path="disagree" element={<Disagree />} />
        <Route path="help" element={<Help />} />
        <Route path="edit" element={<Edit />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
