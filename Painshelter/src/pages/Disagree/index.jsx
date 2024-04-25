import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function Disagree() {
  const navigate = useNavigate();
  return (
    <div>
      <p>請你加油，不溫柔就不要來這裡</p>
      <h1>不要當個壞蛋</h1>

      <button className="bg-green-400 m-6" onClick={() => navigate("/")}>
        返回首頁
      </button>
    </div>
  );
}
