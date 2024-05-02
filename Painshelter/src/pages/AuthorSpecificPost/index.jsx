import styled from "styled-components";
import { useEffect, useState } from "react";
import { useLoginState } from "../../utils/zustand.js";
import { useEditFormInput } from "../../utils/hooks/useEditFormInput.jsx";
import { useEditCheckboxInput } from "../../utils/hooks/useEditCheckboxInput.jsx";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { db } from "../../utils/firebase/firebase.jsx";
import pill from "../../assets/icon/pill.png";
import {
  collection,
  query,
  getDocs,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

const storyTypeData = [
  "成長軌跡",
  "情感關係",
  "人際交流",
  "生命經歷",
  "職場發展",
];
const storyFigureData = [
  "親人",
  "伴侶",
  "朋友",
  "關係人",
  "陌生人",
  "那個他",
  "內在自我",
];

//#region
const Background = styled.div`
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
  background: linear-gradient(75deg, #e3ffe7 0%, #d9e7ff 100%);
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
  color: #838383;
  font-size: 20px;
  display: flex;
  p {
    margin-right: 20px;
  }
  @media screen and (max-width: 1279px) {
    font-size: 15px;
    display: block;
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
  margin-top: 50px;

  button {
    padding: 10px;
    border-radius: 10px;
    font-weight: 300;
    font-size: 20px;
    background-color: #19242b;
    color: white;
    margin-right: 30px;

    &:hover,
    &:focus {
      background-color: #9ca3af;
      color: black;
    }
  }
  @media screen and (max-width: 1279px) {
    margin-top: 25px;
    display: block;
    justify-content: space-between;
    width: 100%;

    button {
      font-weight: 300;
      font-size: 15px;
      margin-right: 0px;
      width: 100%;
      margin: 10px;
    }
  }
`;

const CommentsSection = styled.div`
  margin-top: 30px;
  font-size: 20px;
  width: 100%;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
  @media screen and (max-width: 1279px) {
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
    margin-left: 5px;
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
  padding: 5px;
  @media screen and (max-width: 1279px) {
    width: 40px;
    height: 40px;
    padding: 2px;
  }
`;

const Reply = styled.div`
  display: flex;
  border-radius: 20px;
  background-color: rgb(255, 255, 255, 0.6);
  margin-bottom: 30px;
  @media screen and (max-width: 1279px) {
    border-radius: 15px;
  }
`;
//#endregion

export default function Edit() {
  const params = useParams();
  const navigate = useNavigate();
  const postStory = useEditFormInput();
  const storyTitle = useEditFormInput();
  const storyTime = useEditFormInput();
  const storyType = useEditCheckboxInput(storyTypeData);
  const storyFigure = useEditCheckboxInput(storyFigureData);
  const [locationName, setLocationName] = useState();
  const [comments, setComments] = useState();
  const location = useLocation();

  //回到網頁最上方
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  //取得db資料
  useEffect(() => {
    async function getStories() {
      try {
        const postsData = collection(db, "posts");
        const q = query(postsData, where("storyId", "==", params.id));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data(); // 直接取得数据
          storyTitle.setValue(data.title);
          postStory.setValue(data.story);
          storyTime.setValue(data.time);
          storyType.setCheckedValues(data.type);
          storyFigure.setCheckedValues(data.figure);
          setLocationName(data.location.name);
          const commentsWithNames = await Promise.all(
            data.userComments.map(async (comment) => {
              const userRef = doc(db, "users", comment.id);
              const userSnap = await getDoc(userRef);
              return userSnap.exists()
                ? { comment: comment.comment, name: userSnap.data().name }
                : comment;
            })
          );
          setComments(commentsWithNames);
        } else {
          console.log("No document found with the given storyId");
        }
      } catch (e) {
        console.error("Error fetching document: ", e);
      }
    }
    getStories();
  }, [db, params.id]);

  return (
    <Background>
      <>
        <Title ref={top}>文章預覽</Title>
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
                    <>
                      <Reply>
                        <AvatarPart>
                          <img src={pill} alt={pill} />
                        </AvatarPart>
                        <CommentPart key={index}>
                          <h2>{data.name}</h2>
                          <p>#{data.comment}</p>
                        </CommentPart>
                      </Reply>
                    </>
                  ))
                : null}
            </CommentsSection>
          </EditTextArea>
          <ButtonSection>
            <button onClick={() => navigate("/")}>回首頁</button>
          </ButtonSection>
        </EditSections>
      </>
    </Background>
  );
}
