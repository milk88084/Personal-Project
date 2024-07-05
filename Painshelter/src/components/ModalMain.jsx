import BackdropMainPage from "./BackdropMainPage";
import { MainModal } from "@/utils/zustand.js";
import modalpoem from "@/assets/img/modalpoem.jpg";
import styled, { keyframes } from "styled-components";
import Slider from "react-slick";
import categories from "@/assets/gif/categories.gif";
import highlight from "@/assets/gif/highlight.gif";
import mainPageTypeGuide from "@/assets/img/mainPageTypeGuide.png";
import painMap from "@/assets/gif/painMap.gif";
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
  align-items: center;
  padding: 30px;
  flex-direction: column;
  animation: ${glowing} 2s infinite ease-in-out;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto auto;
  border-radius: 15px;
  span {
    width: 100%;
    font-size: 20px;
    font-weight: 900;
    text-align: end;
    cursor: pointer;
  }

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

  .slick-prev,
  .slick-next {
    visibility: hidden;
  }

  @media screen and (max-width: 1279px) {
    width: 400px;
    height: 400px;
    padding: 15px;
    border-radius: 12px;
    align-items: center;

    h1 {
      font-size: 25px;
      margin-bottom: 0px;
      height: 50px;
    }

    h2 {
      font-size: 14px;
      padding: 0;
    }

    div {
      width: 350px;
    }

    img {
      width: 300px;
      margin-left: 27.5px;
    }
  }
`;

const ImgSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    border-radius: 20px;
    cursor: pointer;
  }
`;
//#endregion

export default function Modal() {
  const { modal, closeModal } = MainModal();
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
          <span onClick={closeModal}>X</span>
          <h1>Tutorial</h1>
          <Slider {...settings}>
            <ImgSection key={1}>
              <img src={categories} alt={categories}></img>
              <h2>1.頁面右上方可點選按鈕功能前往功能頁面。</h2>
            </ImgSection>

            <ImgSection key={2}>
              <img src={highlight} alt={highlight}></img>
              <h2>2.文章精選可以觀看其他作者文章並進行互動。</h2>
            </ImgSection>

            <ImgSection key={3}>
              <img src={mainPageTypeGuide} alt={mainPageTypeGuide}></img>
              <h2>3.疼痛光譜蒐集使用者故事類型與關係人的統計數據。</h2>
            </ImgSection>

            <ImgSection key={4}>
              <img src={painMap} alt={painMap}></img>
              <h2>
                4.玻璃瓶儲存了每個故事，使用者可以點選玻璃瓶，獲得一張專屬小卡，也可以前往該作者頁面或儲存圖片至您的裝置中。
              </h2>
            </ImgSection>
          </Slider>
        </Background>
      ) : null}
    </div>
  );
}
