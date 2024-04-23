import { useEffect, useState } from "react";
import { useLoginState } from "../../utils/zustand.js";
import { useFormInput } from "../../utils/hooks/useFormInput.jsx";
import { useCheckboxInput } from "../../utils/hooks/useCheckboxInput.jsx";
import LocationSearch from "../../components/LocationSearch.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../utils/firebase/firebase.jsx";
import {
  Timestamp,
  collection,
  updateDoc,
  query,
  getDocs,
  where,
} from "firebase/firestore";

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
export default function Edit() {
  const params = useParams();
  const navigate = useNavigate();
  const { locationSerach } = useLoginState();
  const postStory = useFormInput();
  const storyTitle = useFormInput();
  const storyTime = useFormInput();
  const storyType = useCheckboxInput(storyTypeData);
  const storyFigure = useCheckboxInput(storyFigureData);
  const [story, setStory] = useState();
  const storyLocation = locationSerach[0];
  console.log(storyLocation);

  //取得db資料
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

  //更新db資料
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(storyTitle.value);
    console.log(storyTime.value);
    console.log(storyType.getSortedCheckedValues());
    console.log(storyFigure.getSortedCheckedValues());
    console.log(postStory.value);
    try {
      const q = query(
        collection(db, "posts"),
        where("storyId", "==", params.id)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          title: storyTitle.value,
          time: storyTime.value,
          location: storyLocation,
          type: storyType.getSortedCheckedValues(),
          figure: storyFigure.getSortedCheckedValues(),
          story: postStory.value,
          modifiedAt: Timestamp.fromDate(new Date()),
        });
        alert("成功修改：" + storyTitle.value + "故事");
      } else {
        console.error("No document found with the given storyId");
        alert("修改失敗");
      }
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("修改失敗");
    }
  };

  return (
    <body className="bg-black min-h-screen relative flex justify-center z-20">
      <div className="text-white text-6xl mt-10">文章編輯</div>
      <div className="bg-gray-100 w-7/12 h-5/6 bottom-0 absolute rounded-t-3xl">
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
              placeholder={story && story[0]?.title}
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

          <div className="flex mt-12 items-center">
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
              請輸入故事內容
            </p>
            <textarea
              className=" border-2 border-black w-full h-48 mt-8 "
              type="text"
              label="Post story"
              {...postStory}
              required
              placeholder={story && story[0]?.story}
              value={postStory.value}
              onChange={postStory.onChange}
            />
          </div>
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              className="bg-gray-800 p-3 rounded-md w-24 text-white hover:bg-red-900  mr-6"
            >
              儲存內容
            </button>
            <button
              onClick={() => navigate("/history")}
              className="bg-gray-800 p-3 rounded-md w-36 text-white hover:bg-red-900 "
            >
              回到上一頁
            </button>
          </div>
        </form>
      </div>
    </body>
  );
}
