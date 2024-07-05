import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import pill from "@/assets/icon/pill.png";
import Buttons from "@/components/Buttons.jsx";
import { getFirebasePosts } from "@/utils/firebase/firebaseService.js";
import { modifiedData } from "@/utils/zustand.js";

//#region
const StorySection = styled.div`
  width: 100%;
  padding: 45px 30px 0 30px;
`;

const EachStory = styled.div`
  height: 400px;
  width: 100%;
  background-color: #b0b0b2;
  color: #555555;
  border-radius: 20px 20px 0 0px;
  box-shadow: 20px -10px 20px 10px rgba(0, 0, 0, 0.2);
  margin-top: -30px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  @media screen and (max-width: 1279px) {
    height: 100%;
  }
`;

const PostIndex = styled.div`
  font-size: 200px;
  line-height: 220px;
  font-weight: bold;
  opacity: 0.6;
  color: #29292d;
  text-shadow: 3px 1px 10px white;
  display: flex;
  margin-left: 30px;

  @media screen and (max-width: 1279px) {
    display: none;
  }
`;

const MainContent = styled.div`
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  h1 {
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 10px;
  }
  h2 {
    margin-bottom: 24px;
  }

  h3 {
    display: flex;
  }

  span {
    background: #666666;
    padding: 4px 12px;
    border-radius: 12px;
    margin-right: 20px;
    color: white;
    margin-bottom: 10px;
    opacity: 0.9;
  }

  pre {
    background: #29292d;
    padding: 4px 12px;
    border-radius: 12px;
    margin-right: 20px;
    color: white;
    margin-bottom: 10px;
    opacity: 0.9;
  }

  p {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 15px;
    margin-top: 24px;
  }

  @media screen and (max-width: 1279px) {
    width: 400px;
    padding: 12px;
    h1 {
      font-size: 18px;
      margin-bottom: 8px;
    }

    h2 {
      margin-bottom: 18px;
    }
    h3 {
      flex-direction: column;
    }

    span {
      font-size: 15px;
      margin-bottom: 6px;
      margin-right: 1px;
      width: 100px;
      text-align: center;
    }

    pre {
      margin-right: 0;
      text-align: center;
      width: 100px;
    }

    button {
      width: 100%;
    }
  }
`;

const Heart = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    font-size: 20px;
    color: black;
    text-shadow: none;
    margin-left: 10px;
  }
  img {
    width: 30px;
  }
  @media screen and (max-width: 1279px) {
    flex-direction: column;
    margin-right: 10px;
    p {
      font-size: 15px;
      margin-left: 0px;
    }
    img {
      width: 20px;
    }
  }
`;

//#endregion

export default function RightHistoryPosts({ setIsLoading }) {
  const navigate = useNavigate();
  const localStorageUserId = window.localStorage.getItem("userId");
  const [stories, setStories] = useState([]);
  const { setSelectedStoryId } = modifiedData();

  useEffect(() => {
    async function fetchStoryData() {
      setIsLoading(true);
      const data = await getFirebasePosts("userId", localStorageUserId);
      if (data.length > 0) {
        const userStoryList = data.map((doc) => ({
          title: doc.title,
          time: doc.time,
          location: doc.location,
          type: doc.type,
          figure: doc.figure,
          story: doc.story,
          userComments: doc.userComments || [],
          likedAuthorId: doc.likedAuthorId,
          storyId: doc.storyId,
        }));
        setStories(userStoryList);
      }
    }
    fetchStoryData();
    setIsLoading(false);
  }, []);

  const modifiedClick = (storyId) => {
    navigate(`/edit/${storyId}`);
    setSelectedStoryId(storyId);
    window.scroll(0, 0);
  };

  const sortTimeOfStory = stories.sort((a, b) => b.time.localeCompare(a.time));
  return (
    <StorySection>
      {sortTimeOfStory &&
        sortTimeOfStory.map((story, index) => {
          return (
            <EachStory key={index}>
              <PostIndex>
                <p>{index + 1}</p>
              </PostIndex>
              <MainContent>
                <h1>疼痛暗號：{story.title}</h1>
                <h2>
                  {story.time}@{story.location.name}
                </h2>

                <h3>
                  {story.type.map((item, index) => (
                    <span key={index}>#{item}</span>
                  ))}
                </h3>
                <h3>
                  {story.figure.map((item, index) => (
                    <pre key={index}>#{item}</pre>
                  ))}
                </h3>
                <p>{story.story}</p>
                <Buttons
                  onClick={() => modifiedClick(story.storyId)}
                  text="完整文章"
                />
              </MainContent>
              <Heart>
                <img src={pill} alt={pill} />
                <p>
                  {story.likedAuthorId?.length > 0
                    ? story.likedAuthorId.length
                    : 0}
                </p>
              </Heart>
            </EachStory>
          );
        })}
    </StorySection>
  );
}
