import { collection, query, getDocs, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";

import defaultImg from "@/assets/img/defaultImg.png";
import logoImg from "@/assets/img/logoImg.png";
import logoTitle from "@/assets/img/logoTitle.png";
import { db } from "@/utils/firebase/firebase.jsx";
import {
  submitFollowAuthor,
  getSnapshotPostsData,
  getVisitUserData,
} from "@/utils/firebase/firebaseService.js";
import { toastAlert } from "@/utils/toast.js";

//#region
const LeftSectionWrapper = styled.div`
  display: none;
  @media screen and (max-width: 1279px) {
    z-index: 300;
    background-color: #666666;
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
`;

const CloseButton = styled.div`
  @media screen and (max-width: 1279px) {
    font-size: 30px;
    position: absolute;
    right: 0;
    top: 0;
    margin-right: 20px;
  }
`;

const LeftNameSection = styled.div`
  font-weight: bolder;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;

  img {
    width: 60px;
    border-radius: 50px;
    height: 60px;
    margin-bottom: 20px;
    border: 1px solid white;
  }

  h1 {
    font-size: 35px;
    margin-bottom: 20px;
    text-align: center;
  }

  span {
    width: 80px;
    font-size: 15px;
    padding: 7px;
    font-weight: 300;
    background-color: #9ca3af;
    color: black;
    border-radius: 15px;
    text-align: center;
  }
  @media screen and (max-width: 1279px) {
    font-size: 40px;
    padding: 20px;
    margin-top: 30px;
  }
`;

const IsFollowed = styled.div`
  button {
    padding: 8px;
    border-radius: 10px;
    font-weight: 400;
    font-size: 20px;
    background-color: #19242b;
    color: white;

    &:hover,
    &:focus {
      background-color: #9ca3af;
      color: black;
    }
  }

  @media screen and (max-width: 1279px) {
    button {
      font-size: 10px;
      margin-right: 0px;
      margin-bottom: 0px;
    }
  }
`;

const IsFollowAuthor = styled.div`
  span {
    padding: 6px;
    border-radius: 10px;
    font-weight: 400;
    font-size: 20px;
    background-color: #ffffff;
    color: #19242b;
  }

  @media screen and (max-width: 1279px) {
    span {
      font-size: 10px;
      margin-right: 0px;
      margin-bottom: 0px;
    }
  }
`;

const LeftButtonSection = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  button {
    font-size: 25px;
    height: 40px;
    margin: 7px;
    opacity: 0.3;
    text-shadow: 1px 1px 20px white;
  }

  button:nth-child(1) {
    opacity: 0.6;
  }

  button:hover {
    font-size: 32px;
    margin: 8px;
    opacity: 1;
    font-weight: 600;
  }

  @media screen and (max-width: 1279px) {
    padding: 20px;
    button {
      font-size: 25px;
      margin: 0px;
      opacity: 0.3;
    }

    button:hover {
      font-size: 20px;
      margin: 4px;
    }
  }
`;

const LogoSection = styled.div`
  width: 100%;
  height: 150px;
  border-radius: 20%;
  display: flex;
  justify-content: space-around;
  align-items: center;

  div {
    display: flex;
  }

  img {
    width: 50px;
    height: 50px;
  }

  img:nth-of-type(2) {
    width: 120px;
  }

  @media screen and (max-width: 1279px) {
    img {
      width: 40px;
      height: 40px;
    }

    img:nth-of-type(2) {
      width: 100px;
    }
  }
`;
//#endregion
export default function LeftSectionMobile({ setIsMobileSize }) {
  const { state } = useLocation();
  const [stories, setStories] = useState([]);
  const [author, setAuthor] = useState([]);
  const [isFollow, setIsFollow] = useState(false);

  const navigate = useNavigate();
  const localStorageUserId = window.localStorage.getItem("userId");

  useEffect(() => {
    let unsubscribe;
    if (localStorageUserId) {
      unsubscribe = getSnapshotPostsData(state.data, setStories);
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [localStorageUserId]);

  const isUserStories = stories.every(
    (story) => story.userId === localStorageUserId
  );

  useEffect(() => {
    getVisitUserData(state.data, setAuthor);
  }, []);

  const profileImg = author[0]?.img || defaultImg;

  const handleFollow = async () => {
    await submitFollowAuthor(localStorageUserId, state.data, setIsFollow);
  };

  useEffect(() => {
    async function commfirmFollow() {
      try {
        const q = query(
          collection(db, "users"),
          where("id", "==", localStorageUserId)
        );
        const querySnapshot = await getDocs(q);
        const docData = querySnapshot.docs[0].data().followAuthor;
        if (docData.includes(state.data)) {
          setIsFollow(true);
        } else {
          setIsFollow(false);
        }
      } catch (e) {
        toastAlert("error", e, 2000);
      }
    }
    commfirmFollow();
  }, []);

  return (
    <LeftSectionWrapper>
      <CloseButton>
        <button onClick={() => setIsMobileSize(false)}>x</button>
      </CloseButton>
      <LeftNameSection>
        {isUserStories ? (
          <>
            <img src={profileImg} alt={profileImg} />
            <h1>{`${author[0]?.name}`}</h1>
            <span>作者本人</span>
          </>
        ) : (
          <>
            <img src={profileImg} alt={profileImg} />
            <h1>{`${author[0]?.name}`}</h1>
            {!isFollow ? (
              <IsFollowed>
                <button onClick={handleFollow}>關注作者</button>
              </IsFollowed>
            ) : (
              <IsFollowAuthor>
                <span disabled>已關注作者</span>
              </IsFollowAuthor>
            )}
          </>
        )}
      </LeftNameSection>
      <LeftButtonSection>
        <button onClick={() => navigate("/history")}>撰寫文章</button>
        <button onClick={() => navigate("/main")}>返回首頁</button>
      </LeftButtonSection>

      <LogoSection>
        <div>
          <img src={logoImg} alt={logoImg} />
          <img src={logoTitle} alt={logoTitle}></img>
        </div>
      </LogoSection>
      <ToastContainer />
    </LeftSectionWrapper>
  );
}
