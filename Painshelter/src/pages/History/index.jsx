import React from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../utils/firebase/firebase.jsx";
import { collection, query, getDocs, where, limit } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useLoginState } from "../../utils/zustand.js";
import poem from "../../utils/data/poem.json";

export default function History() {
  const [stories, setStories] = useState([]);
  const navigate = useNavigate();
  const poemData = poem;
  const rand = Math.floor(Math.random() * poemData.length);
  const randPoem = poemData[rand];
  const { getLoginUserId } = useLoginState();
  const localStorageUserId = window.localStorage.getItem("userId");

  useEffect(() => {
    async function getStories() {
      try {
        const postsData = collection(db, "posts");
        const q = query(
          postsData,
          where("userId", "==", localStorageUserId),
          limit(6)
        );

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
        }));
        setStories(userStoryList);
      } catch (e) {
        console.log(e);
      }
    }
    getStories();
  }, [getLoginUserId]);

  console.log(stories);
  console.log(getLoginUserId());

  return (
    <div>
      <h2 className="text-6xl font-sans font-black tracking-wider text-center ">
        暖心小語
      </h2>
      <p className="m-3 bg-yellow-300">標題：{randPoem.title}</p>
      <p className="m-3 bg-green-300">內文：{randPoem.content}</p>
      <button
        className="bg-blue-600 text-white mt-3"
        onClick={() => navigate("/edit")}
      >
        點我撰寫日記
      </button>

      <p className="m-3 bg-yellow-300">歷史日記</p>
      {stories.map((story, index) => {
        return (
          <div className="bg-blue-600 text-white mt-3" key={index}>
            <p>標題：{story.title}</p>
            <p>時間：{story.time}</p>
            <p>地點：{story.location}</p>
            <p>類型：{story.type}</p>
            <p>人物：{story.figure}</p>
            <p>內文：{story.story}</p>
            <p>按讚數量：{story.likedAuthorId?.length}</p>
            <p>留言內容：{story.userComments}</p>
          </div>
        );
      })}
      <button
        className="bg-pink-600 text-white mt-3 m-2"
        onClick={() => navigate("/")}
      >
        點我回首頁
      </button>
    </div>
  );
}
