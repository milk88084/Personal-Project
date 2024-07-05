import { signOut } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";

import logoImg from "@/assets/img/logoImg.png";
import logoTitle from "@/assets/img/logoTitle.png";
import mainBanner from "@/assets/img/mainBanner.jpg";
import { auth } from "@/utils/firebase/firebase";
import { bannerPageGSAPAnimations } from "@/utils/gsapAnimations";
import { toastAlert } from "@/utils/toast.js";
import { useLoginState } from "@/utils/zustand.js";

//#region
const BannerWrapper = styled.div`
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
    display: none;
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
    margin-top: 150px;
    img:nth-of-type(1) {
      width: 100px;
    }

    img:nth-of-type(2) {
      width: 200px;
      margin-top: 10px;
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
//#endregion

export default function Banner({
  firstRef,
  about,
  chart,
  thirdRef,
  map,
  footer,
  fifthRef,
  showModal,
  seventhRef,
  logoRef,
  imageRef,
  subtitle,
}) {
  const navigate = useNavigate();
  const { offline, logout } = useLoginState();
  const scrollSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toastAlert("success", "成功登出", 1000);
        navigate("/");
        window.localStorage.removeItem("userId");
        window.localStorage.removeItem("loginStatus");
      })
      .catch((error) => {
        toastAlert("error", error, 3000);
        navigate("/");
      });
    offline();
    logout();
  };

  useEffect(() => {
    bannerPageGSAPAnimations(
      firstRef,
      thirdRef,
      fifthRef,
      seventhRef,
      imageRef,
      logoRef
    );
  }, []);

  return (
    <BannerWrapper>
      <BannerImg>
        <img src={mainBanner} alt="mainBannerr" />
      </BannerImg>
      <Logo>
        <img ref={logoRef} src={logoImg} alt="Logo" />
        <img ref={imageRef} src={logoTitle} alt="Logo title" />
      </Logo>
      <Categories>
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
        <button onClick={showModal}>導覽</button>
        <button ref={seventhRef} onClick={handleLogout}>
          登出
        </button>
      </Categories>

      <SubTitle ref={subtitle}>PAINSHELTER</SubTitle>
      <ToastContainer />
    </BannerWrapper>
  );
}
