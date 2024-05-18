import "survey-core/defaultV2.min.css";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Model } from "survey-core";
import { themeJson } from "../../assets/survey";
import { PopupSurvey } from "survey-react-ui";
import { useAuthCheck } from "@/utils/hooks/useAuthCheck.jsx";
import { updateUserStressRecord } from "@/utils/firebase/firebaseService.js";
import { helpPAgeGSAPAnimations } from "@/utils/gsapAnimations.js";
import { bouncy } from "ldrs";
import { useGSAP } from "@gsap/react";
import { useHelpModal } from "../../utils/zustand.js";
import videoSrc from "../../assets/video/helpbanner.mp4";
import feature3Banner from "../../assets/img/feature3Banner.png";
import zero from "../../assets/img/help_zero.png";
import one from "../../assets/img/help_one.png";
import two from "../../assets/img/help_two.png";
import four from "../../assets/img/help_four.png";
import json from "../../utils/data/survey.json";
import styled from "styled-components";
import AnimatedNumber from "../../components/AnimatedNumber";
import SurveyResult from "./SurveyResult";
import Buttons from "../../components/Buttons.jsx";

//#region
const Background = styled.div`
  font-family: "Noto Sans TC", sans-serif;
  background-color: #11120f;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BlackBackground = styled.div`
  background-color: #000000;
  opacity: 0.9;
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10;
`;

const TopSection = styled.div`
  position: relative;

  video {
    height: 100vh;
    width: 100vw;
    object-fit: cover;
  }

  img {
    position: absolute;
    left: 50%;
    bottom: 50%;
    z-index: 5;
    padding-right: 5rem;
    width: 40%;
  }
  @media screen and (max-width: 1279px) {
    img {
      left: 30%;
      bottom: 40%;
      width: 60%;
      padding-right: 0;
    }
  }
`;

const SubSection = styled.div`
  width: 800px;
  height: 400px;
  color: #cecece;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h2 {
    font-size: 90px;
    margin-bottom: 20px;
    font-weight: 600;
  }
  p {
    width: 700px;
    color: #b6b6b6e6;
  }
  @media screen and (max-width: 1279px) {
    width: 100%;
    padding: 0px;
    height: 100%;
    margin-bottom: 50px;
    h2 {
      font-size: 45px;
    }
    p {
      width: 70%;
    }
  }
`;

const SurveySection = styled.div`
  display: flex;
  color: #cecece;
  margin-top: 60px;
  h3 {
    font-size: 40px;
    text-align: center;
    height: 60px;
  }
  p {
    height: 150px;
    color: #e6e6e6e6;
  }
  @media screen and (max-width: 1279px) {
    flex-direction: column;
    align-items: center;
    h3 {
      font-size: 30px;
      height: 30px;
    }
    p {
      height: 100%;
    }
  }
`;

const AccordingSection = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  p {
    font-size: 50px;
    margin-top: 30px;
  }

  div {
    font-size: 65px;
  }
  @media screen and (max-width: 1279px) {
    width: 100%;
    padding: 0px;
  }
  div {
    font-size: 65px;
  }
`;

const ComfirmSection = styled.div`
  width: 650px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 35px;
  p {
    margin-top: 30px;
  }
  @media screen and (max-width: 1279px) {
    width: 80%;
    margin-left: 0px;
    padding: 7px;
    height: 100%;

    p {
      margin-bottom: 50px;
    }
  }
`;

const ButtonSection = styled.div`
  margin-top: 20px;
  display: flex;
  @media screen and (max-width: 1279px) {
    justify-content: space-between;
    width: 100%;
    margin-top: 10px;
  }
`;

const SurveyDialog = styled.div`
  .sv_window {
    max-width: 80% !important;
    max-height: 80% !important;
    border: 0px !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    margin: auto auto !important;
    bottom: 0 !important;
    background-color: black !important;
  }

  .sd-progress-buttons__page-title {
    font-size: 20px !important;
    line-height: 30px !important;
  }

  .sd-progress-buttons__button {
    width: 40px !important;
    height: 40px !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }
  .sd-progress-buttons__button-background {
    width: 40px !important;
    height: 40px !important;
  }

  .sd-progress-buttons__button-content {
    width: 40px !important;
    height: 40px !important;
  }

  .sd-item__decorator {
    background-color: #5c5c5c !important;
  }

  @media screen and (max-width: 1279px) {
    .sd-progress-buttons__page-title {
      font-size: 12px !important;
      line-height: auto !important;
    }
  }
`;
const LoadingSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
//#endregion

