import { db } from "@/utils/firebase/firebase.jsx";
import { useAuthCheck } from "@/utils/hooks/useAuthCheck.jsx";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, query, getDocs, where } from "firebase/firestore";

export default function SinglePage() {
  const [story, setStory] = useState();
  const navigate = useNavigate();
  const params = useParams();
  useAuthCheck();

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
        alert(e);
      }
    }
    getStories();
  }, []);

  if (!story) {
    return <p>isLoding</p>;
  }

  let objectDate = new Date(story[0].time);
  let year = objectDate.getFullYear();
  let month = objectDate.getMonth() + 1;
  let day = objectDate.getDate();

  return (
    <div>
      <div className="flex justify-center items-center ">
        <div className="w-6/12 h-screen text-center ">
          <p className="text-gray-50 font-black text-right mr-3.5 text-large w-full">
            {year}
          </p>
          <div>
            <p className="text-4xl font-black text-left ml-60 mb-5 text-gray-500">
              疼痛暗號
            </p>
            <p className="text-9xl font-black text-gray-500 ">
              {story && story[0]?.title}
            </p>
          </div>

          <p className="text-gray-50 font-black text-left mr-3.5 text-large">
            {month}
            {day}
          </p>
        </div>
        <div className="w-6/12 h-screen bg-black  flex flex-col justify-center items-center ">
          <div className="w-9/12 h-4/5 bg-white opacity-60 p-8 rounded-3xl relative">
            <div className=" mt-7">
              <p className="text-xl font-bold">投稿時間</p>
              <p className="mt-3 bg-white w-6/19">{story && story[0]?.time}</p>
            </div>

            <div className="mt-6">
              <p className="text-xl font-bold">故事地點</p>
              <p className="mt-3 bg-white w-6/19">
                {story && story[0]?.location.name}
              </p>
            </div>

            <div className=" mt-6">
              <p className="text-xl font-bold">疼痛故事</p>
              <p className="mt-3 bg-white w-6/19 ">
                {story && story[0]?.story}
              </p>
            </div>

            <div className="absolute bottom-0 flex justify-between w-11/12 mb-4">
              <button className="bg-gray-800 p-3 rounded-md  w-24 text-white hover:bg-red-900">
                分享
              </button>
              <button
                onClick={() => navigate("/history")}
                className="bg-gray-800 p-3 rounded-md  w-24 text-white hover:bg-red-900"
              >
                回上一頁
              </button>

              <button
                onClick={() => navigate("/")}
                className="bg-gray-800 p-3 rounded-md w-24 text-white hover:bg-red-900"
              >
                主頁
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
