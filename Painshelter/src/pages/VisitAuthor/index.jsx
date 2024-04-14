import { db } from "../../utils/firebase/firebase.jsx";
import { collection, query, getDocs, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PostReply } from "../../utils/shadcn/PostReply.jsx";

const VisitAuthor = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const localStorageUserId = window.localStorage.getItem("userId");

  console.log("這裡是這個作者的歷史文章", state.data);
  //   const {} = useParams();

  useEffect(() => {
    async function getStories() {
      try {
        const postsData = collection(db, "posts");
        const q = query(postsData, where("userId", "==", state.data));

        const querySnapshot = await getDocs(q);
        const userStoryList = querySnapshot.docs.map((doc) => ({
          title: doc.data().title,
          time: doc.data().time,
          location: doc.data().location,
          type: doc.data().type,
          figure: doc.data().figure,
          story: doc.data().story,
          userId: doc.data().userId,
        }));
        setStories(userStoryList);
      } catch (e) {
        console.log(e);
      }
    }
    getStories();
  }, []);

  const isUserStories = stories.every(
    (story) => story.userId === localStorageUserId
  );

  return (
    <>
      {isUserStories ? (
        <p>這是你自己的頁面</p>
      ) : (
        <p>這個作者叫做： {state.data}</p>
      )}

      {stories.map((story, index) => {
        return (
          <div className="bg-blue-600 text-white mt-3 " key={index}>
            <p>疼痛暗號：{story.title}</p>
            <p>故事地點：{story.location}</p>
            <p>時間：{story.time}</p>
            <p>類型：{story.type}</p>
            <p>人物：{story.figure}</p>
            <p>內容：{story.story}</p>
            <div className="bg-yellow-300 flex justify-evenly text-black ">
              <span>按讚數量</span>
              <span>留言回覆</span>
            </div>
            <div className="bg-white flex justify-evenly text-black ">
              <button className="bg-red-300" onClick={() => alert("按讚加一")}>
                我要按讚
              </button>
              <span>我要留言</span>
              <PostReply />
            </div>
          </div>
        );
      })}
      <button onClick={() => navigate("/")}>回首頁</button>
    </>
  );
};

export default VisitAuthor;
