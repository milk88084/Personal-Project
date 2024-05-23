import { useEffect, useState, useRef } from "react";
import Backdrop from "./Backdrop";
import { useNavigate } from "react-router-dom";
import { useLoginState } from "@/utils/zustand";
import backgroundImg from "@/assets/img/outputimg.jpg";
import styled from "styled-components";
import { toPng } from "html-to-image";
import { ToastContainer } from "react-toastify";
import getFirebasePosts from "@/utils/firebase/firebaseService.js";

//#region
const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 3000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Main = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    height: 650px;
    border-radius: 15px;
  }
  @media screen and (max-width: 1279px) {
    img {
      height: 450px;
    }
  }
`;

const ContentSections = styled.div`
  width: 100%;
  position: absolute;
  opacity: 0.6;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  h1 {
    font-size: 30px;
    font-weight: 900;
    transform: rotate(-10deg);
    margin-right: 100px;
  }
  h2 {
    transform: rotate(90deg);
    font-size: 15px;
    margin-right: 360px;
    margin-bottom: 30px;
  }
  p {
    width: 100%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 15px;
    margin-top: 350px;
    text-align: center;
  }
  @media screen and (max-width: 1279px) {
    h1 {
      margin-right: 30px;
      margin-bottom: 50px;
    }
    h2 {
      font-size: 15px;
      margin-right: 200px;
      margin-bottom: 30px;
    }
    p {
      margin-top: 160px;
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

  useEffect(() => {
    const dataMapper = (docs) => [
      docs.map((doc) => ({
        title: doc.data().title,
        time: doc.data().time,
        type: doc.data().type,
        figure: doc.data().figure,
        story: doc.data().story,
        userId: doc.data().userId,
        storyId: doc.data().storyId,
      })),
    ];

    getFirebasePosts("posts", dataMapper, [setStories]);
  }, [setStories]);

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

  return (
    <div>
      <Backdrop />
      {modal ? (
        <Wrapper>
          <Main ref={captureRef}>
            <img src={backgroundImg} alt={backgroundImg} />
            <ContentSections>
              <h2> {modalPost.time}</h2>
              <h1>{modalPost.title}</h1>
              <p>{modalPost.story}</p>
            </ContentSections>
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
      <ToastContainer />
    </div>
  );
}
