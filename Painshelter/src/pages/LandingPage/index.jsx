import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import video from "../../assets/video/landingPage.mp4";
import video2 from "../../assets/video/landingPage2.mp4";
import logo from "../../assets/img/logoTitle.png";
import { ScrollText } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { UsersRound } from "lucide-react";
import backgroundImg1 from "../../assets/img/disagreeImg1.jpg";
import { CarouselDemo } from "../../components/Shadcn/CarouselDemo";
import logoImg from "../../assets/img/logoImg.png";
import logoTitle from "../../assets/img/logoTitle3.png";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

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

const LeftSection = styled.div`
  color: #e1e0d9;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  align-items: center;
  margin-top: 250px;
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
    top: 0;
    left: 0;
    width: 50%;
    align-items: center;
    margin-top: 100px;
    margin-left: 120px;
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
  position: absolute;
  width: 50%;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  margin-top: 250px;
  padding-left: 300px;

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
    top: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    margin-top: 420px;
    padding-left: 0px;
    color: #151517;

    div {
      padding: 10px;
      width: 250px;
      margin: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #e1e0d9;
    }
  }
`;

const ModalBackground = styled.div`
  background-image: url(${backgroundImg1});
  position: absolute;
  z-index: 1001;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
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
//#endregion

const textLines = [
  "沒有任何一種悲傷不值得一提",
  "將疼痛的故事紀錄在日記室中",
  "確認現階段的憂鬱指數",
  "用一首歌來沉澱自己內心的樣子",
];
export default function LandingPage() {
  const textRefs = useRef([]);
  const imgRef = useRef(null);
  const buttonRef = useRef(null);
  const enterIconRef = useRef(null);
  const [threeRules, setThreeRules] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 1,
    });

    textLines.forEach((_, index) => {
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

  useEffect(() => {
    gsap.fromTo(
      imgRef.current,
      { scale: 0.2, opacity: 0 },
      { scale: 1, opacity: 1, duration: 5, ease: "elastic.out(1, 0.3)" }
    );
  }, []);

  useEffect(() => {
    gsap.fromTo(
      buttonRef.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 3, ease: "expo.out" }
    );
  }, []);

  useEffect(() => {
    gsap.to(enterIconRef.current, {
      scale: 1.5,
      opacity: 1,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <Background>
      <video src={video} loop autoPlay muted></video>
      <video src={video2} loop autoPlay muted></video>
      <div>
        <LeftSection>
          <img ref={imgRef} src={logo} alt={logo} />
          {textLines.map((text, index) => (
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
          <div onClick={() => navigate("/login")}>
            <UsersRound />
            <span>
              <h1>登入/註冊</h1>
              <p>投稿你的疼痛故事</p>
            </span>
            <ChevronRight />
          </div>
        </RightSection>
      </div>

      {!threeRules ? null : (
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
                  <button onClick={() => setThreeRules(false)}>同意</button>
                </ModalButton>
              </ModalContent>
            </Modal>
          </Opacity>
        </ModalBackground>
      )}
    </Background>
  );
}
