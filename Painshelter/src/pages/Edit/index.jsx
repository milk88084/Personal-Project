import React from "react";
import { useNavigate } from "react-router-dom";
import locationData from "../../utils/data/location.json";
import { useLoginState } from "../../utils/zustand.js";
import { useFormInput } from "../../utils/hooks/useFormInput.jsx";
import { useCheckboxInput } from "../../utils/hooks/useCheckboxInput.jsx";
import { db } from "../../utils/firebase/firebase.jsx";
import { Timestamp, addDoc, collection, updateDoc } from "firebase/firestore";

export default function Edit() {
  const navigate = useNavigate();
  const { getLoginUserId } = useLoginState();
  const postStory = useFormInput();
  const storyTitle = useFormInput();
  const storyTime = useFormInput();
  const storyLocation = useFormInput();
  const localStorageUserId = window.localStorage.getItem("userId");
  const storyTypeData = [
    "成長軌跡",
    "情感關係",
    "人際交流",
    "生命經歷",
    "職場發展",
  ];
  const storyFigureData = [
    "親人",
    "伴侶",
    "朋友",
    "關係人",
    "陌生人",
    "那個他",
    "內在自我",
  ];
  const storyType = useCheckboxInput(storyTypeData);
  const storyFigure = useCheckboxInput(storyFigureData);

  const handleSubmit = async (event) => {
    // alert("Your favorite flavor is: ");
    event.preventDefault();
    console.log(storyTitle.value);
    console.log(storyTime.value);
    console.log(storyLocation.value);
    console.log(storyType.getSortedCheckedValues());
    console.log(storyFigure.getSortedCheckedValues());
    console.log(postStory.value);

    try {
      const docRef = await addDoc(collection(db, "posts"), {
        title: storyTitle.value,
        time: storyTime.value,
        location: storyLocation.value,
        type: storyType.getSortedCheckedValues(),
        figure: storyFigure.getSortedCheckedValues(),
        story: postStory.value,
        userId: localStorageUserId,
        createdAt: Timestamp.fromDate(new Date()),
      });
      await updateDoc(docRef, { storyId: docRef.id });
      console.log("Document written with ID: ", docRef.id);
      console.log(getLoginUserId());
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    navigate("/history");
    alert("成功提交：" + storyTitle.value + "故事");
  };

  return (
    <div>
      <p className="m-3 bg-yellow-300">這裡是要開始投稿故事的地方</p>

      <form onSubmit={handleSubmit}>
        <label className="block marker:m-3 bg-red-300">請輸入疼痛暗號</label>
        <input
          className=" border-2 border-black "
          type="text"
          label="StoryTitle"
          value={storyTitle.value}
          onChange={storyTitle.onChange}
          {...storyTitle}
          required
          placeholder="陽明山的星星"
        />

        <label className="block m-3 bg-yellow-300">發生時間</label>
        <input
          type="date"
          label="Story time"
          value={storyTime.value}
          onChange={storyTime.onChange}
          {...storyTime}
          required
        />

        <label className="block m-3 bg-yellow-300"> 發生地點</label>
        <select {...storyLocation} required>
          {locationData.map((value) => {
            return (
              <option key={value} value={value} required>
                {value}
              </option>
            );
          })}
        </select>

        <label className="block m-3 bg-red-300">故事類型</label>
        <ul>
          <li>
            <input
              type="checkbox"
              onChange={storyType.onChange}
              value="成長軌跡"
            />
            成長軌跡
          </li>
          <li>
            <input
              type="checkbox"
              onChange={storyType.onChange}
              value="情感關係"
            />
            情感關係
          </li>
          <li>
            <input
              type="checkbox"
              onChange={storyType.onChange}
              value="人際交流"
            />
            人際交流
          </li>
          <li>
            <input
              type="checkbox"
              onChange={storyType.onChange}
              value="生命經歷"
            />
            生命經歷
          </li>
          <li>
            <input
              type="checkbox"
              onChange={storyType.onChange}
              value="職場發展"
            />
            職場發展
          </li>
        </ul>

        <label className="block m-3 bg-yellow-300">故事對象</label>
        <ul>
          <li>
            <input
              type="checkbox"
              onChange={storyFigure.onChange}
              value="親人"
            />
            親人
          </li>
          <li>
            <input
              type="checkbox"
              onChange={storyFigure.onChange}
              value="伴侶"
            />
            伴侶
          </li>
          <li>
            <input
              type="checkbox"
              onChange={storyFigure.onChange}
              value="朋友"
            />
            朋友
          </li>
          <li>
            <input
              type="checkbox"
              onChange={storyFigure.onChange}
              value="關係人"
            />
            關係人
          </li>

          <li>
            <input
              type="checkbox"
              onChange={storyFigure.onChange}
              value="陌生人"
            />
            陌生人
          </li>
          <li>
            <input
              type="checkbox"
              onChange={storyFigure.onChange}
              value="那個他"
            />
            那個他
          </li>
          <li>
            <input
              type="checkbox"
              onChange={storyFigure.onChange}
              value="內在自我"
            />
            內在自我
          </li>
        </ul>

        <div>
          <p className="m-3 bg-red-300">請輸入入故事內容</p>
          <input
            className=" border-2 border-black "
            type="text"
            label="Post story"
            {...postStory}
            required
            placeholder="那一天，我哭了一整夜"
            value={postStory.value}
            onChange={postStory.onChange}
          />
        </div>

        <input
          onSubmit={handleSubmit}
          className="m-3 bg-yellow-300"
          type="submit"
          value="送出"
        />
      </form>
      <button className="m-3 bg-yellow-300" onClick={() => navigate("/")}>
        回到首頁
      </button>
    </div>
  );
}
