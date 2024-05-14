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
import logoImg from "./assets/img/logoImg.png";
import logoTitle from "./assets/img/logoTitle.png";
import mainBanner from "./assets/img/mainBanner.jpg";
import { AccordionDemo } from "./components/Shadcn/Accordion";
import aboutpainsectionimg from "./assets/img/aboutpainsection1.jpg";
import aboutpainsectionimg2 from "./assets/img/aboutpainsection2.jpg";
import footer1 from "./assets/img/mainFooter1.jpg";
import AnimatedNumber from "../src/components/AnimatedNumber.jsx";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";
import CopyRight from "./components/CopyRight.jsx";
import { createGlobalStyle } from "styled-components";
import Buttons from "./components/Buttons.jsx";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useAuthCheck } from "./utils/hooks/useAuthCheck.jsx";
gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

//#region
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  body {
    font-family: 'Noto Sans TC', sans-serif;
  }
`;

const Background = styled.div`
  background-color: #1a1a1a;
  position: relative;
  overflow-x: hidden;
`;

const Banner = styled.div`
  position: relative;
  height: 100vh;

  @media screen and (max-width: 1279px) {
    height: 600px;
  }
`;

const BannerImg = styled.div`
  img {
    height: 100vh;
    width: 100%;
    position: absolute;
    object-position: center;
    object-fit: cover;
  }
`;

const Categories = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: end;
  color: white;
  font-size: 40px;
  letter-spacing: 5px;
  font-weight: 600;
  z-index: 500;
  margin-right: 20px;
  height: 100vh;

  button {
    margin: 12px;
    margin-right: 100px;
    opacity: 30%;
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
      margin-right: 60px;
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
    width: 150px;
    object-fit: contain;
    margin-right: 20px;
  }

  img:nth-of-type(2) {
    width: 450px;
    object-fit: contain;
  }
  @media screen and (max-width: 1279px) {
    flex-direction: column;
    align-items: center;
    margin-left: 0px;
    right: 0;
    margin-top: 250px;
    img:nth-of-type(1) {
      width: 150px;
    }

    img:nth-of-type(2) {
      width: 250px;
      margin-top: 20px;
    }
  }
`;

const SubTitle = styled.div`
  position: absolute;
  color: white;
  font-size: 160px;
  font-family: sans-serif;
  opacity: 5%;
  bottom: 0;
  z-index: 400;
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
    font-size: 18px;
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
  width: 100vw;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 1rem;
  gap: 3rem;
  justify-items: center;
  align-items: center;

  @media screen and (max-width: 1279px) {
    display: flex;
    flex-direction: column;
  }
`;

