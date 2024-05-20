import styled from "styled-components";
import Buttons from "../../components/Buttons.jsx";
import defaultImg from "../../assets/img/defaultImg.png";
import stortTypeData from "@/utils/data/storyTypeData.json";
import IsLoadingPage from "@/components/IsLoadingPage.jsx";
import storyFigureData from "@/utils/data/storyFigureData.json";
import { useAuthCheck } from "@/utils/hooks/useAuthCheck.jsx";
import { useEditFormInput } from "../../utils/hooks/useEditFormInput.jsx";
import { useEffect, useState } from "react";
import { useEditCheckboxInput } from "../../utils/hooks/useEditCheckboxInput.jsx";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getFirebaseSpacificPost } from "@/utils/firebase/firebaseService.js";

//#region
const Background = styled.div`
  font-family: "Noto Sans TC", sans-serif;
  background: linear-gradient(
    90deg,
    rgba(0, 2, 0, 1) 0%,
    rgba(2, 3, 1, 1) 15%,
    rgba(9, 14, 8, 1) 34%,
    rgba(16, 23, 15, 1) 51%,
    rgba(23, 30, 22, 1) 69%,
    rgba(26, 33, 25, 1) 83%,
    rgba(38, 45, 37, 1) 100%
  );
  width: 100%;
  height: 100%;
  position: relative;
`;

const Title = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 80px;
  height: 150px;
  font-weight: 600;
  color: #fffde0;
  @media screen and (max-width: 1279px) {
    font-size: 50px;
    height: 150px;
  }
