import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/index.jsx";
import Signup from "./pages/Signup/index.jsx";
import History from "./pages/History/index.jsx";
import Help from "./pages/Help/index.jsx";
import Post from "./pages/Post/index.jsx";
import VisitAuthor from "./pages/VisitAuthor/index.jsx";
import Openrouteservice from "./components/LocationSearch.jsx";
import FigureType from "./components/Chart/FigureChart.jsx";
import SinglePostPage from "./pages/SinglePostPage/index.jsx";
import Edit from "./pages/Edit/index.jsx";
import AuthorSpecificPost from "./pages/AuthorSpecificPost/index.jsx";
import MusicHeal from "./pages/MusicHeal/index.jsx";
import LandingPage from "./pages/LandingPage/index.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="main" element={<App />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="history" element={<History />} />
        <Route path="help" element={<Help />} />
        <Route path="post" element={<Post />} />
        <Route path="visit" element={<VisitAuthor />} />
        <Route path="type" element={<FigureType />} />
        <Route path="post/:id" element={<SinglePostPage />} />
        <Route path="edit/:id" element={<Edit />} />
        <Route path="heal" element={<MusicHeal />} />
        <Route path="authorpost/:id" element={<AuthorSpecificPost />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<Navigate replace to="/main" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
