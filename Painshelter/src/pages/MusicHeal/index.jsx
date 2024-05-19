import youtube from "../../utils/api/youtube";
import styled from "styled-components";
import Buttons from "../../components/Buttons.jsx";
import heal1 from "../../assets/img/heal1.jpg";
import healtext1 from "../../assets/img/healtext1.png";
import heal2 from "../../assets/img/heal2.jpg";
import healtext2 from "../../assets/img/healtext2.png";
import heal3 from "../../assets/img/heal3.jpg";
import healtext3 from "../../assets/img/healtext3.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { zoomies } from "ldrs";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useAuthCheck } from "@/utils/hooks/useAuthCheck.jsx";
import { useLyric } from "../../utils/zustand.js";
import { musicHealPageGSAPAnimations } from "@/utils/gsapAnimations";
import { useFormInput } from "../../utils/hooks/useFormInputNoSetValue";
import { useState, useRef, useEffect } from "react";

//#region
const Lyric = styled.div`
  position: relative;
  overflow: hidden;
  img:nth-of-type(1) {
    height: 100vh;
    width: 100vw;
    object-fit: cover;
  }
  img:nth-of-type(2) {
    width: 800px;
    object-fit: cover;
    position: absolute;
    right: 0;
    top: 0;
    margin-right: 50px;
    margin-top: 100px;
    opacity: 0.9;
  }
  div {
    position: absolute;
    color: white;
    width: 550px;
    bottom: 0;
    left: 0;
    font-size: 15px;
    padding: 70px;
    opacity: 0.6;
  }
  span {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 30px;
    text-align: center;
    color: white;
    opacity: 0.6;
    margin-bottom: 50px;
    cursor: pointer;
    span:hover {
      transform: scale(1.1);
    }
  }
  @media screen and (max-width: 1279px) {
    img:nth-of-type(2) {
      width: 100%;
      margin-right: 0px;
      margin-top: 70px;
    }
    div {
      width: 100%;
      font-size: 12px;
      padding: 40px;
    }
    span {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      font-size: 30px;
      text-align: center;
      color: white;
      opacity: 0.6;
      cursor: pointer;

      span:hover {
        transform: scale(1.1);
      }
    }
  }
`;

const Loadingstate = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Background = styled.div`
  background-color: #0c0c0c;
  height: 100vh;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Noto Sans TC", sans-serif;
  @media screen and (max-width: 1279px) {
    flex-direction: column;
    height: 100%;
  }
`;

const Intro = styled.div`
  padding: 30px;
  width: 700px;
  p {
    opacity: 0.6;
  }
  @media screen and (max-width: 1279px) {
    padding: 30px;
    width: 100%;
  }
`;

const MainSection = styled.div`
  @media screen and (max-width: 1279px) {
    display: flex;
    flex-direction: column;
  }
`;

const SearchBar = styled.div`
  margin-top: 30px;
  input {
    width: 100%;
    height: 30px;
    border-radius: 7px;
    color: black;
    padding-left: 15px;
  }
`;

const Video = styled.div`
  display: flex;
  width: 90%;
  @media screen and (max-width: 1279px) {
    display: flex;
    flex-direction: column;
  }
`;

const VideoItem = styled.div`
  margin: 10px;
  h3 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 13px;
    width: 100px;
  }
  img {
    width: 100px;
  }
  @media screen and (max-width: 1279px) {
    margin: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    h3 {
      font-size: 13px;
      width: 100%;
    }
    img {
      width: 100%;
    }
  }
`;

const SearchVideo = styled.div`
  margin-top: 20px;
  iframe {
    width: 100%;
  }
  @media screen and (max-width: 1279px) {
    margin: 0 auto;
    iframe {
      width: 80%;
    }
  }
`;

const ButtonSection = styled.div`
  background-color: #0c0c0c;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 30px;

  @media screen and (max-width: 1279px) {
    display: flex;
    flex-direction: column;
  }
`;
//#endregion

