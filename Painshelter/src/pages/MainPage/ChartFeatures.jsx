import styled from "styled-components";
import Chart from "@/components/Chart/TypeChart.jsx";
import FigureChart from "@/components/Chart/FigureChart.jsx";
import AnimatedNumber from "@/components/AnimatedNumber.jsx";
import { useState, useEffect } from "react";
import { getAllFirebasePosts } from "@/utils/firebase/firebaseService";

//#region
const ChartFeatureWrapper = styled.div`
  height: 100vh;
  p {
    color: white;
    font-size: 80px;
    font-weight: 600;
    margin-left: 50px;
    font-style: oblique;
    margin-top: 50px;
  }

  @media screen and (max-width: 1279px) {
    height: 100%;
    width: 100%;
    p {
      width: 100%;
      font-size: 60px;
      padding-bottom: 5px;
      font-weight: 500;
      margin-left: 0px;
      text-align: center;
      margin-top: 50px;
    }
  }
`;

const ChartSection = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  margin-top: 30px;
  @media screen and (max-width: 1279px) {
    flex-direction: column;
    justify-content: center;
  }
`;

const TypesChartsSection = styled.div`
  color: white;
  h1 {
    font-size: 40px;
    text-align: center;
  }
  @media screen and (max-width: 1279px) {
    margin-left: -30px;
    h1 {
      font-size: 30px;
      opacity: 0.7;
    }
  }
`;

const PostsCounts = styled.div`
  font-size: 40px;
  color: white;
  text-align: center;

  span {
    font-size: 180px;
    font-weight: 700;
  }
  @media screen and (max-width: 1279px) {
    margin-top: 30px;

    span {
      font-size: 160px;
      font-weight: 700;
    }
  }
`;

const FigureChartSection = styled.div`
  color: white;
  h1 {
    font-size: 40px;
    text-align: center;
  }
  @media screen and (max-width: 1279px) {
    margin-left: -30px;
    h1 {
      font-size: 30px;
      opacity: 0.7;
    }
  }
`;
//#endregion

export default function ChartFeatures({ chart }) {
  const [stories, setStories] = useState([]);
  useEffect(() => {
    async function fetchStoryData() {
      const data = await getAllFirebasePosts();
      if (data.length > 0) {
        const userStoryList = data.map((doc) => ({
          title: doc.title,
        }));
        setStories(userStoryList);
      }
    }
    fetchStoryData();
  }, []);
  return (
    <ChartFeatureWrapper>
      <p ref={chart}>疼痛光譜</p>
      <ChartSection>
        <TypesChartsSection>
          <Chart />
          <h1>故事類型</h1>
        </TypesChartsSection>
        <PostsCounts>
          <h1>文章累積數量</h1>
          <span>
            <AnimatedNumber end={stories.length} />
          </span>
        </PostsCounts>
        <FigureChartSection>
          <FigureChart />
          <h1>故事關係人</h1>
        </FigureChartSection>
      </ChartSection>
    </ChartFeatureWrapper>
  );
}
