import React, { useEffect, useState, useRef } from "react";
import Backdrop from "./Backdrop";
import { db } from "../utils/firebase/firebase.jsx";
import { collection, query, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useLoginState } from "../utils/zustand.js";
import html2canvas from "html2canvas";
import backgroundImg from "../assets/img/outputimg.jpg";

export default function Modal({ comebinedArray, clickTitle }) {
  const navigate = useNavigate();
  const [modalPost, setModalPost] = useState([]);
  const [stories, setStories] = useState([]);
  const { modal, closeModal } = useLoginState();

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
  // console.log(modal);
  //判斷點選的title是否吻合db資料，是的話呈現在頁面上
  useEffect(() => {
    const metchedItem = stories.find((data) => data.title === clickTitle.item);
    if (metchedItem) {
      setModalPost(metchedItem);
    }
  }, [clickTitle]);

  const handleVisitAthor = (id) => {
    navigate("/visit", { state: { data: id } });
    closeModal();
  };

  //螢幕截圖
  const captureRef = useRef(null);

  const handleCaptureClick = () => {
    if (captureRef.current) {
      html2canvas(captureRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "capture.png";
        link.href = imgData;
        link.click();
      });
    }
  };

  return (
    <div>
      <Backdrop />
      {modal ? (
        <div className="fixed inset-0 z-2020  flex items-center justify-center shadow-sm">
          <div
            ref={captureRef}
            className="relative w-full h-full flex justify-center items-center"
          >
            <img
              className="absolute w-1/3 transform -translate-x-1/2 -translate-y-1/2"
              src={backgroundImg}
              alt=""
              style={{ top: "50%", left: "50%" }}
            />
            <div className="absolute ">
              <div className=" absolute top-1/2 left-1/2 text-1xl ">
                <h1 className="ml-24 rotate-6 text-gray-600 tracking-widest">
                  疼痛暗號
                </h1>
                <p className=" absolute text-4xl font-medium mt-16 text-gray-700 rotate-time">
                  {modalPost.title}
                </p>
              </div>

              <div className="fixed inset-0  flex justify-center items-center">
                <p className=" rotate-90 mr-content mt-28 text-gray-700 ">
                  {modalPost.time}
                </p>
              </div>
              <div>
                <p className="w-content mt-content text-gray-700 h-28 text-ellipsis">
                  {modalPost.story}
                </p>
              </div>
            </div>
            <div className=" z-2010 mt-button">
              <button
                onClick={() => {
                  handleVisitAthor(modalPost.userId);
                }}
                className="bg-white p-3 rounded-md mr-4  hover:bg-red-900"
              >
                觀看作者
              </button>
              <button
                onClick={handleCaptureClick}
                className="bg-white p-3 rounded-md mr-4  hover:bg-red-900"
              >
                儲存成圖片
              </button>
              <button
                onClick={closeModal}
                className="bg-white p-3 rounded-md mr-4  hover:bg-red-900"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
