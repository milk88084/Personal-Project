import React from "react";
import { useNavigate } from "react-router-dom";

export default function History() {
  const navigate = useNavigate();
  return (
    <div>
      <p>每日一句</p>
      <p>內文</p>
      <button
        className="bg-blue-600 text-white mt-3"
        onClick={() => navigate("/edit")}
      >
        撰寫日記
      </button>
      <p>歷史日記</p>
    </div>
  );
}
