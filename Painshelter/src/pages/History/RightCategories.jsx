import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import styled, { keyframes } from "styled-components";

import categoryImg from "@/assets/img/categoryImg.jpg";
import broke from "@/assets/img/historyBroke.png";
import jar from "@/assets/img/historyJar.png";
import logoImg from "@/assets/img/logoImg.png";
import AnimatedNumber from "@/components/AnimatedNumber.jsx";
import Buttons from "@/components/Buttons.jsx";
import {
  getFirebasePosts,
  getFirebaseUsers,
  getAuthorsByIds,
} from "@/utils/firebase/firebaseService.js";
import { toastAlert } from "@/utils/toast.js";

//#region
const Categories = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100vh;
  padding: 30px;
  width: 100%;

  section {
    width: 100%;
    display: flex;
    margin-bottom: 15px;
  }

  span {
    width: 100px;
  }
  @media screen and (max-width: 1279px) {
    padding: 0px;
    margin-top: 15px;
    margin-bottom: 20px;
    height: 100%;

    section {
      flex-direction: column;
      margin: 15px;
      justify-content: center;
      align-items: center;
    }

    span {
      height: 15px;
    }
  }
`;

const TopCategoriesPressure = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border: 4px solid #888888;
  border-radius: 20px;
  height: 180px;
  font-size: 50px;
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: rgb(255, 255, 255, 0.4);
  }

  &:active {
    transform: scale(0.9);
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }

  span {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    height: 100px;
  }

  @media screen and (max-width: 1279px) {
    width: 400px;
    margin: 15px 0px;
    img {
      height: 60px;
    }
  }
`;

const TopCategoriesFriends = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border: 4px solid #888888;
  border-radius: 20px;
  height: 180px;
  font-size: 50px;
  padding: 10px;

  span {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    height: 100px;
  }

  @media screen and (max-width: 1279px) {
    width: 400px;
    margin: 15px 0px;
    img {
      height: 60px;
    }
  }
`;

const CategoriesImg = styled.div`
  border-radius: 20px;
  margin-bottom: 18px;
  width: 100%;
  overflow: hidden;
  height: 180px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  @media screen and (max-width: 1279px) {
    display: none;
  }
`;

const glowing = keyframes`
  0% { box-shadow: 0 0 5px white; }
  50% { box-shadow: 0 0 20px white; }
  100% { box-shadow: 0 0 5px white; }
`;

const CategoriesSection = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(255, 255, 255, 0.4);
  padding: 15px;
  border-radius: 20px;

  img {
    width: 150px;
    margin-right: 20px;
  }

  h1 {
    font-size: 25px;
    margin-bottom: 15px;
  }

  h2 {
    font-size: 15px;
  }

  div:nth-child(2) {
    width: 70%;
    margin: 20px 0;
  }

  div:nth-child(3) {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 90px;
    margin-right: 50px;
  }

  span {
    display: flex;
    width: 100%;
    align-items: center;
    height: 50px;
    margin-top: 20px;
  }

  button {
    animation: ${glowing} 2s infinite ease-in-out;
  }

  p {
    width: 150px;
  }

  @media screen and (max-width: 1279px) {
    width: 400px;
    flex-direction: column;
    padding: 10px;
    border-radius: 20px;
    margin: 15px 0px;

    img {
      width: 70px;
      margin: 30px 0px;
    }

    h1 {
      font-size: 20px;
    }

    h2 {
      font-size: 12px;
    }

    div:nth-child(2) {
      width: 70%;
      margin: 0px 0px;
    }

    div:nth-child(3) {
      font-size: 50px;
      margin-right: 0px;
    }

    span {
      height: 100%;
      margin: 20px 0px;
    }

    button {
      width: 120px;
      font-size: 15px;
      margin: 10px 10px;
    }

    p {
      text-align: center;
    }
  }
`;
//#endregion
export default function RightCategories({ storyRef }) {
  const localStorageUserId = window.localStorage.getItem("userId");
  const navigate = useNavigate();
  const [authors, setAuthors] = useState();
  const [stories, setStories] = useState([]);
  const [pressure, setPressure] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [followList, setFollowList] = useState();

  useEffect(() => {
    async function fetchStoryData() {
      setIsLoading(true);
      const data = await getFirebasePosts("userId", localStorageUserId);
      if (data.length > 0) {
        const userStoryList = data.map((doc) => ({
          title: doc.title,
        }));
        setStories(userStoryList);
      }
    }
    fetchStoryData();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    async function fetchUserDataAndAuthors() {
      try {
        const data = await getFirebaseUsers("id", localStorageUserId);
        if (data) {
          const followListData = data.followAuthor?.flat() || [];
          setFollowList(followListData);
          const pressureCount = data.stressRecord?.flat() || [];
          setPressure(pressureCount);
          if (followListData.length > 0) {
            const authorNamesList = await getAuthorsByIds(followListData);
            setAuthors(authorNamesList);
          }
        }
      } catch (e) {
        toastAlert("error", e, 2000);
      }
    }
    fetchUserDataAndAuthors();
  }, [localStorageUserId]);

  let getLastPressureNumber = {};
  if (pressure && pressure.length > 0) {
    getLastPressureNumber = pressure[pressure?.length - 1];
  }

  const handlePost = () => {
    navigate("/post");
    window.scrollTo(0, 0);
  };

  const scrollSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  return (
    <Categories>
      <section id="statistics">
        <TopCategoriesPressure onClick={() => navigate("/help")}>
          <div>
            <h2>壓力</h2>
            <h2>指數</h2>
          </div>
          <span>
            {getLastPressureNumber?.number ? (
              <>
                <AnimatedNumber end={getLastPressureNumber?.number} />分
              </>
            ) : (
              <>0分</>
            )}
          </span>
          <img src={broke} alt={broke} />
        </TopCategoriesPressure>
        <span></span>
        <TopCategoriesFriends>
          <div>
            <h2>關注</h2>
            <h2>作者</h2>
          </div>
          <span>
            {authors && authors.length ? (
              <>
                <AnimatedNumber end={authors && authors.length} />位
              </>
            ) : (
              <>0位</>
            )}
          </span>
          <img src={jar} alt={jar} />
        </TopCategoriesFriends>
      </section>
      <CategoriesImg>
        <img src={categoryImg} alt={categoryImg}></img>
      </CategoriesImg>
      <CategoriesSection id="storySection">
        <div>
          <img src={logoImg} alt={logoImg} />
        </div>
        <div>
          <h1>「你的疼痛都保留在這裡」</h1>
          <h2>無論是失落、孤獨還是挫折，故事都值得被記錄下來。</h2>
          <h2>
            在這個安全的地方，你可以毫無保留地表達自己，寫下你的故事，分享疼痛。
          </h2>
          <span>
            <Buttons onClick={handlePost} text="投稿故事" />
            <Buttons onClick={() => scrollSection(storyRef)} text="歷史文章" />
          </span>
        </div>
        <div>
          {stories.length ? (
            <>
              <AnimatedNumber end={stories.length} />篇
            </>
          ) : (
            <p>0篇</p>
          )}
        </div>
      </CategoriesSection>
      <ToastContainer />
    </Categories>
  );
}
