import React from "react";

export default function Login() {
  return (
    <div>
      <p>請輸入帳號</p>
      <input className="bg-black" type="text" />
      <p>請輸入密碼</p>
      <input className="bg-black" type="text" />
      <button>確認</button>
    </div>
  );
}
