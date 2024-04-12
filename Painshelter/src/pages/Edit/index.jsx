import React from "react";
import locationData from "../../utils/data/location.json";
import { loginState } from "../../utils/zustand.js";
import { db } from "../../utils/firebase/firebase.jsx";

export default function Edit() {
  const handleSubmit = (event) => {
    alert("Your favorite flavor is: ");
    event.preventDefault();
  };

  return (
    <div>
      <p className="m-3 bg-yellow-300">這裡是要開始投稿故事的地方</p>

      <form>
        <label className="block marker:m-3 bg-red-300">請輸入疼痛暗號</label>
        <input className=" border-2 border-black " type="text" />

        <label className="block m-3 bg-yellow-300">發生時間</label>
        <input type="date" id="date" name="expiration" />

        <label className="block m-3 bg-yellow-300"> 發生地點</label>
        <select>
          {locationData.map((index) => {
            return <option key={index}>{index}</option>;
          })}
        </select>

        <label className="block m-3 bg-red-300">故事類型</label>
        <ul>
          <li>
            <input type="checkbox" name="title" value="K" />
            成長軌跡
          </li>
          <li>
            <input type="checkbox" name="title" value="Q" />
            情感關係
          </li>
          <li>
            <input type="checkbox" name="title" value="J" />
            人際交流
          </li>
          <li>
            <input type="checkbox" name="title" value="J" />
            生命經歷
          </li>
          <li>
            <input type="checkbox" name="title" value="J" />
            職場發展
          </li>
        </ul>

        <label className="block m-3 bg-yellow-300">故事對象</label>
        <ul>
          <li>
            <input type="checkbox" name="title" value="K" />
            親人
          </li>
          <li>
            <input type="checkbox" name="title" value="Q" />
            伴侶
          </li>
          <li>
            <input type="checkbox" name="title" value="J" />
            朋友
          </li>
          <li>
            <input type="checkbox" name="title" value="J" />
            關係人
          </li>
          <li>
            <input type="checkbox" name="title" value="J" />
            內在自我
          </li>
          <li>
            <input type="checkbox" name="title" value="J" />
            陌生人
          </li>
          <li>
            <input type="checkbox" name="title" value="J" />
            那個他
          </li>
        </ul>

        <div>
          <p className="m-3 bg-red-300">請輸入入故事內容</p>
          <input className=" border-2 border-black " type="text" />
        </div>

        <input
          onSubmit={handleSubmit}
          className="m-3 bg-yellow-300"
          type="submit"
          value="送出"
        />
      </form>
    </div>
  );
}
