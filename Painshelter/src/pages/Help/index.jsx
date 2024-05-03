import "survey-core/defaultV2.min.css";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Model } from "survey-core";
import { themeJson } from "../../assets/survey";
import { PopupSurvey } from "survey-react-ui";
import { db } from "../../utils/firebase/firebase.jsx";
import {
  collection,
  query,
  getDocs,
  where,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import videoSrc from "../../assets/video/helpbanner.mp4";
import feature3Banner from "../../assets/img/feature3Banner.png";
import zero from "../../assets/img/help_zero.png";
import one from "../../assets/img/help_one.png";
import two from "../../assets/img/help_two.png";
import four from "../../assets/img/help_four.png";
import json from "../../utils/data/survey.json";
import styled from "styled-components";
import AnimatedNumber from "../../components/AnimatedNumber";
import { bouncy } from "ldrs";

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

const TopSection = styled.div`
  position: relative;
  img {
    position: absolute;
    left: 50%;
    bottom: 50%;
    z-index: 100;
    padding-right: 5rem;
    width: 50%;
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
    color: #e6e6e6e6;
  }
  @media screen and (max-width: 1279px) {
    width: 100%;
    padding: 20px;
    height: 100%;
    h2 {
      font-size: 45px;
    }
    p {
      width: 100%;
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
  @media screen and (max-width: 1279px) {
    width: 100%;
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
    width: 100%;
    margin-left: 0px;
    padding: 15px;
    height: 100%;
  }
`;

const ButtonSection = styled.div`
  button {
    padding: 6px;
    border-radius: 10px;
    font-weight: 400;
    margin: 24px;
    font-size: 20px;
    background-color: #19242b;
    color: white;
    margin-right: 20px;
    &:hover,
    &:focus {
      background-color: #9ca3af;
      color: black;
    }
  }
  @media screen and (max-width: 1279px) {
    button {
      margin: 0px;
      margin-right: 20px;
    }
  }
`;

const SurveyDialog = styled.div`
  .sv_window {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100% !important;
    height: 80% !important;
    max-width: 100% !important;
    max-height: 80vh !important;
    overflow: none !important;
  }

  .sd-body {
    width: 100% !important;
  }

  .sv_window_buttons_container {
    position: static !important;
  }
`;

const ResualtSection = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 20px;
  width: 1100px;
  margin-bottom: 30px;
  background-color: rgb(255, 255, 255, 0.3);
  padding: 30px;
  @media screen and (max-width: 1279px) {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
`;

const ResualtImg = styled.div`
  img {
    width: 300px;
    border-radius: 20px;
  }
  @media screen and (max-width: 1279px) {
    img {
      width: 100%;
    }
  }
`;
const ResualtContent = styled.div`
  width: 600px;
  h2 {
    font-size: 60px;
    font-weight: 600;
  }

  span {
    color: #a4eaff;
  }

  h3 {
    font-size: 35px;
  }

  p {
    font-size: 20px;
    opacity: 0.6;
  }
  button {
    padding: 6px;
    border-radius: 10px;
    font-weight: 400;
    font-size: 20px;
    background-color: #19242b;
    color: white;
    margin-right: 20px;
    margin-top: 30px;

    &:hover,
    &:focus {
      background-color: #9ca3af;
      color: black;
    }
  }
  @media screen and (max-width: 1279px) {
    width: 100%;
    h2 {
      font-size: 35px;
    }

    h3 {
      font-size: 25px;
    }

    p {
      font-size: 15px;
    }
  }
`;

const ResualtButton = styled.div``;
const LoadingSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
//#endregion

function SurveyComponent() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [surveyData, setSurveyData] = useState([]);
  const [complete, setComplete] = useState(false);
  const survey = new Model(json);
  const result = useRef(null);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  survey.applyTheme(themeJson);
  bouncy.register();
  //回到網頁最上方
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleClick = () => {
    setShow(true);
    setComplete(false);
  };

  //測驗完移動到結果
  const scrollSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  //監聽彈跳視窗叉叉按鈕的狀態
  useEffect(() => {
    const closeButton = document.querySelector(".sv_window_button_close");
    if (closeButton) {
      const handleCustomClose = () => {
        setShow(false);
      };
      closeButton.addEventListener("click", handleCustomClose);
      return () => closeButton.removeEventListener("click", handleCustomClose);
    }
  }, [show]);

  //將資料存到state裡面
  survey.onComplete.add(function (result) {
    const surveyData = JSON.stringify(result.data);
    if (surveyData) {
      const results = JSON.parse(surveyData);
      setSurveyData(results);
      setShow(false);
      setComplete(true);
      scrollSection(result);
    }
  });
  // console.log(surveyData);

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
  const showResult = staticData(surveyData);
  console.log(showResult);

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
  const score = totalScore(showResult);

  //監聽測驗結果，存到firestore中的users集合
  useEffect(() => {
    const localStorageUserId = window.localStorage.getItem("userId");
    const recordArray = { time: Timestamp.fromDate(new Date()), number: score };
    async function getUser() {
      try {
        const q = query(
          collection(db, "users"),
          where("id", "==", localStorageUserId)
        );
        const querySnapshot = await getDocs(q);

        if (complete === false) {
          return;
        } else if (complete) {
          const docRef = querySnapshot.docs[0].ref;
          setIsLoading(true);
          await updateDoc(docRef, {
            stressRecord: arrayUnion(recordArray),
          });
          setIsLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getUser();
  }, [complete]);

  return (
    <>
      <Background>
        <TopSection>
          <video src={videoSrc} loop height="480px" autoPlay muted></video>
          <img src={feature3Banner} alt={feature3Banner} />
        </TopSection>

        <SubSection>
          <h2> 關於心情低落</h2>
          <p>
            世界衛生組織估計，到2030年，憂鬱症會是造成全球社會經濟負擔第一名的疾病。隨著國人罹患憂鬱症的比例逐漸增高，社會大眾慢慢理解罹患「憂鬱症」是生病，但也因為理解的程度不一，容易把「憂鬱情緒」和「憂鬱症」混為一談。今天的文章帶你認識憂鬱症檢測的工具，讓我們繼續看下去吧！
          </p>
        </SubSection>
        <SubSection>
          <h2> 難過的情緒</h2>
          <p>
            「憂鬱情緒」是正常的情緒反應之一，當我們遇到挫敗或事情不如意時，難免會悶悶不樂，心情不好。就如同天氣，一天的陰雨並不會造成太大的影響，但連日的豪雨就有可能造成嚴重的災害。如果憂鬱的情緒嚴重，持續兩周以上，無法正常上班上學，無法正常生活，那就是「憂鬱症」。
          </p>
        </SubSection>
        <SurveySection>
          <AccordingSection>
            <h3>根據統計</h3>
            <p>
              <AnimatedNumber end={1250000} />
            </p>
          </AccordingSection>
          <ComfirmSection>
            <h3>我有憂鬱的情緒嗎？</h3>
            <p>
              台灣約8.95% (約200萬人) 的人口有憂鬱症狀，約5.2% (約125萬人)
              的人符合憂鬱症診斷，
              一旦發現憂鬱情緒已經嚴重到無法調節和掌控，並且影響到生活，就要懷疑自己是否得了憂鬱症。憂鬱症篩檢量表可用來做初步的憂鬱症檢測，看看自己是否是高風險族群，如果分數過高就有罹患憂鬱症的風險，應該進一步接受專業精神科醫師的評估來確立「憂鬱症」診斷。
            </p>
            <ButtonSection ref={result}>
              <button onClick={handleClick}>點我測驗</button>
              <button onClick={() => navigate("/")}>回首頁</button>
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
          <>
            {surveyData && score ? (
              score <= 8 ? (
                <ResualtSection>
                  <ResualtImg>
                    <img src={zero} alt={zero} />
                  </ResualtImg>
                  <ResualtContent>
                    <h2>
                      測驗結果：
                      <span>
                        <AnimatedNumber end={score} />
                      </span>
                    </h2>
                    <h3>目前你的狀態</h3>
                    <p>
                      你目前的情緒狀態很穩定，是個懂得適時調整情緒及紓解壓力的人。
                    </p>
                    <ResualtButton>
                      <button onClick={() => navigate("/post")}>
                        撰寫日記
                      </button>
                      <button onClick={handleClick}>重新測驗</button>
                      <button onClick={() => navigate("/history")}>
                        疼痛日記室
                      </button>
                      <button onClick={() => navigate("/")}>回到首頁</button>
                    </ResualtButton>
                  </ResualtContent>
                </ResualtSection>
              ) : 9 <= score <= 18 ? (
                <ResualtSection>
                  <ResualtImg>
                    <img src={one} alt={one} />
                  </ResualtImg>
                  <ResualtContent>
                    <h2>
                      測驗結果：
                      <span>
                        <AnimatedNumber end={score} />
                      </span>
                    </h2>
                    <h3>目前你的狀態</h3>
                    <p>
                      現在的你可能感到不太順心，無法展露笑容，一肚子苦惱及煩悶，連朋友也不知道如何幫你，
                      建議你可以找找看，有沒有相關的資源可以幫助你控制這樣不舒服的感受，如果煩悶的感受一直沒有消失，就要去找專業的醫生來幫忙唷。
                    </p>
                    <ResualtButton>
                      <button onClick={() => navigate("/post")}>
                        撰寫日記
                      </button>
                      <button onClick={handleClick}>重新測驗</button>
                      <button onClick={() => navigate("/history")}>
                        疼痛日記室
                      </button>
                      <button onClick={() => navigate("/")}>回到首頁</button>
                    </ResualtButton>
                  </ResualtContent>
                </ResualtSection>
              ) : 19 < score <= 28 ? (
                <ResualtSection>
                  <ResualtImg>
                    <img src={two} alt={two} />
                  </ResualtImg>
                  <ResualtContent>
                    <h2>
                      測驗結果：
                      <span>
                        <AnimatedNumber end={score} />
                      </span>
                    </h2>
                    <h3>目前你的狀態</h3>
                    <p>
                      你是否感覺有許多事壓在心上，肩上總覺得很沉重 ?
                      因為你的壓力負荷量已到臨界點了，千萬別再『撐』了 !
                      趕快找個有相同經驗的朋友聊聊，給心情找個出口，把肩上的重擔放下，這樣才不會陷入鬱卒的漩渦
                      !
                      如果你不知道該找誰傾訴，建議可以找一些專業的醫療資源協助你。
                    </p>
                    <ResualtButton>
                      <button onClick={() => navigate("/post")}>
                        撰寫日記
                      </button>
                      <button onClick={handleClick}>重新測驗</button>
                      <button onClick={() => navigate("/history")}>
                        疼痛日記室
                      </button>
                      <button onClick={() => navigate("/")}>回到首頁</button>
                    </ResualtButton>
                  </ResualtContent>
                </ResualtSection>
              ) : (
                <ResualtSection>
                  <ResualtImg>
                    <img src={four} alt={four} />
                  </ResualtImg>
                  <ResualtContent>
                    <h2>
                      測驗結果：
                      <span>
                        <AnimatedNumber end={score} />
                      </span>
                    </h2>
                    <h3>目前你的狀態</h3>
                    <p>
                      你是不是感到相當的不舒服，會不由自主的沮喪、難過，無法掙脫?
                      可能你目前的身心狀況不太穩定，建議可以到最近的醫院去找專業的醫生做診斷，透過他們的診療與治療，你也許會有意想不到的回饋，
                      不要抗拒去尋求資源，希望透過這樣的處理，可以讓自己慢慢降低這種不舒服的感受！
                    </p>
                    <ResualtButton>
                      <button onClick={() => navigate("/post")}>
                        撰寫日記
                      </button>
                      <button onClick={handleClick}>重新測驗</button>
                      <button onClick={() => navigate("/history")}>
                        疼痛日記室
                      </button>
                      <button onClick={() => navigate("/")}>回到首頁</button>
                    </ResualtButton>
                  </ResualtContent>
                </ResualtSection>
              )
            ) : null}
          </>
        )}
      </Background>
    </>
  );
}

export default SurveyComponent;
