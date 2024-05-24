import BackdropMainPage from "./BackdropMainPage";
import { MainModal } from "@/utils/zustand.js";
import modalpoem from "@/assets/img/modalpoem.jpg";
import styled, { keyframes } from "styled-components";
import Slider from "react-slick";
import categories from "@/assets/video/categories.mp4";
import highlight from "@/assets/video/highlight.mp4";
import mainPageTypeGuide from "@/assets/img/mainPageTypeGuide.png";
import painMap from "@/assets/video/painMap.mp4";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//#region
const glowing = keyframes`
  0% { box-shadow: 0 0 5px #ffd4f4; }
  50% { box-shadow: 0 0 20px #ffd4f4; }
  100% { box-shadow: 0 0 5px #ffd4f4; }
`;

const Background = styled.div`
  background-image: url(${modalpoem});
  z-index: 5000;
  width: 700px;
  height: 650px;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  flex-direction: column;
  font-family: "Noto Sans TC", sans-serif;
  animation: ${glowing} 2s infinite ease-in-out;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto auto;
  border-radius: 15px;
  h1 {
    font-size: 50px;
    font-weight: 600;
    color: #363b44;
    margin-bottom: 30px;
  }

  div {
    width: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h2 {
    color: #363b44;
    text-align: center;
    font-size: 17px;
    padding: 10px;
    margin-top: 30px;
  }

  button {
    padding: 0px;
    width: 30px;
    height: 30px;
  }

  .slick-next:before {
    background-color: #363b44;
    border-radius: 20px;
  }

  .slick-prev:before {
    background-color: #363b44;
    border-radius: 20px;
  }

  @media screen and (max-width: 1279px) {
    width: 400px;
    height: 500px;
    padding: 15px;
    border-radius: 12px;
    h1 {
      font-size: 25px;
      margin-bottom: 0px;
      height: 50px;
    }

    button {
      padding: 7px;
      border-radius: 10px;
      margin: 20px;
    }

    h2 {
      font-size: 14px;
      padding: 0;
      margin-bottom: 25px;
    }

    div {
      width: 350px;
    }

    video {
      width: 300px;
      text-align: center;
      margin-left: 27.5px;
    }

    img {
      width: 300px;
      margin-left: 27.5px;
    }

    .slick-prev,
    .slick-next {
      top: 84px;
    }
  }
`;

const VideoSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  video {
    border-radius: 20px;
  }

  img {
    border-radius: 20px;
  }
`;
//#endregion

export default function Modal() {
  const { modal } = MainModal();
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div>
      <BackdropMainPage />
      {modal ? (
        <Background>
          <h1>Tutorial</h1>
          <Slider {...settings}>
            <VideoSection key={1}>
              <video src={categories} loop autoPlay muted></video>
              <h2>1.頁面右上方可點選按鈕功能前往功能頁面。</h2>
            </VideoSection>

            <VideoSection key={2}>
              <video src={highlight} loop autoPlay muted></video>
              <h2>2.文章精選可以觀看其他作者文章並進行互動。</h2>
            </VideoSection>

            <VideoSection key={3}>
              <img src={mainPageTypeGuide}></img>
              <h2>3.疼痛光譜蒐集使用者故事類型與關係人的統計數據。</h2>
            </VideoSection>

            <VideoSection key={4}>
              <video src={painMap} loop autoPlay muted></video>
              <h2>
                4.玻璃瓶儲存了每個故事，使用者可以點選玻璃瓶，獲得一張專屬小卡，也可以前往該作者頁面或儲存圖片至您的裝置中。
              </h2>
            </VideoSection>
          </Slider>
        </Background>
      ) : null}
    </div>
  );
}
