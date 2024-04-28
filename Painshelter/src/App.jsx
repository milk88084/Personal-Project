// import "./App.css";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { auth } from "./utils/firebase/firebase.jsx";
import { signOut } from "firebase/auth";
import { useLoginState } from "./utils/zustand.js";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "./utils/firebase/firebase.jsx";
import { useState, useEffect, useRef } from "react";
import PostsLocation from "./components/PostLocation.jsx";
import Chart from "./components/Chart/TypeChart.jsx";
import FigureChart from "./components/Chart/FigureChart.jsx";
import backgroundImg1 from "./assets/img/disagreeImg1.jpg";
import logoImg from "./assets/img/logoImg.png";
import logoTitle from "./assets/img/logoTitle3.png";
import mainBanner from "./assets/img/mainBanner.jpg";
import { CarouselDemo } from "./components/Shadcn/CarouselDemo";
import { AccordionDemo } from "./components/Shadcn/Accordion";
import aboutpainsectionimg from "./assets/img/aboutpainsection1.jpg";
import aboutpainsectionimg2 from "./assets/img/aboutpainsection2.jpg";
import footer1 from "./assets/img/mainFooter1.jpg";

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
    height: 600px;
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

  @media screen and (max-width: 1279px) {
    font-size: 20px;
    letter-spacing: 1px;
    font-weight: 500;
    padding-top: 0px;

    button {
      margin: 3px;
      margin-right: 0px;
      opacity: 10%;
    }
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
  @media screen and (max-width: 1279px) {
    flex-direction: column;
    align-items: center;
    margin-left: 0px;
    right: 0;
    margin: 50 auto;
    img:nth-of-type(1) {
      width: 150px;
    }

    img:nth-of-type(2) {
      width: 250px;
    }
  }
`;

const SubTitle = styled.div`
  position: absolute;
  color: white;
  font-size: 170px;
  font-family: sans-serif;
  opacity: 5%;
  margin-top: -150px;
  @media screen and (max-width: 1279px) {
    display: none;
  }
`;

const AboutPain = styled.div`
  color: white;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media screen and (max-width: 1279px) {
    height: 100%;
    width: 100%;
  }
`;

const AboutPainTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-style: oblique;
  h1 {
    margin-left: 50px;
    font-size: 80px;
    font-weight: 600;
  }
  h2 {
    margin-right: 50px;
    font-size: 80px;
    font-weight: 600;
  }
  p {
    font-size: 50px;
    margin-right: 50px;
    opacity: 50%;
  }
  span {
    font-size: 50px;
    margin-left: 50px;
    opacity: 50%;
  }
  @media screen and (max-width: 1279px) {
    flex-direction: column;
    align-items: start;
    margin-top: 50px;
    h1 {
      margin-left: 15px;
      font-size: 60px;
      font-weight: 500;
    }
    h2 {
      margin-right: 0px;
      font-size: 60px;
      font-weight: 500;
      margin-left: 15px;
    }
    p {
      font-size: 30px;
      margin-right: 0px;
      margin-left: 15px;
    }
    span {
      font-size: 30px;
      margin-left: 15px;
    }
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
    opacity: 65%;
    font-size: 50px;
    font-weight: 300;
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
  @media screen and (max-width: 1279px) {
    flex-direction: column;
    align-items: flex-end;
    position: relative;
    p {
      width: 100%;
      margin-left: 0px;
      padding: 15px;
    }
    span {
      display: none;
    }

    img {
      margin: 0 auto;
      width: 100%;
    }
  }
`;

const FeatureTitles = styled.div`
  width: 1280px;
  color: white;
  font-size: 80px;
  padding-bottom: 30px;
  position: relative;
  font-weight: 600;
  margin-left: 50px;
  font-style: oblique;
  @media screen and (max-width: 1279px) {
    width: 100%;
    font-size: 60px;
    padding-bottom: 30px;
    font-weight: 500;
    margin-left: 0px;
    text-align: center;
    margin-top: 50px;
  }
`;

const FeatureSubTitles = styled.div`
  font-size: 30px;
  text-align: end;
  opacity: 0.6;
  color: white;
`;

const Highlights = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 30px;
  flex-wrap: wrap;
`;

const HighlightPost = styled.div`
  background-color: white;
  height: 300px;
  width: 400px;
  border-radius: 20px;
  font-size: 18px;
  box-shadow: 3px 3px 15px 3px rgba(255, 238, 3, 0.2);

  div {
    padding: 30px;
  }

  h1 {
    font-size: 50px;
    font-weight: 800;
  }

  h2 {
    font-size: 15px;
    color: #000d15;
    font-weight: 400;
    opacity: 80%;
  }

  p {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 15px;
  }

  &:hover {
    background: linear-gradient(
      315deg,
      rgba(219, 180, 0, 1) 0%,
      rgba(233, 212, 148, 1) 69%,
      rgba(238, 235, 174, 1) 100%
    );
    cursor: pointer;
    transform: scale(1.1);
    color: white;
  }
`;

const ChartFeature = styled.div`
  height: 100vh;
  p {
    color: white;
    font-size: 80px;
    font-weight: 600;
    margin-left: 50px;
    font-style: oblique;
    margin-top: 50px;
  }

  @media screen and (max-width: 1279px) {
    height: 100%;
    width: 100%;
    p {
      width: 100%;
      font-size: 60px;
      padding-bottom: 5px;
      font-weight: 500;
      margin-left: 0px;
      text-align: center;
      margin-top: 50px;
    }
  }
`;

const ChartSection = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  margin-top: 30px;
  @media screen and (max-width: 1279px) {
    flex-direction: column;
    justify-content: center;
  }
`;

const PostsCounts = styled.div`
  font-size: 40px;
  color: white;
  text-align: center;

  p {
    font-size: 180px;
    font-weight: 700;
  }
  @media screen and (max-width: 1279px) {
    margin-top: 30px;

    p {
      font-size: 160px;
      font-weight: 700;
    }
  }
`;

const FigureChartSection = styled.div`
  color: white;
  h1 {
    font-size: 40px;
    text-align: center;
  }
  @media screen and (max-width: 1279px) {
    margin-left: -30px;
    h1 {
      font-size: 30px;
      opacity: 0.7;
    }
  }
`;
const TypesChartsSection = styled.div`
  color: white;
  h1 {
    font-size: 40px;
    text-align: center;
  }
  @media screen and (max-width: 1279px) {
    margin-left: -30px;
    h1 {
      font-size: 30px;
      opacity: 0.7;
    }
  }
`;

const MapSection = styled.div`
  width: 1280px;
  margin: 0 auto;
  height: 100vh;

  @media screen and (max-width: 1279px) {
    width: 100%;
  }
`;

const FooterSection = styled.div`
  display: flex;
  width: 100%;
  @media screen and (max-width: 1279px) {
    flex-direction: column;
  }
`;

const FooterImg = styled.div`
  width: 1000px;
  @media screen and (max-width: 1279px) {
    width: 100%;
  }
`;

const FooterContent = styled.div`
  margin-top: 50px;
  width: 100%;
  color: white;
  font-size: 40px;
  letter-spacing: 5px;

  button {
    color: white;
    opacity: 80%;
    font-size: 40px;
    letter-spacing: 5px;
    padding-top: 30px;
    font-weight: 600;
  }

  span {
    color: #fff0ac;
    cursor: pointer;
  }

  span:hover {
    color: #ffbb28;
    text-shadow: 1px 1px 20px white;
  }

  img {
    position: absolute;
    width: 100px;
    padding: 10px;
    right: 0;
    bottom: 0;
    cursor: pointer;
  }

  @media screen and (max-width: 1279px) {
    margin-top: 30px;
    font-size: 20px;
    letter-spacing: 3px;
    padding: 10px;
    button {
      font-size: 40px;
      letter-spacing: 4px;
    }
  }
`;

function App() {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const { online, offline, logout } = useLoginState();
  const localStorageUserId = window.localStorage.getItem("userId");
  const localStorageLogin = window.localStorage.getItem("loginStatus");

  // const login = getLoginStatus();

  //按鈕指定到區域
  const about = useRef(null);
  const highlight = useRef(null);
  const chart = useRef(null);
  const map = useRef(null);
  const top = useRef(null);

  const scrollSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: "smooth",
    });
  };

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
    scrollSection(top);
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
  const randomStories = getRandomStories(stories, 6);

  //進入到該作者的文章頁面
  const handleVisitAthor = (id) => {
    navigate("/visit", { state: { data: id } });
  };

  console.log(randomStories);

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
          <Categories ref={top}>
            <button onClick={() => scrollSection(about)}>關於疼痛</button>
            <button onClick={() => scrollSection(chart)}>疼痛光譜</button>
            <button onClick={() => scrollSection(map)}>疼痛地圖</button>
            <button onClick={() => navigate("/history")}>疼痛日記室</button>
            <button onClick={() => navigate("/help")}>心靈緊急按鈕</button>
            <button>關於我們</button>
            <button onClick={handleLogout}>登出</button>
          </Categories>
          <Logo>
            <img src={logoImg} alt="Logo" />
            <img src={logoTitle} alt="Logo title" />
          </Logo>
          <SubTitle>PAINSHELTER</SubTitle>
        </Banner>

        <AboutPain ref={about}>
          <AboutPainTitle>
            <h1>關於疼痛</h1>
            <p>About Pain</p>
          </AboutPainTitle>
          <AboutPaintContent>
            <span>「</span>
            <p>
              疼痛讓我們揭開了生活的另一面，那裡沒有華麗的掩飾，只有原始的、真實的自我。我們學會在這悲傷的碎片中找尋意義。
            </p>
            <span>」</span>
            <img
              src={aboutpainsectionimg}
              alt=" 
