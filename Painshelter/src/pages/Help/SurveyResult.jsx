import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import AnimatedNumber from "@/components/AnimatedNumber";
import Buttons from "@/components/Buttons.jsx";

//#region
const ResualtSection = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 20px;
  width: 1100px;
  margin-bottom: 50px;
  background-color: rgb(255, 255, 255, 0.3);
  padding: 30px;
  margin-top: 50px;
  @media screen and (max-width: 1279px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 30px;
    margin-bottom: 0px;
  }
`;

const ResultImg = styled.div`
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
    display: flex;
  }

  span {
    color: #a4eaff;
  }

  h3 {
    margin-top: 25px;
    font-size: 35px;
  }

  p {
    font-size: 20px;
    opacity: 0.6;
    margin-top: 8px;
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

const ResualtButton = styled.div`
  margin-top: 20px;
  display: flex;
  @media screen and (max-width: 1279px) {
    flex-direction: column;
    justify-content: space-between;

    button {
      width: 100%;
    }
  }
`;
//#endregion

export default function SurveyResult({
  imgSrc,
  score,
  title,
  description,
  handleClick,
}) {
  const navigate = useNavigate();

  return (
    <div>
      <ResualtSection>
        <ResultImg>
          <img src={imgSrc} alt={imgSrc} />
        </ResultImg>
        <ResualtContent>
          <h2>
            測驗結果：
            <span>
              <AnimatedNumber end={score} />
            </span>
          </h2>
          <h3>{title}</h3>
          <p>{description}</p>
          <ResualtButton>
            <Buttons onClick={() => navigate("/post")} text="撰寫日記" />
            <Buttons onClick={handleClick} text="重新測驗" />
            <Buttons onClick={() => navigate("/history")} text="疼痛日記室" />
            <Buttons onClick={() => navigate("/main")} text="首頁" />
          </ResualtButton>
        </ResualtContent>
      </ResualtSection>
    </div>
  );
}
