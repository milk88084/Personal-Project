import { db } from "../../utils/firebase/firebase.jsx";
import {
  collection,
  query,
  getDocs,
  where,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import replyData from "../../utils/data/reply.json";
import { useLoginState } from "../../utils/zustand.js";
import styled from "styled-components";
import pill from "../../assets/icon/pill.png";
import logoImg from "../../assets/img/logoImg.png";
import logoTitle from "../../assets/img/logoTitle.png";
import backgroundImg from "../../assets/img/historyBanner.jpg";
import heartIcon from "../../assets/icon/heart.png";
import submitIcon from "../../assets/icon/paper-plane.png";
// import backgroundImg from "../../assets/img/backgroundImg.jpg";
import { useAuthorfiedData } from "../../utils/zustand.js";

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
  color: white;
  position: relative;
  background-size: cover;
`;

const TopSection = styled.div`
  background-image: url(${backgroundImg});
  width: 100%;
  height: 100vh;
  position: relative;
`;

const TopSectionName = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  margin-left: 100px;
  margin-top: 200px;
  h1 {
    font-size: 120px;
    font-weight: 1000;
    color: white;
    text-shadow: 3px 6px 6px white;
  }

  img {
    width: 140px;
    height: 140px;
  }

  button {
    padding: 6px;
    border-radius: 10px;
    font-weight: 400;
    margin: 24px;
    font-size: 20px;
    background-color: ${(props) => (props.followd ? "#19242b" : "#9ca3af")};
    color: ${(props) => (props.followed ? "white" : "black")};

    &:hover,
    &:focus {
      background-color: #9ca3af;
      color: black;
    }
  }

  @media screen and (max-width: 1279px) {
    margin-left: 30px;
    margin-top: 200px;
    h1 {
      font-size: 44px;
      font-weight: 700;
      text-shadow: 2px 4px 4px white;
    }

    img {
      width: 70px;
      height: 70px;
    }

    button {
      font-size: 10px;
      margin-right: 0px;
      margin-bottom: 0px;
    }
  }
`;

const Title = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 100px;
  height: 300px;
  @media screen and (max-width: 1279px) {
    font-size: 50px;
    height: 150px;
  }
`;

const StorySection = styled.div`
  width: 1280px;
  margin: 0 auto;
  position: relative;
  @media screen and (max-width: 1279px) {
    width: 100%;
  }
`;

const EachStory = styled.div`
  height: 350px;
  background: #8e9eab;
  background: -webkit-linear-gradient(to right, #eef2f3, #8e9eab);
  background: linear-gradient(to right, #eef2f3, #8e9eab);
  color: #555555;
  border-radius: 20px 20px 0 0px;
  box-shadow: 20px -10px 20px 10px rgba(0, 0, 0, 0.2);
  margin-top: -30px;
  display: flex;

  button {
    padding: 6px;
    border-radius: 7px;
    font-weight: 300;
    font-size: 15px;
    background-color: #19242b;
    color: white;
    margin-top: 10px;

    &:hover,
    &:focus {
      background-color: #9ca3af;
      color: black;
    }
  }

  @media screen and (max-width: 1279px) {
    height: 350px;
  }
`;

const PostIndex = styled.div`
  width: 350px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 200px;
  font-weight: bold;
  opacity: 0.6;
  color: #8e9eab;
  text-shadow: 3px 1px 6px white;
  @media screen and (max-width: 1279px) {
    display: none;
  }
`;

const MainContent = styled.div`
  width: 60%;
  padding: 20px;
  p {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 15px;
  }

  h1 {
    font-weight: bold;
    font-size: 20px;
  }

  h3 {
    display: flex;
    color: white;
  }

  span {
    margin-right: 12px;
    margin-bottom: 12px;
    background: #8e9eab;
    padding: 3px;
    border-radius: 8px;
  }
  @media screen and (max-width: 1279px) {
    width: 80%;
    padding: 10px;
    p {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 13px;
      margin-top: 10px;
    }

    span {
      margin-right: 5px;
      background: #8e9eab;
      padding: 3px;
      border-radius: 8px;
      margin-top: 5px;
    }

    h3 {
      font-size: 12px;
      display: flex;
      color: white;
    }
  }
`;

const InterActiveSection = styled.section`
  margin-top: 20px;
  width: 100%;

  img {
    width: 40px;
  }
  h4 {
    padding: 5px;
    border-radius: 7px;
    font-weight: 300;
    font-size: 15px;
    background-color: #19242b;
    color: white;
    width: 120px;
    text-align: center;
  }
  button {
    margin-left: 15px;
    font-size: 20px;
  }

  @media screen and (max-width: 1279px) {
    margin-top: 7px;
    button {
      margin-left: 0px;
      font-size: 13px;
    }
    h4 {
      padding: 5px;
      font-size: 12px;
      width: 90px;
      margin-bottom: 12px;
    }

    select {
      width: 100%;
    }
  }
`;

const LikerAccount = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span {
    font-size: 25px;
    color: black;
    margin-left: 10px;
  }
  img {
    width: 30px;
  }

  button {
    font-size: 20px;
  }
  @media screen and (max-width: 1279px) {
    width: 60px;

    span {
      font-size: 10px;
      margin-left: 5px;
    }
    img {
      width: 20px;
    }

    button {
      font-size: 10px;
    }
  }
`;

const FAB = styled.div`
  width: 100%;
  height: 150px;
  color: black;
  border-radius: 20%;
  display: flex;
  justify-content: space-around;
  align-items: center;

  button {
    padding: 10px;
    border-radius: 7px;
    font-weight: 300;
    font-size: 15px;
    background-color: #19242b;
    color: white;
    margin-top: 10px;

    &:hover,
    &:focus {
      background-color: #9ca3af;
      color: black;
    }
  }

  div {
    display: flex;
  }

  img {
    width: 50px;
    height: 50px;
  }

  img:nth-of-type(2) {
    width: 120px;
  }

  @media screen and (max-width: 1279px) {
    button {
      padding: 7px;
      border-radius: 5px;
      font-size: 12px;
    }

    img {
      width: 40px;
      height: 40px;
    }

    img:nth-of-type(2) {
      width: 100px;
    }
  }
`;

//#endregion

const VisitAuthor = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [author, setAuthor] = useState([]);
  const { closeModal } = useLoginState();
  const localStorageUserId = window.localStorage.getItem("userId");
  const { setSelectedStoryId } = useAuthorfiedData();

  // console.log("這裡是這個作者的歷史文章", state.data);
  // console.log("現在登入的人是：" + localStorageUserId);

  //從firestore讀取posts資料
  useEffect(() => {
    async function getStories() {
      try {
        const postsData = collection(db, "posts");
        const q = query(postsData, where("userId", "==", state.data));

        //原本獲取所有的data資料
        const querySnapshot = await getDocs(q);
        const userStoryList = querySnapshot.docs.map((doc) => ({
          title: doc.data().title,
          time: doc.data().time,
          location: doc.data().location,
          type: doc.data().type,
          figure: doc.data().figure,
          story: doc.data().story,
          userId: doc.data().userId,
          likedAuthorId: doc.data().likedAuthorId,
          storyId: doc.data().storyId,
          userComments: doc.data().userComments,
        }));
        setStories(userStoryList);
      } catch (e) {
        console.log(e);
      }
    }
    getStories();
  }, []);

  //從firebase讀取users資料
  useEffect(() => {
    async function getAuthor() {
      try {
        const authorData = collection(db, "users");
        const q = query(authorData, where("id", "==", state.data));
        const querySnapshot = await getDocs(q);
        const authorList = querySnapshot.docs.map((doc) => ({
          id: doc.data().id,
          name: doc.data().name,
        }));
        setAuthor(authorList);
      } catch (e) {
        console.log(e);
      }
    }
    getAuthor();
  }, [db]);

  //判斷story是否為該作者的內容
  const isUserStories = stories.every(
    (story) => story.userId === localStorageUserId
  );

  //按讚功能
  const handleLike = async (id) => {
    const item = localStorageUserId;
    try {
      const q = query(collection(db, "posts"), where("storyId", "==", id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref; //ref是指向位置
        const docData = querySnapshot.docs[0].data(); //data()是實際的data內容

        // 兩者皆為true表示使用者已經按過讚
        if (docData.likedAuthorId && docData.likedAuthorId.includes(item)) {
          alert("已按過讚");
          return;
        }
        await updateDoc(docRef, {
          likedAuthorId: arrayUnion(item),
        });
        console.log("按讚成功");

        // 更新state
        setStories((prev) =>
          prev.map((story) => {
            if (story.storyId === id) {
              const updatedStory = {
                ...story,
                likedAuthorId: docData.likedAuthorId
                  ? [...docData.likedAuthorId, item]
                  : [item],
              };
              return updatedStory;
            }
            return story;
          })
        );
      }
    } catch (error) {
      console.error("操作失败: ", error);
    }
  };

  //提交回覆的內容
  const handleSubmit = async function (event, id) {
    event.preventDefault();
    const commentContent = event.target.replySelect.value;
    const localStorageUserId = window.localStorage.getItem("userId");
    const replyArray = { id: localStorageUserId, comment: commentContent };

    try {
      const q = query(collection(db, "posts"), where("storyId", "==", id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref; //ref是指向位置
        const docData = querySnapshot.docs[0].data(); //data()是實際的data內容

        // 兩者皆為true表示使用者已經留言過
        if (
          docData.userComments &&
          docData.userComments.some(
            (auhtorId) => auhtorId.id === localStorageUserId
          )
        ) {
          alert("已給過評論");
          return;
        }
        await updateDoc(docRef, {
          userComments: arrayUnion(replyArray),
        });

        // 更新state
        setStories((prev) =>
          prev.map((story) => {
            if (story.storyId === id) {
              const updatedStory = {
                ...story,
                userComments: docData.userComments
                  ? [...docData.userComments, replyArray]
                  : [replyArray],
              };
              return updatedStory;
            }
            return story;
          })
        );

        console.log("評論成功");
      }
    } catch (error) {
      console.error("操作失败: ", error);
    }
  };

  //回到首頁
  const handleBack = () => {
    navigate("/");
    closeModal();
  };

  //到完整文章
  const modifiedClick = (storyId) => {
    navigate(`/authorpost/${storyId}`);
    setSelectedStoryId(storyId);
    window.scroll(0, 0);
  };

  console.log(stories);

  const [isFollow, setIsFollow] = useState(false);

  //檢查是否有關注
  useEffect(() => {
    async function commfirmFollow() {
      try {
        const q = query(
          collection(db, "users"),
          where("id", "==", localStorageUserId)
        );
        const querySnapshot = await getDocs(q);
        const docData = querySnapshot.docs[0].data().followAuthor;
        if (docData.includes(state.data)) {
          setIsFollow(false);
        } else {
          setIsFollow(true);
        }
      } catch (e) {
        console.log(e);
      }
    }
    commfirmFollow();
  }, []);

  console.log(isFollow);

  //關注作者
  const handleFollow = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("id", "==", localStorageUserId)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        const docData = querySnapshot.docs[0].data();

        if (docData.followAuthor && docData.followAuthor.includes(state.data)) {
          alert("已關注");
          setIsFollow(false);
          return;
        }
        await updateDoc(docRef, {
          followAuthor: arrayUnion(state.data),
        });
        console.log("關注成功");
        setIsFollow(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Background>
        <TopSection>
          {isUserStories ? (
            <p>這是你自己的頁面</p>
          ) : (
            <div>
              <TopSectionName>
                <img src={logoImg} alt={logoImg} />
                <h1>{author[0]?.name}</h1>
                {isFollow ? (
                  <button onClick={handleFollow}>關注作者</button>
                ) : (
                  <button followed={false} disabled>
                    已關注作者
                  </button>
                )}
              </TopSectionName>
            </div>
          )}
        </TopSection>
        <Title>歷史文章</Title>
        <StorySection>
          {stories &&
            stories.map((story, index) => {
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
                        <span key={index}>#{item}</span>
                      ))}
                    </h3>
                    <h3>
                      {story.figure.map((item, index) => (
                        <span key={index}>{item}</span>
                      ))}
                    </h3>
                    <p>{story.story}</p>

                    {!isUserStories ? (
                      <>
                        <InterActiveSection>
                          <h4>給作者一句話</h4>
                          <form
                            onSubmit={(event) =>
                              handleSubmit(event, story.storyId)
                            }
                          >
                            <select name="replySelect">
                              {replyData.map((item, index) => {
                                return (
                                  <option key={index} value={item}>
                                    {item}
                                  </option>
                                );
                              })}
                            </select>
                            <button type="submit">送出</button>
                          </form>
                        </InterActiveSection>
                      </>
                    ) : (
                      ""
                    )}
                  </MainContent>

                  <LikerAccount>
                    <img src={pill} alt={pill} />
                    <span>
                      按讚數：
                      {story.likedAuthorId?.length > 0
                        ? story.likedAuthorId.length
                        : 0}
                    </span>

                    <span>
                      留言數：
                      {story.userComments?.length > 0
                        ? story.userComments.length
                        : 0}
                    </span>

                    {!isUserStories ? (
                      <button onClick={() => handleLike(story.storyId)}>
                        按讚
                      </button>
                    ) : (
                      ""
                    )}
                    <button onClick={() => modifiedClick(story.storyId)}>
                      完整文章
                    </button>
                  </LikerAccount>
                </EachStory>
              );
            })}
        </StorySection>
        <FAB>
          <button onClick={handleBack}>回首頁</button>
        </FAB>
      </Background>
    </>
  );
};

export default VisitAuthor;
