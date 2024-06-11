import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  ChevronRight,
  UserRoundSearch,
  UsersRound,
  ScrollText,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import ThreeRules from "./ThreeRules.jsx";

import logo from "@/assets/img/logoTitle.png";
import video from "@/assets/video/landingPage.mp4";
import video2 from "@/assets/video/landingPage2.mp4";
import landingPageTextLines from "@/utils/data/landingPageTextLines.json";
import { landingPAgeGSAPAnimations } from "@/utils/gsapAnimations.js";

//#region
const Background = styled.div`
  background-color: #000000;
  font-family: "Noto Sans TC", sans-serif;
  position: relative;
  overflow-x: hidden;

  video:nth-child(1) {
    width: 100%;
    height: 100vh;
    object-fit: cover;
  }
  video:nth-child(2) {
    display: none;
  }
  @media screen and (max-width: 1279px) {
    video:nth-child(1) {
      display: none;
    }
    video:nth-child(2) {
      height: 100vh;
      display: block;
      object-fit: cover;
    }
  }
`;

const MainSection = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  @media screen and (max-width: 1279px) {
    flex-direction: column;
  }
`;

const LeftSection = styled.div`
  color: #e1e0d9;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 370px;
  }
  p {
    font-size: 25px;
    margin-top: 180px;
    opacity: 0.5;
    position: absolute;
  }
  @media screen and (max-width: 1279px) {
    align-items: center;
    justify-content: center;
    height: 50%;
    img {
      width: 300px;
    }
    p {
      font-size: 15px;
      color: #151517;
      text-align: center;
      margin-top: 150px;
    }
  }
`;

const glowing = keyframes`
  0% { box-shadow: 0 0 5px white; }
  50% { box-shadow: 0 0 20px white; }
  100% { box-shadow: 0 0 5px white; }
`;

const RightSection = styled.div`
  color: #e1e0d9;
  display: flex;
  flex-direction: column;

  div {
    padding: 15px;
    width: 250px;
    margin: 10px;
    background-color: #151517;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    margin-top: 20px;
  }

  div:hover {
    background: rgb(133, 133, 133);
    background: linear-gradient(
      60deg,
      #eeeeee 0%,
      #e0f0ff 35%,
      rgba(242, 242, 242, 1) 100%
    );
    color: #151517;
    transform: scale(1.1);
    animation: ${glowing} 2s infinite ease-in-out;
  }

  p {
    font-size: 12px;
    opacity: 0.6;
  }
  @media screen and (max-width: 1279px) {
    width: 100%;
    flex-direction: row;
    color: #151517;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;

    div {
      padding: 10px;
      width: 80%;
      margin: 0px;
      margin-top: 20px;
      background-color: #e1e0d9;
    }

    p {
      display: none;
    }
  }
`;
//#endregion

export default function LandingPage() {
  const textRefs = useRef([]);
  const imgRef = useRef(null);
  const buttonRef = useRef(null);
  const enterIconRef = useRef(null);
  const loginStatus = window.localStorage.getItem("loginStatus");
  const navigate = useNavigate();
  const [threeRules, setThreeRules] = useState(false);

  useEffect(() => {
    const timeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 1,
    });

    landingPageTextLines.forEach((_, index) => {
      timeline
        .fromTo(
          textRefs.current[index],
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power1.in" },
          `+=${index === 0 ? 0 : 1.25}`
        )
        .to(
          textRefs.current[index],
          { y: -30, opacity: 0, duration: 1, ease: "power1.out" },
          `+=1`
        );
    });
  }, []);

  useGSAP(() => {
    landingPAgeGSAPAnimations(imgRef, buttonRef, enterIconRef);
  });

  const handleLogin = () => {
    if (loginStatus === "true") {
      navigate("/main");
    } else {
      navigate("/login");
    }
  };

  const visitLogin = () => {
    window.localStorage.setItem("userId", "visitor88084");
    window.localStorage.setItem("loginStatus", true);
    navigate("/main");
  };

  return (
    <Background>
      <video src={video} loop autoPlay muted></video>
      <video src={video2} loop autoPlay muted></video>
      <MainSection>
        <LeftSection>
          <img ref={imgRef} src={logo} alt={logo} />
          {landingPageTextLines.map((text, index) => (
            <p key={index} ref={(el) => (textRefs.current[index] = el)}>
              {text}
            </p>
          ))}
        </LeftSection>
        <RightSection ref={buttonRef}>
          <div onClick={() => setThreeRules(true)}>
            <ScrollText />
            <span>
              <h1>溫柔宣言</h1>
              <p>來這裡請你溫柔以待</p>
            </span>
            <ChevronRight ref={enterIconRef} />
          </div>
          <div onClick={handleLogin}>
            <UsersRound />
            <span>
              <h1>登入/註冊</h1>
              <p>投稿你的疼痛故事</p>
            </span>
            <ChevronRight />
          </div>
          <div onClick={visitLogin}>
            <UserRoundSearch />
            <span>
              <h1>訪客</h1>
              <p>訪客模式進入</p>
            </span>
            <ChevronRight />
          </div>
        </RightSection>
      </MainSection>

      {!threeRules ? null : <ThreeRules setThreeRules={setThreeRules} />}
    </Background>
  );
}
