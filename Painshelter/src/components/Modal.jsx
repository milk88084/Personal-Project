import React, { useEffect, useState } from "react";
import Backdrop from "./Backdrop";
import { db } from "../utils/firebase/firebase.jsx";
import { collection, query, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useLoginState } from "../utils/zustand.js";

export default function Modal({ comebinedArray, clickTitle }) {
  const navigate = useNavigate();
  const [modalPost, setModalPost] = useState([]);
  const [stories, setStories] = useState([]);
  const { modal, showModal, closeModal } = useLoginState();

  //拿取所有的db資料
  useEffect(() => {
    async function getStories() {
      try {
        const data = collection(db, "posts");
        const q = query(data);
        const querySnapshot = await getDocs(q);
        const storyList = querySnapshot.docs.map((doc) => ({
          title: doc.data().title,
          time: doc.data().time,
          type: doc.data().type,
          figure: doc.data().figure,
          story: doc.data().story,
          userId: doc.data().userId,
          storyId: doc.data().storyId,
        }));
        setStories(storyList);
      } catch (e) {
        console.log(e);
      }
    }
    getStories();
  }, []);

  // console.log(comebinedArray);

  //判斷點選的title是否吻合db資料，是的話呈現在頁面上
  useEffect(() => {
    const metchedItem = stories.find((data) => data.title === clickTitle.item);
    if (metchedItem) {
      setModalPost(metchedItem);
    }
  }, [stories, clickTitle]);
  // console.log(modalPost);

  const handleVisitAthor = (id) => {
    navigate("/visit", { state: { data: id } });
    closeModal();
  };

  return (
    <div>
      <Backdrop />
      <div
        className={
          modal
            ? "translate-y-0 opacity-100 fixed z-2010 w-2/4 bg-white border border-black border-solid shadow-sm p-4 left-1/4 box-border"
            : "translate-y-full opacity-0"
        }
      >
        <div>
          <h1>{modalPost.title}</h1>
          <p>{modalPost.time}</p>
          <p>{modalPost.story}</p>
        </div>
        <button
          onClick={() => {
            handleVisitAthor(modalPost.userId);
          }}
          className="bg-black text-white"
        >
          觀看作者
        </button>
      </div>
    </div>
  );
}
