import "./App.css";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
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
    </>
  );
}

export default App;
