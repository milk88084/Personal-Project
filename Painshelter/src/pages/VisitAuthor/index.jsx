import { db } from "../../utils/firebase/firebase.jsx";
import { collection, query, getDocs, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const VisitAuthor = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);

  console.log("1323", state.data);
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
          userId: doc.data().useriId,
        }));
        setStories(userStoryList);
      } catch (e) {
        console.log(e);
      }
    }
    getStories();
  }, []);

  return (
    <>
      <p>這個作者叫做： {state.data}</p>
      {stories.map((story, index) => {
        return (
          <div className="bg-blue-600 text-white mt-3 " key={index}>
            <p>疼痛暗號：{story.title}</p>
            <p>故事地點：{story.location}</p>
            <p>時間：{story.time}</p>
            <p>類型：{story.type}</p>
            <p>圖片：{story.figure}</p>
            <p>內容：{story.story}</p>
          </div>
        );
      })}
      <button onClick={() => navigate("/")}>回首頁</button>
    </>
  );
};

export default VisitAuthor;
