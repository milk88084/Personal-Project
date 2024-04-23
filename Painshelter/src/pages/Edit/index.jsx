import { useEffect, useState } from "react";
import { useLoginState } from "../../utils/zustand.js";
import { useFormInput } from "../../utils/hooks/useFormInput.jsx";
import { useCheckboxInput } from "../../utils/hooks/useCheckboxInput.jsx";
import { db } from "../../utils/firebase/firebase.jsx";
import {
  Timestamp,
  addDoc,
  collection,
  updateDoc,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import LocationSearch from "../../components/LocationSearch.jsx";

import { useNavigate, useParams } from "react-router-dom";

export default function Edit() {
  const params = useParams();
  const navigate = useNavigate();
  const { getLoginUserId, locationSerach } = useLoginState();
  const postStory = useFormInput();
  const storyTitle = useFormInput();
  const storyTime = useFormInput();
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
  const [story, setStory] = useState();

  const storyLocation = locationSerach[0];
  console.log(storyLocation);

  const handleSubmit = async (event) => {
    // alert("Your favorite flavor is: ");
    event.preventDefault();
    console.log(storyTitle.value);
    console.log(storyTime.value);
    console.log(storyType.getSortedCheckedValues());
    console.log(storyFigure.getSortedCheckedValues());
    console.log(postStory.value);

    try {
      const docRef = await addDoc(collection(db, "posts"), {
        title: storyTitle.value,
        time: storyTime.value,
        location: storyLocation,
        type: storyType.getSortedCheckedValues(),
        figure: storyFigure.getSortedCheckedValues(),
        story: postStory.value,
        userId: localStorageUserId,
        createdAt: Timestamp.fromDate(new Date()),
      });
      await updateDoc(docRef, { storyId: docRef.id });
      console.log("Document written with ID: ", docRef.id);
      console.log(getLoginUserId());
      alert("成功提交：" + storyTitle.value + "故事");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("投稿失敗");
    }
    navigate("/history");
  };

  useEffect(() => {
    async function getStories() {
      try {
        const postsData = collection(db, "posts");
        const q = query(postsData, where("storyId", "==", params.id));

        const querySnapshot = await getDocs(q);
        const userStoryList = querySnapshot.docs.map((doc) => ({
          title: doc.data().title,
          time: doc.data().time,
          location: doc.data().location,
          type: doc.data().type,
          figure: doc.data().figure,
          story: doc.data().story,
          userComments: doc.data().userComments,
          likedAuthorId: doc.data().likedAuthorId,
          storyId: doc.data().storyId,
        }));
        setStory(userStoryList);
      } catch (e) {
        console.log(e);
      }
    }
    getStories();
  }, []);
  console.log(story);

  return (
    <body className="bg-black min-h-screen relative flex justify-center">
      <div className="text-white text-6xl mt-10">文章編輯</div>
      <div className="bg-gray-100 w-6/12 h-5/6 bottom-0 absolute rounded-t-3xl">
        <form onSubmit={handleSubmit} className="p-16">
          <div className="flex items-center">
            <label className="block marker:m-3 text-3xl mr-12 font-semibold">
              疼痛暗號
            </label>
            <input
              className=" border-2 border-black w-1/2"
              type="text"
              label="StoryTitle"
              value={storyTitle.value}
              onChange={storyTitle.onChange}
              {...storyTitle}
              required
              placeholder={story[0].title}
            />
          </div>
          <div className="flex mt-12 items-center">
            <label className="block marker:m-3 text-3xl mr-12 font-semibold">
              發生時間
            </label>
            <input
              className="inline"
              type="date"
              label="Story time"
              value={storyTime.value}
              onChange={storyTime.onChange}
              {...storyTime}
              required
            />
          </div>

          <div className="flex mt-12">
            <label className="block marker:m-3 text-3xl mr-12 font-semibold">
              發生地點
            </label>
            <LocationSearch />
          </div>

          <div className="flex mt-12 items-center">
            <label className="block marker:m-3 text-3xl mr-12 font-semibold">
              故事類型
            </label>
            <ul className="flex">
              <li className="mr-6">
                <input
                  type="checkbox"
                  onChange={storyType.onChange}
                  value="成長軌跡"
                />
                成長軌跡
              </li>
              <li className="mr-6">
                <input
                  type="checkbox"
                  onChange={storyType.onChange}
                  value="情感關係"
                />
                情感關係
              </li>
              <li className="mr-6">
                <input
                  type="checkbox"
                  onChange={storyType.onChange}
                  value="人際交流"
                />
                人際交流
              </li>
              <li className="mr-6">
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
          </div>

          <div className="flex mt-12 items-center">
            <label className="block marker:m-3 text-3xl mr-12 font-semibold">
              故事對象
            </label>
            <ul className="flex">
              <li className="mr-6">
                <input
                  type="checkbox"
                  onChange={storyFigure.onChange}
                  value="親人"
                />
                親人
              </li>
              <li className="mr-6">
                <input
                  type="checkbox"
                  onChange={storyFigure.onChange}
                  value="伴侶"
                />
                伴侶
              </li>
              <li className="mr-6">
                <input
                  type="checkbox"
                  onChange={storyFigure.onChange}
                  value="朋友"
                />
                朋友
              </li>
              <li className="mr-6">
                <input
                  type="checkbox"
                  onChange={storyFigure.onChange}
                  value="關係人"
                />
                關係人
              </li>
              <li className="mr-6">
                <input
                  type="checkbox"
                  onChange={storyFigure.onChange}
                  value="陌生人"
                />
                陌生人
              </li>
              <li className="mr-6">
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
          </div>

          <div className="mt-12">
            <p className="block marker:m-3 text-3xl mr-12 font-semibold">
              請輸入入故事內容
            </p>
            <textarea
              className=" border-2 border-black w-full h-24 mt-8"
              type="text"
              label="Post story"
              {...postStory}
              required
              placeholder={story[0].story}
              value={postStory.value}
              onChange={postStory.onChange}
            />
          </div>
          <div>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-800 p-3 rounded-md w-24 text-white hover:bg-red-900 mt-12 mr-6"
            >
              儲存內容
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-800 p-3 rounded-md w-36 text-white hover:bg-red-900 mt-12"
            >
              回到上一頁
            </button>
          </div>
        </form>
      </div>
      {/* <div>
        <p className="m-3 bg-yellow-300">這裡是編輯故事的地方</p>

        <form onSubmit={handleSubmit}>
          <label className="block marker:m-3 bg-red-300">請輸入疼痛暗號</label>
          <input
            className=" border-2 border-black w-1/2"
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

          <LocationSearch />

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
            <textarea
              className=" border-2 border-black w-1/2 h-24"
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
            className="m-3 bg-yellow-300 "
            type="submit"
            value="儲存"
          />
        </form>
        <button className="m-3 bg-yellow-300" onClick={() => navigate("/")}>
          回到首頁
        </button>
        <button
          className="m-3 bg-yellow-300"
          onClick={() => navigate("/history")}
        >
          回到歷史文章
        </button>
      </div> */}
    </body>
  );
}
