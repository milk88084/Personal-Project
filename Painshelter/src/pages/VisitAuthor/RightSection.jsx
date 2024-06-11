import styled from "styled-components";
import Buttons from "@/components/Buttons.jsx";
import replyData from "@/utils/data/reply.json";
import { ToastContainer } from "react-toastify";
import { useAuthorfiedData } from "@/utils/zustand.js";
import { useState, useEffect } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getSnapshotPostsData,
  submitComment,
  submitLike,
} from "@/utils/firebase/firebaseService.js";

//#region
const RightSectionWrapper = styled.div`
  width: calc(100vw - 330px);
  position: absolute;
  right: 0;
  background: #29292d;
  background-size: 400% 400%;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 1279px) {
    width: 100%;
    margin-top: 30px;
    position: relative;
  }
`;

const StorySection = styled.div`
  width: 100%;
  padding: 45px 30px 0 30px;
  margin-top: 20px;
  @media screen and (max-width: 1279px) {
    margin-top: 30px;
  }
`;

const EachStory = styled.div`
  height: 450px;
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
    height: 600px;
    flex-direction: column;
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
  padding: 20px;
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
    padding: 15px;
    h1 {
      font-size: 18px;
      margin-bottom: 8px;
    }

    h2 {
      margin-bottom: 18px;
    }

    span {
      margin-bottom: 7px;
    }
  }
`;

const Type_relationship = styled.span`
  background: #666666;
  padding: 4px 12px;
  border-radius: 12px;
  margin-right: 20px;
  color: white;
  margin-bottom: 10px;
  opacity: 0.9;
`;

const Type_figure = styled.span`
  background: #29292d;
  padding: 4px 12px;
  border-radius: 12px;
  margin-right: 20px;
  color: white;
  margin-bottom: 10px;
  opacity: 0.9;
`;

const InterActiveSection = styled.section`
  margin-top: 30px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  form {
    display: flex;
    justify-content: start;
    align-items: center;
  }

  select {
    width: 250px;
    border-radius: 12px;
    padding: 8px 24px;
    margin-right: 20px;
  }

  @media screen and (max-width: 1279px) {
    form {
      flex-direction: column;
      justify-content: center;
    }
    select {
      width: 100%;
      margin-right: 0px;
      margin-bottom: 10px;
    }
    button {
      margin: 8px 0px;
      margin-right: 0px;
    }
  }
`;

const LikerAccount = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  div:nth-child(1) {
    &:hover {
      transform: scale(1.2);
      color: white;
      cursor: pointer;
    }

    &:active {
      transform: scale(0.9);
    }
  }

  @media screen and (max-width: 1279px) {
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    margin-bottom: 70px;
  }
`;
//#endregion

export default function RightSection() {
  const { state } = useLocation();
  const [stories, setStories] = useState([]);
  const localStorageUserId = window.localStorage.getItem("userId");
  const navigate = useNavigate();
  const { setSelectedStoryId } = useAuthorfiedData();

  useEffect(() => {
    let unsubscribe;
    if (localStorageUserId) {
      unsubscribe = getSnapshotPostsData(state.data, setStories);
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [localStorageUserId, state.data]);

  const sortTimeOfStory = stories.sort((a, b) => b.time.localeCompare(a.time));

  const isUserStories = stories.every(
    (story) => story.userId === localStorageUserId
  );
  const handleSubmitComment = async (event, id) => {
    event.preventDefault();
    const form = event.target;
    const select = form.querySelector('select[name="replySelect"]');
    if (!select.value) {
      alert("請選擇一個留言");
      return;
    }
    await submitComment(event, id, setStories);
  };

  const modifiedClick = (storyId) => {
    navigate(`/authorpost/${storyId}`);
    setSelectedStoryId(storyId);
    window.scroll(0, 0);
  };

  const handleLike = async (id) => {
    await submitLike(id, localStorageUserId, setStories);
  };

  return (
    <RightSectionWrapper>
      <StorySection>
        {sortTimeOfStory &&
          sortTimeOfStory.map((story, index) => {
            return (
              <EachStory key={index} id={stories.storyId}>
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
                      <Type_relationship key={index}>#{item}</Type_relationship>
                    ))}
                  </h3>
                  <h3>
                    {story.figure.map((item, index) => (
                      <Type_figure key={index}>#{item}</Type_figure>
                    ))}
                  </h3>
                  <p>{story.story}</p>

                  {!isUserStories ? (
                    <>
                      <InterActiveSection>
                        <form
                          onSubmit={(event) =>
                            handleSubmitComment(event, story.storyId)
                          }
                        >
                          <select name="replySelect" defaultValue="">
                            <option value="" disabled hidden>
                              給作者一句話...
                            </option>
                            {replyData.map((item, index) => {
                              return (
                                <option key={index} value={item}>
                                  {item}
                                </option>
                              );
                            })}
                          </select>

                          <Buttons type="submit" text="送出" />
                          <Buttons
                            onClick={() => modifiedClick(story.storyId)}
                            text="完整文章"
                            type="button"
                          />
                        </form>
                      </InterActiveSection>
                    </>
                  ) : null}
                </MainContent>

                <LikerAccount>
                  <div>
                    <Heart onClick={() => handleLike(story.storyId)} />
                    <span>
                      {story.likedAuthorId?.length > 0
                        ? story.likedAuthorId.length
                        : 0}
                    </span>
                  </div>
                  <div>
                    <MessageCircle />
                    <span>
                      {story.userComments?.length > 0
                        ? story.userComments.length
                        : 0}
                    </span>
                  </div>
                </LikerAccount>
              </EachStory>
            );
          })}
      </StorySection>
      <ToastContainer />
    </RightSectionWrapper>
  );
}
