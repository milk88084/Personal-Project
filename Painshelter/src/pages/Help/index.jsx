import "survey-core/defaultV2.min.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import json from "../../utils/data/survey.json";
import styled from "styled-components";

const Background = styled.div`
  background-color: black;
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
`;

const Title = styled.div`
  text-align: center;
  font-size: 80px;
  letter-spacing: 0.05em;
`;

const SubSection = styled.div`
  width: 800px;
  height: 500px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h2 {
    font-size: 90px;
    margin-bottom: 40px;
  }
  p {
    width: 500px;
  }
`;

const SurveySection = styled.div`
  display: flex;
  justify-content: center;
  width: 800px;

  div:nth-of-type(1) {
    width: 30%;
    padding: 20px;
  }
`;

function SurveyComponent() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [surveyData, setSurveyData] = useState([]);
  const [complete, setComplete] = useState(false);
  const survey = new Model(json);
  survey.applyTheme(themeJson);

  const handleClick = () => {
    setShow(true);
    setComplete(false);
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
          await updateDoc(docRef, {
            stressRecord: arrayUnion(recordArray),
          });
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
          <div>
            <h3>根據統計</h3>
            <p>2,000,000</p>
          </div>
          <div>
            <h3>我有憂鬱的情緒嗎？</h3>
            <p>
              一旦發現憂鬱情緒已經嚴重到無法調節和掌控，並且影響到生活，就要懷疑自己是否得了憂鬱症。憂鬱症篩檢量表可用來做初步的憂鬱症檢測，看看自己是否是高風險族群，如果分數過高就有罹患憂鬱症的風險，應該進一步接受專業精神科醫師的評估來確立「憂鬱症」診斷。
            </p>
          </div>
        </SurveySection>
      </Background>
      <div className="bg-oceanblack text-white">
        <div className="relative"></div>
        <div className="flex justify-center items-center my-16">
          <div className="flex w-4/6 justify-center mt-16">
            <div className="w-2/6 ">
              <h1 className="text-4xl text-center">根據統計</h1>
              <p className="text-center text-4xl mt-12 text-gray-300">
                2,000,000
              </p>
            </div>
            <div className="w-4/6">
              <h1 className=" text-4xl   text-center">我有憂鬱的情緒嗎？</h1>
              <p className=" mt-10 text-gray-300 ">
                一旦發現憂鬱情緒已經嚴重到無法調節和掌控，並且影響到生活，就要懷疑自己是否得了憂鬱症。憂鬱症篩檢量表可用來做初步的憂鬱症檢測，看看自己是否是高風險族群，如果分數過高就有罹患憂鬱症的風險，應該進一步接受專業精神科醫師的評估來確立「憂鬱症」診斷。
              </p>
              <button
                className="bg-gray-800 p-3 rounded-md mr-4 mt-6 hover:bg-red-900"
                onClick={handleClick}
              >
                點我測驗
              </button>
              <button
                className="bg-gray-800 p-3 rounded-md mr-4 mt-6 hover:bg-red-900"
                onClick={() => navigate("/")}
              >
                回首頁
              </button>
            </div>
          </div>
        </div>

        {show ? (
          <PopupSurvey
            model={survey}
            isExpanded={true}
            closeOnCompleteTimeout={-1}
            allowClose={true}
            onHide={() => setShow(false)}
          />
        ) : null}
        {surveyData && score ? (
          score <= 8 ? (
            <div className="flex justify-center items-center my-16 rounded border-gray-100">
              <div className="flex w-4/6 justify-center ">
                <img
                  src="https://favim.com/pd/s11/orig/8/897/8978/89780/aesthetic-cute-sad-cartoon-Favim.com-8978093.jpg"
                  alt=""
                  className="m-4"
                />
                <div className="m-4 flex flex-col justify-around font-black">
                  <h2 className="text-5xl">
                    測驗結果：<span className="text-blue-300">{score}</span>
                  </h2>
                  <h3 className="text-2xl">目前你的狀態</h3>
                  <p className="text-gray-300">
                    你目前的情緒狀態很穩定，是個懂得適時調整情緒及紓解壓力的人。
                  </p>
                  <div>
                    <button
                      className="bg-gray-800 p-3 rounded-md mr-4 hover:bg-red-900"
                      onClick={() => navigate("/post")}
                    >
                      撰寫日記
                    </button>
                    <button
                      className="bg-gray-800 p-3 rounded-md mr-4 hover:bg-red-900"
                      onClick={handleClick}
                    >
                      重新測驗
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : 9 <= score <= 18 ? (
            <div className="flex justify-center items-center my-16 rounded border-gray-100">
              <div className="flex w-4/6 justify-center ">
                <img
                  src="https://favim.com/pd/s11/orig/8/897/8978/89780/aesthetic-cute-sad-cartoon-Favim.com-8978093.jpg"
                  alt=""
                  className="m-4"
                />
                <div className="m-4 flex flex-col justify-around font-black">
                  <h2 className="text-5xl">
                    測驗結果：<span className="text-blue-300">{score}</span>
                  </h2>
                  <h3 className="text-2xl">目前你的狀態</h3>
                  <p className="text-gray-300">
                    現在的你可能感到不太順心，無法展露笑容，一肚子苦惱及煩悶，連朋友也不知道如何幫你，
                    建議你可以找找看，有沒有相關的資源可以幫助你控制這樣不舒服的感受，如果煩悶的感受一直沒有消失，就要去找專業的醫生來幫忙唷。
                  </p>
                  <div>
                    <button
                      className="bg-gray-800 p-3 rounded-md mr-4 hover:bg-red-900"
                      onClick={() => navigate("/post")}
                    >
                      撰寫日記
                    </button>
                    <button
                      className="bg-gray-800 p-3 rounded-md mr-4 hover:bg-red-900"
                      onClick={handleClick}
                    >
                      重新測驗
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : 19 < score <= 28 ? (
            <div className="flex justify-center items-center my-16 rounded border-gray-100">
              <div className="flex w-4/6 justify-center ">
                <img
                  src="https://favim.com/pd/s11/orig/8/897/8978/89780/aesthetic-cute-sad-cartoon-Favim.com-8978093.jpg"
                  alt=""
                  className="m-4"
                />
                <div className="m-4 flex flex-col justify-around font-black">
                  <h2 className="text-5xl">
                    測驗結果：<span className="text-blue-300">{score}</span>
                  </h2>
                  <h3 className="text-2xl">目前你的狀態</h3>
                  <p className="text-gray-300">
                    {" "}
                    你是否感覺有許多事壓在心上，肩上總覺得很沉重 ?
                    因為你的壓力負荷量已到臨界點了，千萬別再『撐』了 !
                    趕快找個有相同經驗的朋友聊聊，給心情找個出口，把肩上的重擔放下，這樣才不會陷入鬱卒的漩渦
                    !
                    如果你不知道該找誰傾訴，建議可以找一些專業的醫療資源協助你。
                  </p>
                  <div>
                    <button
                      className="bg-gray-800 p-3 rounded-md mr-4 hover:bg-red-900"
                      onClick={() => navigate("/post")}
                    >
                      撰寫日記
                    </button>
                    <button
                      className="bg-gray-800 p-3 rounded-md mr-4 hover:bg-red-900"
                      onClick={handleClick}
                    >
                      重新測驗
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center my-16 rounded border-gray-100">
              <div className="flex w-4/6 justify-center ">
                <img
                  src="https://favim.com/pd/s11/orig/8/897/8978/89780/aesthetic-cute-sad-cartoon-Favim.com-8978093.jpg"
                  alt=""
                  className="m-4"
                />
                <div className="m-4 flex flex-col justify-around font-black">
                  <h2 className="text-5xl">
                    測驗結果：<span className="text-blue-300">{score}</span>
                  </h2>
                  <h3 className="text-2xl">目前你的狀態</h3>
                  <p className="text-gray-300">
                    你是不是感到相當的不舒服，會不由自主的沮喪、難過，無法掙脫?
                    可能你目前的身心狀況不太穩定，建議可以到最近的醫院去找專業的醫生做診斷，透過他們的診療與治療，你也許會有意想不到的回饋，
                    不要抗拒去尋求資源，希望透過這樣的處理，可以讓自己慢慢降低這種不舒服的感受！
                  </p>
                  <div>
                    <button
                      className="bg-gray-800 p-3 rounded-md mr-4 hover:bg-red-900"
                      onClick={() => navigate("/post")}
                    >
                      撰寫日記
                    </button>
                    <button
                      className="bg-gray-800 p-3 rounded-md mr-4 hover:bg-red-900"
                      onClick={handleClick}
                    >
                      重新測驗
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        ) : null}

        <p>?</p>
      </div>
    </>
  );
}

export default SurveyComponent;
