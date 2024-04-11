// import "./App.css";
import { useNavigate } from "react-router-dom";
import { useFormInput } from "./utils/hooks/useFormInput";
import { useState } from "react";
import { auth } from "./utils/firebase/firebase.jsx";
import { signOut } from "firebase/auth";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

function App() {
  const navigate = useNavigate();
  const nameProps = useFormInput("Max");
  const emailProps = useFormInput("exmple.com");
  const passwordProps = useFormInput("<PASSWORD>");
  const [loginState, setLoginState] = useState(false);

  const loginName = true;

  const handleLogin = () => {
    setLoginState(true);
  };

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
  };

  return (
    <>
      <div></div>

      {/* 以下是所有功能列表 */}
      <div>標題</div>
      <p>Slogen</p>
      <div>
        <button className="bg-red-600 text-white">
          這裡是一個深夜模式按鈕
        </button>
      </div>
      <div>
        <button className="bg-blue-600 text-white mt-3">登錄</button>
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

      <Login />

      {/* 登出 */}
      <nav className="mt-5">
        <div>
          <button onClick={handleLogout} className=" border-2 border-black ">
            登出
          </button>
        </div>
      </nav>

      {/* 註冊 */}
      <Signup />
    </>
  );
}

export default App;