`;

const EditSections = styled.div`
  background: linear-gradient(60deg, #aeb4c0 0%, #d9e7ff 100%);
  width: 1000px;
  height: 100%;
  margin: 0 auto;
  border-radius: 50px 50px 0px 0px;
  padding: 50px;
  @media screen and (max-width: 1279px) {
    width: 80%;
    padding: 30px;
  }
`;

const EditCategories = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  color: #353535;
  @media screen and (max-width: 1279px) {
    display: block;
  }
`;

const EditTitle = styled.div`
  font-size: 30px;
  font-weight: 600;
  margin-right: 50px;
  color: #353535;
  @media screen and (max-width: 1279px) {
    margin-right: 0px;
    font-size: 25px;
  }
`;

const EditTitleInput = styled.div`
  border: 2px solid black;
  input {
    width: 400px;
    color: black;
  }
  @media screen and (max-width: 1279px) {
    border: 1px solid black;
    input {
      width: 100%;
    }
  }
`;

const PreviewTitle = styled.div`
  width: 400px;
  color: #838383;
  font-size: 20px;
  @media screen and (max-width: 1279px) {
    width: 100%;
    font-size: 15px;
  }
`;

const EditDateInput = styled.div`
  border: 2px solid black;
  input {
    width: 400px;
    color: black;
  }
  @media screen and (max-width: 1279px) {
    border: 1px solid black;
    input {
      width: 100%;
    }
  }
`;

const EditTypesInput = styled.div`
  font-size: 20px;
  ul {
    display: flex;
  }

  li {
    margin-right: 30px;
  }
  @media screen and (max-width: 1279px) {
    font-size: 15px;
    ul {
      display: block;
    }

    li {
      margin-right: 0px;
      padding: 5px;
    }
  }
`;

const PreviewType = styled.div`
  font-size: 20px;
  display: flex;
  p {
    background: #8e9eab;
    padding: 4px 12px;
    border-radius: 12px;
    margin-right: 20px;
    color: white;
  }
  @media screen and (max-width: 1279px) {
    margin-top: 20px;
    font-size: 15px;
  }
`;

const EditTextArea = styled.div`
  margin-top: 50px;
  p {
    font-size: 30px;
    font-weight: 600;
    margin-right: 50px;
  }

  textarea {
    border: 2px solid black;
    width: 100%;
    height: 300px;
    margin-top: 50px;
    color: black;
  }
  @media screen and (max-width: 1279px) {
    margin-top: 30px;
    p {
      font-size: 25px;
      margin-right: 0px;
    }

    textarea {
      border: 1px solid black;
      height: 300px;
      margin-top: 25px;
    }
  }
`;

const PreviewTextArea = styled.div`
  margin-top: 20px;
  color: #838383;
  white-space: pre-wrap;
  p {
    font-size: 30px;
    font-weight: 600;
    margin-right: 30px;
  }

  textarea {
    border: 2px solid black;
    width: 100%;
    height: 300px;
    margin-top: 30px;
    color: black;
  }
`;

const ButtonSection = styled.div`
  margin-top: 20px;
  display: flex;

  @media screen and (max-width: 1279px) {
    justify-content: space-between;
    width: 100%;
  }
`;

const CommentsSection = styled.div`
  margin-top: 30px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Reply = styled.div`
  display: flex;
  border-radius: 20px;
  height: 100px;
  background-color: rgb(255, 255, 255, 0.6);
  margin-bottom: 30px;
  align-items: center;
  padding: 8px 24px;
  cursor: pointer;

  &:hover {
    background: #1d1d1d;
    color: white;
  }
  &:active {
    box-shadow: 2px 2px 5px #666666;
    transform: scale(0.9);
  }
  @media screen and (max-width: 1279px) {
    border-radius: 15px;
  }
`;

const CommentPart = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin-left: 10px;
  p {
    padding: 10px;
    font-size: 15px;
    border-radius: 10px;
    color: gray;
  }

  h2 {
    margin-left: 15px;
    font-weight: 600;
  }
  @media screen and (max-width: 1279px) {
    margin-left: 20px;
    p {
      padding: 0px;
      font-size: 12px;
    }

    h2 {
      margin-left: 0px;
      font-weight: 600;
    }
  }
`;

const AvatarPart = styled.div`
  width: 60px;
  height: 60px;
  img {
    border-radius: 50px;
  }

  @media screen and (max-width: 1279px) {
    width: 40px;
    height: 40px;
  }
`;
//#endregion

export default function Edit() {
  useAuthCheck();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const postStory = useEditFormInput();
  const storyTitle = useEditFormInput();
  const storyTime = useEditFormInput();
  const storyType = useEditCheckboxInput(stortTypeData);
  const storyFigure = useEditCheckboxInput(storyFigureData);
  const [comments, setComments] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [locationName, setLocationName] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getFirebaseSpacificPost("storyId", params.id);
      if (data) {
        storyTitle.setValue(data.title);
        postStory.setValue(data.story);
        storyTime.setValue(data.time);
        storyType.setCheckedValues(data.type);
        storyFigure.setCheckedValues(data.figure);
        setLocationName(data.location.name);
        setComments(data.commentsWithNames);
      }
      setIsLoading(false);
    }

    fetchData();
  }, [params.id]);

  const handleClikcToCommentAuthor = (id) => {
    navigate("/visit", { state: { data: id } });
  };

  return (
    <Background>
      {isLoading ? (
        <IsLoadingPage />
      ) : (
        <>
          <Title>文章預覽</Title>
          <EditSections>
            <EditCategories>
              <EditTitle>疼痛暗號</EditTitle>
              <PreviewTitle>{storyTitle.value}</PreviewTitle>
            </EditCategories>
            <EditCategories>
              <EditTitle>故事時間</EditTitle>
              <PreviewTitle>{storyTime.value}</PreviewTitle>
            </EditCategories>
            <EditCategories>
              <EditTitle>發生地點</EditTitle>
              <PreviewTitle>{locationName}</PreviewTitle>
            </EditCategories>
            <EditCategories>
              <EditTitle>故事類型</EditTitle>
              <PreviewType>
                {storyType?.checkedValues.map((item, index) => (
                  <p key={index}>#{item}</p>
                ))}
              </PreviewType>
            </EditCategories>
            <EditCategories>
              <EditTitle>故事對象</EditTitle>
              <PreviewType>
                {storyFigure?.checkedValues.map((item, index) => (
                  <p key={index}>#{item}</p>
                ))}
              </PreviewType>
            </EditCategories>
            <EditTextArea>
              <p>故事內容</p>
              <PreviewTextArea>{postStory.value}</PreviewTextArea>
            </EditTextArea>
            <EditTextArea>
              <p>故事留言</p>
              <CommentsSection>
                {comments && comments.length > 0
                  ? comments.map((data, index) => (
                      <Reply
                        key={index}
                        onClick={() => handleClikcToCommentAuthor(data.id)}
                      >
                        <AvatarPart>
                          {data.img ? (
                            <img src={data.img} alt="profileImg" />
                          ) : (
                            <img src={defaultImg} alt="profileImg" />
                          )}
                        </AvatarPart>
                        <CommentPart key={index}>
                          <h2>{data.name}</h2>
                          <p>#{data.comment}</p>
                        </CommentPart>
                      </Reply>
                    ))
                  : null}
              </CommentsSection>
            </EditTextArea>
            <ButtonSection>
              <Buttons onClick={() => navigate(-1)} text="返回" />
              <Buttons onClick={() => navigate("/main")} text="首頁" />
              <Buttons onClick={() => navigate("/history")} text="疼痛日記室" />
            </ButtonSection>
          </EditSections>
        </>
      )}
    </Background>
  );
}
