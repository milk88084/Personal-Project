import styled from "styled-components";
import Banner from "./Banner.jsx";
import AboutPainSection from "./AboutPainSection.jsx";
import HighLights from "./HighLights.jsx";
import ChartFeatures from "./ChartFeatures.jsx";
import MapSection from "./MapSection.jsx";
import FooterSection from "./FooterSection.jsx";
import CopyRight from "@/components/CopyRight.jsx";
import ModalMain from "@/components/ModalMain.jsx";
import { MainModal } from "@/utils/zustand.js";
import { useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";

//#region
const Background = styled.div`
  background-color: #1a1a1a;
  position: relative;
  overflow-x: hidden;
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

const ShowNewbieGuide = styled.div``;

//#endregion
export default function MainPage() {
  const map = useRef(null);
  const about = useRef(null);
  const about2 = useRef(null);
  const firstRef = useRef(null);
  const highlight = useRef(null);
  const chart = useRef(null);
  const topSectionRef = useRef(null);
  const footer = useRef(null);
  const thirdRef = useRef(null);
  const fifthRef = useRef(null);
  const seventhRef = useRef(null);
  const imageRef = useRef(null);
  const logoRef = useRef(null);
  const subtitle = useRef(null);
  const { modal, showModal } = MainModal();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <Background>
      <span ref={topSectionRef}></span>
      <Banner
        firstRef={firstRef}
        about={about}
        chart={chart}
        thirdRef={thirdRef}
        map={map}
        footer={footer}
        fifthRef={fifthRef}
        showModal={showModal}
        seventhRef={seventhRef}
        logoRef={logoRef}
        imageRef={imageRef}
        subtitle={subtitle}
      />
      <AboutPainSection about={about} about2={about2} />
      <FeatureTitles>
        <p>精選文章</p>
      </FeatureTitles>
      <HighLights highlight={highlight} />
      <ChartFeatures chart={chart} />
      <span ref={map}>
        <FeatureTitles>
          <p>疼痛地圖</p>
          <FeatureSubTitles>觸碰玻璃瓶，解鎖被時間遺忘的故事</FeatureSubTitles>
        </FeatureTitles>
        <MapSection />
      </span>
      <FooterSection footer={footer} topSectionRef={topSectionRef} />
      <CopyRight></CopyRight>
      <ShowNewbieGuide>{modal ? <ModalMain /> : null}</ShowNewbieGuide>
    </Background>
  );
}