const HighlightPost = styled.div`
  padding: 30px;
  height: 300px;
  width: 400px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: white;
  box-shadow: 3px 3px 15px 3px rgba(255, 238, 3, 0.2);
  border-radius: 20px;
  font-size: 18px;
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

const MoreButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 60px;
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

  span {
    font-size: 180px;
    font-weight: 700;
  }
  @media screen and (max-width: 1279px) {
    margin-top: 30px;

    span {
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

  div {
    line-height: 30px;
  }

  button {
    color: #fffed6;
    opacity: 80%;
    font-size: 40px;
    letter-spacing: 5px;
    padding-top: 30px;
    font-weight: 600;
  }

  span {
    color: black;
    background-color: #fff0ac;
    border-radius: 6px;
    cursor: pointer;
    padding: 3px 12px;
    margin-top: 20px;
  }

  span:hover {
    background-color: #ffbb28;
    transform: scale(0.9);
    text-shadow: 1px 1px 20px white;
  }

  span:active {
    transform: scale(0.8);
  }

  img {
    position: fixed;
    width: 100px;
    padding: 10px;
    right: 0;
    bottom: 0;
    margin: 0px 10px 12px 0px;
    opacity: 0.4;
    cursor: pointer;
  }

  img:hover {
    transform: scale(1.2);
    opacity: 1;
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
//#endregion

function App() {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const { offline, logout } = useLoginState();
  const localStorageUserId = window.localStorage.getItem("userId");
  const localStorageLogin = window.localStorage.getItem("loginStatus");
  const location = useLocation();
  useAuthCheck();

  // const login = getLoginStatus();

  //#region
  //上面GSAP
  const firstRef = useRef(null);
  const thirdRef = useRef(null);
  const fifthRef = useRef(null);
  const seventhRef = useRef(null);
  const imageRef = useRef(null);
  const logoRef = useRef(null);
  const subtitle = useRef(null);
  useEffect(() => {
    gsap.to(firstRef.current, { duration: 1, x: 50 });
    gsap.to(thirdRef.current, { duration: 1, x: 50 });
    gsap.to(fifthRef.current, { duration: 1, x: 70 });
    gsap.to(seventhRef.current, { duration: 1, x: 5 });
    gsap.to(imageRef.current, {
      duration: 0.7,
      scale: 1.2,
      filter: "drop-shadow(0 0 20px rgba(0, 0, 0, 0.8))",
    });
    gsap.to(
      firstRef.current,
      {
        skewX: -3,
        skewY: 0,
      },
      {
        skewX: 3,
        skewY: 0,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.1,
      }
    );
    gsap.to(logoRef.current, {
      duration: 3,
      rotation: 360,
      scale: 1.2,
      ease: "power4.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, []);
  //#endregion

  //#region
  //中間的GSAP
  const about2 = useRef(null);
  useGSAP(() => {
    gsap.from(about.current, {
      x: -300,
      duration: 4,
      opacity: 0,
      scrollTrigger: {
        trigger: about.current,
        start: "top 70%",
        end: "bottom 80%",
        scrub: 1,
      },
    });
    gsap.from(about2.current, {
      x: 300,
      duration: 4,
      opacity: 0,
      scrollTrigger: {
        trigger: about2.current,
        start: "top 70%",
        end: "bottom 90%",
        scrub: 1,
      },
    });
  }, []);

  //#endregion

  //#region
  //精選文章GSAP
  const highlightRefs = useRef([]);
  highlightRefs.current = [];

  const addToRefs = (el) => {
    if (el && !highlightRefs.current.includes(el)) {
      highlightRefs.current.push(el);
    }
  };
  useEffect(() => {
    highlightRefs.current.forEach((el, index) => {
      gsap.fromTo(
        el,
        {
          autoAlpha: 0,
          y: 30,
        }, // 初始狀態，autoAlpha是透明度和可見性的組合
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6, // 持續時間，單位是秒
          delay: index * 0.3,
        }
      );
    });
  }, [stories]);
  //#endregion

  //按鈕指定到區域
  const about = useRef(null);
  const highlight = useRef(null);
  const chart = useRef(null);
  const map = useRef(null);
  const top = useRef(null);
  const footer = useRef(null);

  const scrollSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  //監聽回到網頁最上面
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  //登出按鈕
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
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

  // console.log("目前登錄狀態：" + localStorageLogin);
  // console.log("目前登入使用者ID：" + localStorageUserId);

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
  const [displayCount, setDisplayCount] = useState(6);
  const [randomStories, setRandomStories] = useState([]);
  const [loadedIndices, setLoadedIndices] = useState(new Set());

  function getRandomStories(arr, size, excludedIndices) {
    const result = [];
    const useIndex = new Set();
    while (
      result.length < size &&
      useIndex.size + excludedIndices.size < arr.length
    ) {
      const index = Math.floor(Math.random() * arr.length);
      if (!useIndex.has(index) && !excludedIndices.has(index)) {
        result.push(arr[index]);
        useIndex.add(index);
      }
    }
    return [result, useIndex];
  }

  const handleShowMore = () => {
    setDisplayCount((prevState) => prevState + 6);
  };

  useEffect(() => {
    if (stories.length < 1) return;
    if (displayCount === 6) {
      const [newStories, newIndices] = getRandomStories(
        stories,
        6,
        loadedIndices
      );
      setRandomStories(newStories);
      setLoadedIndices(newIndices);
    } else {
      const [newStories, newIndices] = getRandomStories(
        stories,
        6,
        loadedIndices
      );
      setRandomStories((prev) => [...prev, ...newStories]);
      setLoadedIndices((prev) => new Set([...prev, ...newIndices]));
    }
  }, [stories, displayCount]);

  //進入到該作者的文章頁面
  const handleVisitAthor = (id) => {
    navigate("/visit", { state: { data: id } });
    window.scrollTo(0, 0);
  };

  return (
    <>
      <GlobalStyle />
      <Background>
        <Banner>
          <BannerImg>
            <img src={mainBanner} alt="mainBannerr" />
          </BannerImg>
          <Categories ref={top}>
            <button ref={firstRef} onClick={() => scrollSection(about)}>
              關於疼痛
            </button>
            <button onClick={() => scrollSection(chart)}>疼痛光譜</button>
            <button ref={thirdRef} onClick={() => scrollSection(map)}>
              疼痛地圖
            </button>
            <button onClick={() => scrollSection(footer)}>疼痛日記室</button>
            <button ref={fifthRef} onClick={() => scrollSection(footer)}>
              心靈緊急按鈕
            </button>
            <button onClick={() => scrollSection(footer)}>或是一首歌</button>
            <button ref={seventhRef} onClick={handleLogout}>
              登出
            </button>
          </Categories>
          <Logo>
            <img ref={logoRef} src={logoImg} alt="Logo" />
            <img ref={imageRef} src={logoTitle} alt="Logo title" />
          </Logo>
          <SubTitle ref={subtitle}>PAINSHELTER</SubTitle>
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
            <img src={aboutpainsectionimg} alt="Monochrome img" />
          </AboutPaintContent>
        </AboutPain>
        <AboutPain ref={about2}>
          <AboutPainTitle>
            <span>About Shelter</span>
            <h2>關於收容所</h2>
          </AboutPainTitle>
          <AboutPaintContent>
            <img src={aboutpainsectionimg2} alt="Monochrome img" />
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
                ref={addToRefs}
                onClick={() => handleVisitAthor(story.userId)}
                key={index}
              >
                <h1>{index + 1}</h1>
                <h2>疼痛暗號：{story.title}</h2>
                <h2>@{story.location.name}</h2>
                <p>{story.story}</p>
              </HighlightPost>
            );
          })}
        </Highlights>
        <MoreButton>
          <Buttons onClick={handleShowMore} text="更多" />
        </MoreButton>

        <ChartFeature>
          <p ref={chart}>疼痛光譜</p>
          <ChartSection>
            <TypesChartsSection>
              <Chart />
              <h1>故事類型</h1>
            </TypesChartsSection>
            <PostsCounts>
              <h1>文章累積數量</h1>
              <span>
                <AnimatedNumber end={stories.length} />
              </span>
            </PostsCounts>
            <FigureChartSection>
              <FigureChart />
              <h1>故事關係人</h1>
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
          <FooterContent ref={footer}>
            <AccordionDemo></AccordionDemo>
            <button onClick={handleLogout}>登出</button>
            <img
              onClick={() => scrollSection(top)}
              src={logoImg}
              alt={logoImg}
            />
          </FooterContent>
        </FooterSection>
        <CopyRight></CopyRight>
      </Background>
    </>
  );
}

export default App;
