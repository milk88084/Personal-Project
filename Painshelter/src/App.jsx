// import "./App.css";
import { useNavigate } from "react-router-dom";
import { useFormInput } from "./utils/hooks/useFormInput";
import { useState } from "react";
import { auth } from "./utils/firebase/firebase.jsx";
import { signOut } from "firebase/auth";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { loginState } from "./utils/zustand.js";

function App() {
  const navigate = useNavigate();
  const { getLoginStatus, online, offline } = loginState();

  const nameProps = useFormInput("Max");
  const emailProps = useFormInput("exmple.com");
  const passwordProps = useFormInput("<PASSWORD>");
  const [loginStates, setLoginStates] = useState(false);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
      });
    offline();
  };

  const handleAgree = () => {
    navigate("/login");
    online();
  };

  const handleDisagree = () => {
    navigate("/disagree");
    offline();
  };

  console.log(getLoginStatus());

  const loginOrNot = getLoginStatus();

  return (
    <>
      {loginOrNot ? null : (
        <div className="flex items-center justify-center h-screen w-full bg-gray-500 absolute opacity-80">
          <div className="flex flex-col items-center justify-center  border-black border-2 w-5/12 h-3/6 ">
            <h1>溫柔宣言</h1>
            <div>
              <p>1.我願意成為那個溫柔傾聽的存在。</p>
              <p>2.我承諾以尊重為前提,絕不輕易對任何故事發表批評。</p>
              <p>3.願每一份疼痛最都能找到他的安放之地,被溫柔地照看。</p>
            </div>
            <div>
              <button className="bg-green-400 m-6" onClick={handleDisagree}>
                不同意
              </button>
              <button className="bg-yellow-600 m-6" onClick={handleAgree}>
                {" "}
                同意
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 以下是所有功能列表 */}
      <div>標題</div>
      <p>Slogen</p>
      <div>
        <button className="bg-red-600 text-white">
          這裡是一個深夜模式按鈕
        </button>
      </div>
      <div>
        <button
          className="bg-blue-600 text-white mt-3"
          onClick={() => navigate("/history")}
        >
          疼痛日記室
        </button>
      </div>
      <div>
        <button className="bg-green-600 text-white mt-3">情緒光譜</button>
      </div>
      <div>
        <button className="bg-yellow-600 text-white mt-3">疼痛地圖</button>
      </div>

      <button className="bg-gray-600 text-white mt-3">心靈緊急按鈕</button>

      {/* 登出 */}
      <nav className="mt-5">
        <div>
          <button onClick={handleLogout} className=" border-2 border-black ">
            登出
          </button>
        </div>
      </nav>
    </>
  );
}

export default App;
