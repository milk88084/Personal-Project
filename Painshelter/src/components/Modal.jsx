import React, { useEffect, useState, useRef } from "react";
import Backdrop from "./Backdrop";
import { db } from "../utils/firebase/firebase.jsx";
import { collection, query, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useLoginState } from "../utils/zustand.js";
import html2canvas from "html2canvas";
import backgroundImg from "../assets/img/outputimg.jpg";
import styled from "styled-components";
import { toPng } from "html-to-image";

//#region
const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 3000;
`;

const Main = styled.div`
  height: 100%;
  position: relative;

  img {
    position: absolute;
    height: 70%;
    border-radius: 15px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const Capture = styled.div``;

const ContentSections = styled.div`
  position: relative;
  color: #424242;
  opacity: 0.6;
  h1 {
    width: 230px;
    position: absolute;
    left: 720px;
    top: 400px;
    font-size: 30px;
    font-weight: 900;
    transform: rotate(-10deg);
  }
  h2 {
    position: absolute;
    transform: rotate(90deg);
    font-size: 15px;
    left: 565px;
    top: 360px;
  }
  p {
    position: absolute;
    width: 250px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    right: 620px;
    top: 510px;
    font-size: 15px;
  }
  @media screen and (max-width: 1279px) {
    h1 {
      width: 100px;
      left: 200px;
      top: 380px;
      font-size: 15px;
      font-weight: 600;
    }
    h2 {
      font-size: 12px;
      left: 40px;
    }
    p {
      width: 250px;
      right: 78px;
      top: 450px;
      font-size: 15px;
    }
  }
  @media screen and (max-width: 1279px) {
    h1 {
      width: 150px;
      left: 200px;
      top: 330px;
      font-size: 25px;
      font-weight: 600;
    }
    h2 {
      font-size: 13px;
      left: 80px;
      top: 300px;
    }
    p {
      width: 250px;
      right: 110px;
      top: 400px;
      font-size: 15px;
    }
  }
  @media screen and (max-width: 479px) {
    h1 {
      width: 100px;
      left: 200px;
      top: 380px;
      font-size: 15px;
      font-weight: 600;
    }
    h2 {
      font-size: 12px;
      left: 40px;
    }
    p {
      width: 250px;
      right: 78px;
      top: 450px;
      font-size: 15px;
    }
  }
`;

const ButtonSections = styled.div`
  position: absolute;
  bottom: 1%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    width: 100px;
    background-color: #001a2a;
    color: white;
    padding: 10px;
    border-radius: 10px;
    font-weight: 400;
    box-shadow: 0 10px 10px -8px rgba(0, 0, 0, 0.7);
    margin: 6px;

    &:hover,
    &:focus {
      background-color: #4c5e67;
    }
  }
  @media screen and (max-width: 1279px) {
    bottom: 1px;
    width: 300px;
    button {
      width: 100%;
      padding: 7px;
      margin: 2px;
    }
  }
`;

//#endregion

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
    window.scrollTo(0, 0);
  };

  //螢幕截圖
  const captureRef = useRef(null);
  const handleCaptureClick = () => {
    if (captureRef.current) {
      toPng(captureRef.current)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = "captured-image.png";
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error("Failed to capture the image", error);
        });
    }
  };
  console.log(captureRef.current);

  return (
    <div>
      <Backdrop />
      {modal ? (
        <Wrapper>
          <Main ref={captureRef}>
            <Capture ref={captureRef}>
              <img src={backgroundImg} alt={backgroundImg} />
              <ContentSections>
                <h1>{modalPost.title}</h1>
                <h2> {modalPost.time}</h2>
                <p>{modalPost.story}</p>
              </ContentSections>
            </Capture>
          </Main>
          <ButtonSections>
            <button
              onClick={() => {
                handleVisitAthor(modalPost.userId);
              }}
            >
              觀看作者
            </button>
            <button onClick={handleCaptureClick}>儲存成圖片</button>
            <button onClick={closeModal}>關閉</button>
          </ButtonSections>
        </Wrapper>
      ) : null}
    </div>
  );
}
