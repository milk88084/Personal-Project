import "./App.css";
import { useNavigate } from "react-router-dom";
import { useFormInput } from "./utils/hooks/useFormInput";
import { useState } from "react";

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

  return (
    <>
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

      {/* <div className="h-full w-full absolute top-0 right-0 border-gray-300 flex items-center mr-8 gap-5 bg-black bg-opacity-75">
        <div className="h-96 w-7/12 flex items-center bg-yellow-700">
          <div className="flex flex-col">
            <label>
              請輸入登錄信箱:
              <input className="mt-0.5" {...emailProps} />
            </label>
            <label className="mt-6">
              請輸入登錄密碼:
              <input {...passwordProps} />
            </label>
            <button className="mt-6 bg-white">登入</button>
            <button className="mt-6 bg-white">我要註冊</button>
          </div>
        </div>
      </div> */}
    </>
  );
}

export default App;
