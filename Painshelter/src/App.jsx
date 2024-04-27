// import "./App.css";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { auth } from "./utils/firebase/firebase.jsx";
import { signOut } from "firebase/auth";
import { useLoginState } from "./utils/zustand.js";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "./utils/firebase/firebase.jsx";
import { useState, useEffect } from "react";
import PostsLocation from "./components/PostLocation.jsx";
import Chart from "./components/Chart/TypeChart.jsx";
import FigureChart from "./components/Chart/FigureChart.jsx";
import backgroundImg1 from "./assets/img/disagreeImg1.jpg";
import logoImg from "./assets/img/logoImg.png";
import logoTitle from "./assets/img/logoTitle.png";
import mainBanner from "./assets/img/mainBanner.jpg";
import { CarouselDemo } from "./components/Shadcn/CarouselDemo";
import aboutpainsectionimg from "./assets/img/aboutpainsection1.jpg";
import aboutpainsectionimg2 from "./assets/img/aboutpainsection2.jpg";

const Background = styled.div`
  background-color: #1a1a1a;
  position: relative;
`;

const ModalBackground = styled.div`
  background-image: url(${backgroundImg1});
  position: absolute;
  z-index: 1001;
  width: 100%;
  height: 100%;
`;

const Opacity = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const Modal = styled.div`
  width: 80%;
  height: 600px;
  background-color: rgba(255, 255, 255, 0.5);
  top: 50px;
  position: absolute;
  display: flex;
  align-items: center;
  border-radius: 30px;
  justify-content: space-around;
  @media screen and (max-width: 1279px) {
    display: block;
    height: 850px;
  }
`;

const ModalLogo = styled.div`
  img {
    width: 250px;
  }

  img:hover {
    transform: scale(1.1);
  }
  @media screen and (max-width: 1279px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
    img {
      width: 150px;
    }
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    font-size: 50px;
    margin-bottom: 30px;
    font-weight: bold;
    letter-spacing: 10px;
    color: rgba(255, 255, 255, 0.8);
    text-shadow: 1px 2px 5px black;
  }
  @media screen and (max-width: 1279px) {
    h1 {
      font-size: 30px;
      margin-top: 30px;
    }
    span {
      right: 0;
      left: 0;
      margin: 0 auto;
    }
  }
`;

const ModalButton = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  button {
    display: block;
    width: 150px;
    background-color: #001a2a;
    color: white;
    padding: 10px;
    border-radius: 10px;
    font-weight: 400;
    margin-top: 15px;
    box-shadow: 0 10px 10px -8px rgba(0, 0, 0, 0.7);
    margin: 15px;

    &:hover,
    &:focus {
      background-color: #4c5e67;
    }
  }
  @media screen and (max-width: 1279px) {
    flex-direction: column;
  }
`;

const Banner = styled.div`
  background-image: url(${mainBanner});
  height: 100vh;
  @media screen and (max-width: 1279px) {
  }
`;

const Categories = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  color: white;
  font-size: 40px;
  letter-spacing: 5px;
  padding-top: 30px;
  font-weight: 600;
  z-index: 500;

  button {
    margin: 12px;
    margin-right: 50px;
    opacity: 10%;
  }

  button:hover {
    opacity: 100%;
    transform: scale(1.1);
    text-shadow: 1px 1px 20px white;
  }
`;

const Logo = styled.div`
  display: flex;
  position: absolute;
  left: 0;
  top: 0;

  margin-top: 180px;
  margin-left: 180px;

  img:nth-of-type(1) {
    width: 180px;
    object-fit: contain;
  }

  img:nth-of-type(2) {
    width: 500px;
    object-fit: contain;
  }
`;

const SubTitle = styled.div`
  position: absolute;
  color: white;
  font-size: 170px;
  font-family: sans-serif;
  opacity: 5%;
  margin-top: -150px;
`;

const AboutPain = styled.div`
  background: linear-gradient(#1a1a1a, red);
  color: white;
`;

const AboutPainTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 50px;
  h1 {
    font-style: oblique;
    margin-left: 50px;
    font-size: 80px;
  }
  h2 {
    font-style: oblique;
    margin-right: 50px;
    font-size: 80px;
  }
  p {
    font-style: oblique;
    font-size: 50px;
    margin-right: 50px;
  }
  span {
    font-style: oblique;
    font-size: 50px;
    margin-left: 50px;
  }
`;

const AboutPaintContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  p {
    width: 600px;
    margin-left: 50px;
    opacity: 65%;
  }
  span {
    width: 600px;
    margin-right: 50px;
    opacity: 65%;
  }
  img {
    margin-right: 50px;
    margin-left: 50px;
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
  }
`;