Monochrome img"
            />
          </AboutPaintContent>
        </AboutPain>
        <AboutPain>
          <AboutPainTitle>
            <span>About Shelter</span>
            <h2>關於收容所</h2>
          </AboutPainTitle>
          <AboutPaintContent>
            <img
              src={aboutpainsectionimg2}
              alt="
Monochrome img"
            />
            <span>「</span>
            <p>
              疼痛收容所是一個放置任意程度大小疼痛的故事空間，在這裡將不問對錯、不批判，期待達成自我療癒
              / 你可以在這裡分享任何大小的疼痛故事、不能說的秘密到平台上 /
              我們期待在這個微小的樹洞中，可以安置你的故事，或在瀏覽或傾聽他人的故事中，讓悲傷的故事或許不會那麼令人心碎。
            </p>
            <span>」</span>
          </AboutPaintContent>
        </AboutPain>

        <FeatureTitles>
          <p>精選文章</p>
        </FeatureTitles>

        <Highlights ref={highlight}>
          {randomStories.map((story, index) => {
            return (
              <HighlightPost
                onClick={() => handleVisitAthor(story.userId)}
                key={index}
              >
                <div>
                  <h1>{index + 1}</h1>
                  <h2>疼痛暗號：{story.title}</h2>
                  <h2>@{story.location.name}</h2>
                  <p>{story.story}</p>
                </div>
              </HighlightPost>
            );
          })}
        </Highlights>

        <ChartFeature>
          <p ref={chart}>疼痛光譜</p>
          <ChartSection>
            <TypesChartsSection>
              <Chart />
              <h1>故事類別統計</h1>
            </TypesChartsSection>
            <PostsCounts>
              <h1>文章累積數量</h1>
              <p> {stories.length} </p>
            </PostsCounts>
            <FigureChartSection>
              <FigureChart />
              <h1>故事關係人統計</h1>
            </FigureChartSection>
          </ChartSection>
        </ChartFeature>

        <FeatureTitles ref={map}>
          <p>疼痛地圖</p>
          <FeatureSubTitles>觸碰玻璃瓶，解鎖被時間遺忘的故事</FeatureSubTitles>
        </FeatureTitles>
        <MapSection>
          <PostsLocation />
        </MapSection>

        <FooterSection>
          <FooterImg>
            <img src={footer1} alt="footer img" />
          </FooterImg>
          <FooterContent>
            <AccordionDemo></AccordionDemo>
            <button onClick={handleLogout}>登出</button>
            <img onClick={() => scrollSection(top)} src={logoImg} alt="logo" />
          </FooterContent>
        </FooterSection>
      </Background>
    </>
  );
}

export default App;
