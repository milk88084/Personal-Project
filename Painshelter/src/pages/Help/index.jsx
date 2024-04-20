import React from "react";
import { useNavigate } from "react-router-dom";
import { Model } from "survey-core";
import "survey-core/defaultV2.min.css";
import { themeJson } from "../../assets/survey";
import json from "../../utils/data/survey.json";
import { PopupSurvey } from "survey-react-ui";
import { useState } from "react";

function SurveyComponent() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [surveyData, setSurveyData] = useState([]);

  const survey = new Model(json);
  survey.applyTheme(themeJson);
  survey.onComplete.add(() => setShow(false));

  const handleClick = () => {
    setShow(true);
  };

  //將資料存到localstorage
  survey.onComplete.add(function (result) {
    const surveyData = JSON.stringify(result.data);
    if (surveyData) {
      const results = JSON.parse(surveyData);
      setSurveyData(results);
    }
  });

  //統計測驗結果
  console.log(surveyData);
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
    for (let item of Object.values(data)) {
      if (item === "hardly") {
        score + 0;
      } else if (item === "seldom") {
        score += 1;
      } else if (item === "often") {
        score += 2;
      } else {
        score += 3;
      }
    }
    return score;
  }

  const score = totalScore(showResult);
  console.log(score);
  //

  return (
    <>
      <div>
        <h1 className="bg-red-600">關於心情低落</h1>
        <p>
          世界衛生組織估計，到2030年，憂鬱症會是造成全球社會經濟負擔第一名的疾病。隨著國人罹患憂鬱症的比例逐漸增高，社會大眾慢慢理解罹患「憂鬱症」是生病，但也因為理解的程度不一，容易把「憂鬱情緒」和「憂鬱症」混為一談。今天的文章帶你認識憂鬱症檢測的工具，讓我們繼續看下去吧！
        </p>
      </div>
      <div>
        <h1 className="bg-red-600">難過的情緒</h1>
        <p>
          「憂鬱情緒」是正常的情緒反應之一，當我們遇到挫敗或事情不如意時，難免會悶悶不樂，心情不好。就如同天氣，一天的陰雨並不會造成太大的影響，但連日的豪雨就有可能造成嚴重的災害。如果憂鬱的情緒嚴重，持續兩周以上，無法正常上班上學，無法正常生活，那就是「憂鬱症」。
        </p>
      </div>
      <div>
        <h1 className="bg-red-600">我有憂鬱的情緒嗎？</h1>
        <p>
          一旦發現憂鬱情緒已經嚴重到無法調節和掌控，並且影響到生活，就要懷疑自己是否得了憂鬱症。憂鬱症篩檢量表可用來做初步的憂鬱症檢測，看看自己是否是高風險族群，如果分數過高就有罹患憂鬱症的風險，應該進一步接受專業精神科醫師的評估來確立「憂鬱症」診斷。
        </p>
      </div>
      <button className="bg-green-600 text-white mt-3" onClick={handleClick}>
        點我測驗
      </button>
      {show ? (
        <PopupSurvey
          model={survey}
          isExpanded={true}
          closeOnCompleteTimeout={-1}
          allowClose={true}
          onHide={() => setShow(false)}
        />
      ) : null}
      <div>測驗結果</div>
      {surveyData && score ? (
        score <= 8 ? (
          <p>
            你的分數{score}是輕微的唷， 真令人羨慕 !
            你目前的情緒狀態很穩定，是個懂得適時調整情緒及紓解壓力的人。
            下面將介紹您一些 DIY 小方法，協助您繼續維持心理健康。
          </p>
        ) : 9 <= score <= 18 ? (
          <p>
            你的分數是{score}，
            你是不是想笑又笑不太出來，有許多事壓在心上，肩上總覺得很沉重 ?
            因為你的壓力負荷量已到臨界點了，千萬別再『撐』了 !
            趕快找個有相同經驗的朋友聊聊，給心情找個出口，把肩上的重擔放下，這樣才不會陷入憂鬱症的漩渦
            !
            如果你不知道該找誰傾訴，我們已蒐集了一些專業諮詢輔導機構的資料如下，希望能為你帶來幫助。
          </p>
        ) : 19 < score <= 28 ? (
          <p>
            你的分數是{score}是中等，要小心，
            現在的你必定感到相當不順心，無法展露笑容，一肚子苦惱及煩悶，連朋友也不知道如何幫你，
            趕緊找專業諮詢輔導機構或醫療單位，透過他們的協助，必可重拾笑容 !
            如果你不知道該找誰傾訴或可以去哪裡就醫，我們已蒐集了一些相關機構的資料如下，
            希望能為你帶來幫助。
          </p>
        ) : (
          <p>
            你的分數{score}
            ，危險要去找資源，你是不是感到相當的不舒服，會不由自主的沮喪、難過，無法掙脫
            ?
            因為你的心已『感冒』，心病需要心藥醫，趕緊到醫院找專業及可信賴的醫生檢查，透過他們的診療與治療，你將不再覺得孤單、無助
            !
            如果你不知道哪裡可以就近接受治療，我們已蒐集了一些專業醫療機構的資料如下，希望能為你帶來幫助。
          </p>
        )
      ) : null}
      <button
        className="bg-green-600 text-white mt-3"
        onClick={() => navigate("/")}
      >
        回首頁
      </button>
    </>
  );
}

export default SurveyComponent;