function MusicHeal() {
  const SearchInput = useFormInput();
  const section1 = useRef(null);
  const section1Continue = useRef(null);
  const section2 = useRef(null);
  const section2Continue = useRef(null);
  const section3 = useRef(null);
  const section3Continue = useRef(null);
  const section4 = useRef(null);
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setTitle, setStatus } = useLyric();
  const navigate = useNavigate();
  useAuthCheck();
  zoomies.register();

  //監聽在網頁最上方
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const scrollSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await youtube.get("/search", {
        params: {
          q: SearchInput.value,
          part: "snippet",
          maxResults: 5,
        },
      });
      setVideos(response.data.items);
      setIsLoading(false);
      setTitle(SearchInput.value);
      setStatus();
    } catch (error) {
      setIsLoading(true);
      console.error("Search failed:", error);
    }
  };

  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
  };

  //#region
  //GSAP三角形動畫
  useEffect(() => {
    [
      section1Continue.current,
      section2Continue.current,
      section3Continue.current,
    ].forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        duration: 1,
        delay: 0.5,
      });
      gsap.to(el, {
        y: 20,
        duration: 0.8,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
      });
    });
  }, []);

  //GSAP標題和文字
  const titleRef1 = useRef(null);
  const titleRef2 = useRef(null);
  const titleRef3 = useRef(null);
  const paragraphRef1 = useRef(null);
  const paragraphRef2 = useRef(null);
  const paragraphRef3 = useRef(null);
  useGSAP(() => {
    musicHealPageGSAPAnimations(
      titleRef1,
      titleRef2,
      titleRef3,
      paragraphRef1,
      paragraphRef2,
      paragraphRef3
    );
  });
  //#endregion

  return (
    <>
      <Lyric ref={section1}>
        <img src={heal1} alt={heal1} />
        <img ref={titleRef1} src={healtext1} alt={healtext1} />
        <div ref={paragraphRef1}>
          <p>你不是真正的快樂，你的傷從不肯完全的癒合</p>
          <p>我站在你左側，卻像隔著銀河，</p>
          <p>難道就真的，抱著遺憾一直到老了，然後才後悔著。</p>
          <p>然後才後悔著。</p>
        </div>
        <span ref={section1Continue} onClick={() => scrollSection(section2)}>
          ▼
        </span>
      </Lyric>

      <Lyric ref={section2}>
        <img src={heal3} alt={heal3} />
        <img ref={titleRef2} src={healtext3} alt={healtext3} />
        <div ref={paragraphRef2}>
          <p>如果你被她傷的很痛，請感謝她好心折磨，</p>
          <p>如果你對她感到愧疚，請感謝她慷慨淚流，</p>
          <p>在我們相遇相愛之前，多虧有她讓你成熟。</p>
        </div>
        <span ref={section2Continue} onClick={() => scrollSection(section3)}>
          ▼
        </span>
      </Lyric>
      <Lyric ref={section3}>
        <img src={heal2} alt={heal2} />
        <img ref={titleRef3} src={healtext2} alt={healtext2} />
        <div ref={paragraphRef3}>
          <p>我在夜裡大聲呼喊，夢太沈重，無力也無法動彈，</p>
          <p>一樣的，一樣的，不安又將我捆綁，直到天亮</p>
        </div>
        <span ref={section3Continue} onClick={() => scrollSection(section4)}>
          ▼
        </span>
      </Lyric>
      <Background>
        <Intro ref={section4}>
          <p>在這個悲傷的世界裡，我們每個人都承受著各自的重擔。</p>
          <p>但在這沉重的黑暗中，有一線溫柔的光芒，那就是文字和旋律的力量。</p>
          <p>透過溫柔的詩句、節奏，我們找到了屬於自己的安寧角落。</p>
          <p>在這裡，我們不只是發現了那個真正的自己，</p>
          <p>更通過音樂與字句的藝術治療，學會了如何自我療癒。</p>
          <p>讓我們一起，用這些溫柔的語言和旋律，療癒心靈，抒發情感。</p>
          <SearchBar>
            <form onSubmit={handleSubmit}>
              <input
                {...SearchInput}
                placeholder="輸入一首喜愛的歌"
                type="text"
              ></input>
            </form>
            {/* <ShowLyric></ShowLyric> */}
          </SearchBar>
        </Intro>
        <MainSection>
          <Video>
            {isLoading ? (
              <Loadingstate>
                <l-zoomies
                  size="500"
                  stroke="5"
                  bg-opacity="0.1"
                  speed="1.4"
                  color="white"
                ></l-zoomies>
              </Loadingstate>
            ) : (
              videos.map((video) => (
                <VideoItem
                  key={video.id.videoId}
                  onClick={() => handleVideoSelect(video)}
                >
                  <h3>{video.snippet.title}</h3>
                  <img
                    src={video.snippet.thumbnails.default.url}
                    alt={video.snippet.description}
                  />
                </VideoItem>
              ))
            )}
          </Video>
          {currentVideo && (
            <SearchVideo>
              <iframe
                id="ytplayer"
                type="text/html"
                width="640"
                height="360"
                src={`https://www.youtube.com/embed/${currentVideo.id.videoId}?autoplay=1`}
                frameBorder="0"
              ></iframe>
            </SearchVideo>
          )}
        </MainSection>
      </Background>
      <ButtonSection>
        <Buttons onClick={() => scrollSection(section1)} text="最上層" />
        <Buttons onClick={() => navigate("/history")} text="疼痛日記室" />
        <Buttons onClick={() => navigate("/help")} text="心靈緊急按鈕" />
        <Buttons onClick={() => navigate("/main")} text="首頁" />
      </ButtonSection>
    </>
  );
}

export default MusicHeal;