function SurveyComponent() {
  const [show, setShow] = useState(false);
  const [surveyData, setSurveyData] = useState([]);
  const [score, setScore] = useState(null);
  const [complete, setComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { modal, showModal, closeModal } = useHelpModal();
  const survey = new Model(json);
  const resultBottom = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  survey.applyTheme(themeJson);
  bouncy.register();
  useAuthCheck();

  //回到網頁最上方
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleClick = () => {
    setShow(true);
    setComplete(false);
    showModal();
  };

  //測驗完移動到結果
  const scrollToBottom = () => {
    resultBottom.current.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  //監聽彈跳視窗叉叉按鈕的狀態
  useEffect(() => {
    const closeButton = document.querySelector(".sv_window_button_close");
    if (closeButton) {
      const handleCustomClose = () => {
        setShow(false);
        closeModal();
      };
      closeButton.addEventListener("click", handleCustomClose);
      return () => closeButton.removeEventListener("click", handleCustomClose);
    }
  }, [show]);

  useEffect(() => {
    if (surveyData.length === 0) return;
    const showResult = staticData(surveyData);
    const score = totalScore(showResult);
    setScore(score);
    scrollToBottom();
  }, [surveyData]);

  //將資料存到state裡面
  survey.onComplete.add(function (result) {
    const surveyData = JSON.stringify(result.data);
    if (surveyData) {
      const results = JSON.parse(surveyData);
      closeModal();
      setSurveyData(results);
      setShow(false);
      setComplete(true);
    }
  });

  //統計測驗結果
  function staticData(data) {
    let resultsData = {};
    for (let section of Object.values(data)) {
      for (let item of Object.values(section)) {
        if (item in resultsData) {
          resultsData[item] += 1;
        } else {
          resultsData[item] = 1;
        }
      }
    }
    return resultsData;
  }

  function totalScore(data) {
    let score = 0;
    for (let [key, value] of Object.entries(data)) {
      if (key === "seldom") {
        score += value * 1;
      } else if (key === "often") {
        score += value * 2;
      } else if (key === "always") {
        score += value * 3;
      }
    }
    return score;
  }

  //監聽測驗結果，存到firestore中的users集合
  useEffect(() => {
    const localStorageUserId = window.localStorage.getItem("userId");
    if (localStorageUserId) {
      updateUserStressRecord(localStorageUserId, score, complete, setIsLoading);
    }
  }, [score, complete]);

  //GSAP
  let imgText = useRef(null);
  let titleSection1 = useRef(null);
  let titleSection2 = useRef(null);
  let titleSection3 = useRef(null);
  useGSAP(() => {
    helpPAgeGSAPAnimations(
      imgText,
      titleSection1,
      titleSection2,
      titleSection3
    );
  });

  return (
    <>
      {modal ? <BlackBackground></BlackBackground> : null}

      <Background>
        <TopSection>
          <video src={videoSrc} loop height="480px" autoPlay muted></video>
          <img ref={imgText} src={feature3Banner} alt={feature3Banner} />
        </TopSection>
        <SubSection ref={titleSection1}>
          <h2> 關於心情低落</h2>
          <p>
            世界衛生組織估計，到2030年，憂鬱症會是造成全球社會經濟負擔第一名的疾病。隨著國人罹患憂鬱症的比例逐漸增高，社會大眾慢慢理解罹患「憂鬱症」是生病，但也因為理解的程度不一，容易把「憂鬱情緒」和「憂鬱症」混為一談。今天的文章帶你認識憂鬱症檢測的工具，讓我們繼續看下去吧！
          </p>
        </SubSection>
        <SubSection ref={titleSection2}>
          <h2> 難過的情緒</h2>
          <p>
            「憂鬱情緒」是正常的情緒反應之一，當我們遇到挫敗或事情不如意時，難免會悶悶不樂，心情不好。就如同天氣，一天的陰雨並不會造成太大的影響，但連日的豪雨就有可能造成嚴重的災害。如果憂鬱的情緒嚴重，持續兩周以上，無法正常上班上學，無法正常生活，那就是「憂鬱症」。
          </p>
        </SubSection>

        <SurveySection ref={titleSection3}>
          <AccordingSection>
            <h3>根據統計</h3>
            <div>
              <AnimatedNumber end={1250000} />
            </div>
          </AccordingSection>
          <ComfirmSection>
            <h3>我有憂鬱的情緒嗎？</h3>
            <p>
              台灣約8.95% (約200萬人) 的人口有憂鬱症狀，約5.2% (約125萬人)
              的人符合憂鬱症診斷，
              一旦發現憂鬱情緒已經嚴重到無法調節和掌控，並且影響到生活，就要懷疑自己是否得了憂鬱症。憂鬱症篩檢量表可用來做初步的憂鬱症檢測，看看自己是否是高風險族群，如果分數過高就有罹患憂鬱症的風險，應該進一步接受專業精神科醫師的評估來確立「憂鬱症」診斷。
            </p>
            <ButtonSection>
              <Buttons onClick={handleClick} text="點我測驗" />
              <Buttons onClick={() => navigate("/main")} text="首頁" />
            </ButtonSection>
          </ComfirmSection>
        </SurveySection>

        <SurveyDialog>
          {show ? (
            <PopupSurvey
              model={survey}
              isExpanded={true}
              closeOnCompleteTimeout={-1}
              allowClose={true}
              onHide={() => setShow(false)}
            />
          ) : null}
        </SurveyDialog>

        {isLoading ? (
          <LoadingSection>
            <l-bouncy size="60" speed="1.75" color="white"></l-bouncy>
          </LoadingSection>
        ) : (
          <div ref={resultBottom}>
            {Object.keys(surveyData).length > 0 ? (
              <>
                {score <= 8 ? (
                  <SurveyResult
                    imgSrc={zero}
                    score={score}
                    title="橘黃色階段：情緒之光正在溫暖地閃耀"
                    description="目前的情緒狀態非常穩定，宛如初升的橘黃曙光，溫暖而寧靜。您是那種懂得適時調整自己情緒並有效紓解壓力的人。在這個階段，繼續保持您的正向處理方式，並享受生活中的每一刻光芒。"
                    navigate={navigate}
                    handleClick={handleClick}
                  />
                ) : score <= 18 ? (
                  <SurveyResult
                    imgSrc={one}
                    score={score}
                    title="淺綠色階段：當生活顯得有點不順時"
                    description="現在你可能感覺有些低落，笑容不再容易展現，心中充滿了苦惱和煩悶。即使身邊的朋友們也許無法完全理解您的心情。在《悲傷疼痛日記室》中尋找支持，分享感受，或是尋求專業醫生的協助。讓這一抹淺綠帶來一絲清新和希望，幫助您逐漸遠離不舒服的感覺。"
                    navigate={navigate}
                    handleClick={handleClick}
                  />
                ) : score <= 28 ? (
                  <SurveyResult
                    imgSrc={two}
                    score={score}
                    title="粉紫到藍色階段：當壓力達到臨界點"
                    description="您是否感到心中有太多未解的重擔，肩頭如同被巨石壓住般沉重？這個階段，你的精神負擔可能已經達到了極限。現在是時候停下來，不要再強迫自己「撐下去」了！尋找那些經歷過類似狀況的朋友進行交流，給心情找一個宣洩的出口，讓這些壓力得以釋放。如果您不確定應該向誰開口，或是需要更專業的幫助，請勇敢尋求專業的醫療資源。就像這片由粉紫逐漸過渡到藍色的天空，讓我們一起步入更寧靜、釋放的境地。"
                    navigate={navigate}
                    handleClick={handleClick}
                  />
                ) : (
                  <SurveyResult
                    imgSrc={four}
                    score={score}
                    title="紅色警戒階段：當心情進入緊急狀態"
                    description="你是否感覺非常不舒服，似乎被持續的沮喪和悲傷所困擾，難以自拔？這可能是一個信號，表明你的身心狀態目前非常不穩定。強烈建議你尋求專業的醫療幫助。前往最近的醫療機構，讓專業醫生進行詳細診斷和治療，他們的專業意見和治療方案可能會為你帶來意想不到的正面影響。不要猶豫，不要抗拒尋求幫助。讓我們一起努力，逐步減輕那些壓迫您的不舒服感受，恢復到更舒服的狀態。"
                    navigate={navigate}
                    handleClick={handleClick}
                  />
                )}
              </>
            ) : null}
          </div>
        )}
      </Background>
    </>
  );
}

export default SurveyComponent;