function App() {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const { online, offline, logout } = useLoginState();
  const localStorageUserId = window.localStorage.getItem("userId");
  const localStorageLogin = window.localStorage.getItem("loginStatus");
  // const login = getLoginStatus();

  //登出按鈕
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/");
        console.log("Signed out successfully");
        window.localStorage.removeItem("userId");
        window.localStorage.removeItem("loginStatus");
      })
      .catch((error) => {
        console.log(error);
      });
    offline();
    logout();
  };

  //同意進入頁面按鈕
  const handleAgree = () => {
    navigate("/login");
    online();
  };

  //不同意進入不同意頁面按鈕
  const handleDisagree = () => {
    navigate("/disagree");
    offline();
  };

  console.log("目前登錄狀態：" + localStorageLogin);
  console.log("目前登入使用者ID：" + localStorageUserId);

  //拿取Firestore資料
  useEffect(() => {
    async function getStories() {
      try {
        const postsData = collection(db, "posts");
        const q = query(postsData);

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

  //隨機拿到stories的內容
  function getRandomStories(arr, size) {
    const result = [];
    const useIndex = new Set();

    while (result.length < size && result.length < arr.length) {
      const index = Math.floor(Math.random() * arr.length);
      if (!useIndex.has(index)) {
        result.push(arr[index]);
        useIndex.add(index);
      }
    }
    return result;
  }
  const randomStories = getRandomStories(stories, 7);

  //進入到該作者的文章頁面
  const handleVisitAthor = (id) => {
    navigate("/visit", { state: { data: id } });
  };

  return (
    <>
      <Background>
        {localStorageLogin ? null : (
          <ModalBackground>
            <Opacity>
              <Modal>
                <ModalLogo>
                  <img src={logoImg} alt="Logo" />
                  <img src={logoTitle} alt="Logo title" />
                </ModalLogo>
                <ModalContent>
                  <h1>溫柔宣言</h1>
                  <span>
                    <CarouselDemo></CarouselDemo>
                  </span>
                  <ModalButton>
                    <button onClick={handleAgree}>同意</button>
                    <button onClick={handleDisagree}>不同意</button>
                  </ModalButton>
                </ModalContent>
              </Modal>
            </Opacity>
          </ModalBackground>
        )}

        <Banner>
          <Categories>
            <button>關於疼痛</button>
            <button>疼痛日記室</button>
            <button>疼痛光譜</button>
            <button>疼痛地圖</button>
            <button>心靈緊急按鈕</button>
            <button>關於我們</button>
            <button>登出</button>
          </Categories>
          <Logo>
            <img src={logoImg} alt="Logo" />
            <img src={logoTitle} alt="Logo title" />
          </Logo>
          <SubTitle>PAINSHELTER</SubTitle>
        </Banner>

        <AboutPain>
          <AboutPainTitle>
            <h1>關於疼痛</h1>
            <p>About Pain</p>
          </AboutPainTitle>
          <AboutPaintContent>
            <p>
              疼痛讓我們揭開了生活的另一面，那里沒有華麗的掩飾，只有原始的、真實的自我。我們學會在這悲傷的碎片中搜尋意義，學會讓淚水洗凈心靈的創傷。
            </p>
            <img src={aboutpainsectionimg} alt="" />
          </AboutPaintContent>
          <AboutPainTitle>
            <span>About Shelter</span>
            <h2>關於收容所</h2>
          </AboutPainTitle>
          <AboutPaintContent>
            <img src={aboutpainsectionimg2} alt="" />
            <span>
              疼痛收容所是一個放置任意程度大小疼痛的故事空間，在這裡將不問對錯、不批判，期待達成自我療癒
              / 你可以在這裡分享任何大小的疼痛故事、不能說的秘密到平台上 /
              我們期待在這個微小的樹洞中，可以安置你的故事，或在瀏覽或傾聽他人的故事中，讓悲傷的故事或許不會那麼令人心碎。
            </span>
          </AboutPaintContent>
        </AboutPain>

        {/* <h1 className="text-6xl font-sans font-black tracking-wider text-center ">
          Pain Shelter
        </h1>

        <div>
          <h2 className="bg-yellow-600 text-white mt-3 text-center ">
            文章精選
          </h2>
          <div className="flex flex-wrap justify-center">
            {randomStories.slice(0, 6).map((story, index) => {
              return (
                <div className="border-2 border-black  m-3 w-1/4 " key={index}>
                  <p>疼痛暗號：{story.title}</p>
                  <p>故事地點：{story.location.name}</p>
                  <button onClick={() => handleVisitAthor(story.userId)}>
                    點我看作者
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <button
            className="bg-blue-600 text-white  mt-3"
            onClick={() => navigate("/history")}
          >
            疼痛日記室
          </button>
        </div>

        <div>
          <button className="bg-blue-600 text-white mt-3">情緒光譜</button>
          <div className="flex justify-center ">
            <div className="">
              <FigureChart />
              <p className="text-4xl text-center">關係人類型統計</p>
            </div>
            <div className="">
              <h1 className="text-4xl text-center ">文章累積數量</h1>
              <p className="text-9xl text-center items-center mt-16">
                {stories.length}
              </p>
            </div>
            <div className="">
              <Chart />
              <p className="text-4xl text-center">類型統計</p>
            </div>
          </div>
        </div>

        <div>
          <button className="bg-blue-600 text-white mt-3">疼痛地圖</button>

          <PostsLocation />
        </div>

        <button
          onClick={() => navigate("/help")}
          className="bg-blue-600 text-white mt-3"
        >
          心靈緊急按鈕
        </button> */}

        {/* 登出 */}
        <button className="mt-5">
          <div>
            <button onClick={handleLogout} className=" border-2 border-black ">
              登出
            </button>
          </div>
        </button>
      </Background>
    </>
  );
}

export default App;
