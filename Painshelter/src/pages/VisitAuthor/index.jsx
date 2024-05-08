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
import styled, { keyframes } from "styled-components";
import pill from "../../assets/icon/pill.png";
import logoImg from "../../assets/img/logoImg.png";
import logoTitle from "../../assets/img/logoTitle.png";
import backgroundImg from "../../assets/img/historyBanner.jpg";
import heartIcon from "../../assets/icon/heart.png";
import submitIcon from "../../assets/icon/paper-plane.png";
// import backgroundImg from "../../assets/img/backgroundImg.jpg";
import { useAuthorfiedData } from "../../utils/zustand.js";
import IsLoadingPage from "@/components/IsLoadingPage.jsx";
import { AlignJustify } from "lucide-react";
//#region
const flowAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Background = styled.div`
  color: white;
  position: relative;
  font-family: "Noto Sans TC", sans-serif;
  height: 100%;
`;

const TopSection = styled.div`
  display: none;
  @media screen and (max-width: 1279px) {
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    height: 40px;
    z-index: 200;
    width: 100%;
    background-color: #353535;
  }
`;
const ShowLeftSection = styled.div``;
const LeftSection = styled.div`
  background-image: url(${(props) => props.backgroundImg});
  width: 330px;
  height: 100%;
  position: fixed;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  @media screen and (max-width: 1279px) {
    z-index: 30;
    display: none;
  }
`;

const LeftSectionMobile = styled.div`
  display: none;
  @media screen and (max-width: 1279px) {
    z-index: 300;
    background-image: url(${(props) => props.backgroundImg});
    width: 330px;
    height: 100%;
    position: fixed;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
`;

const LeftNameSection = styled.div`
  font-size: 50px;
  font-weight: bolder;
  display: flex;
  justify-content: center;
  flex-direction: column;

  span {
    width: 80px;
    font-size: 15px;
    padding: 7px;
    font-weight: 300;
    background-color: #9ca3af;
    color: black;
    border-radius: 15px;
    text-align: center;
  }
  @media screen and (max-width: 1279px) {
    font-size: 40px;
    padding: 20px;
    margin-top: 30px;
  }
`;

const CloseButton = styled.div`
  @media screen and (max-width: 1279px) {
    font-size: 30px;
    position: absolute;
    right: 0;
    top: 0;
    margin-right: 20px;
  }
`;

const LeftButtonSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  button {
    font-size: 25px;
    margin: 7px;
    opacity: 0.3;
    text-shadow: 1px 1px 20px white;
  }

  button:nth-child(1) {
    opacity: 0.6;
  }

  button:hover {
    font-size: 32px;
    margin: 8px;
    opacity: 1;
    font-weight: 600;
  }

  @media screen and (max-width: 1279px) {
    padding: 20px;
    button {
      font-size: 25px;
      margin: 0px;
      opacity: 0.3;
    }

    button:hover {
      font-size: 20px;
      margin: 4px;
    }
  }
`;

const RightSection = styled.div`
  width: calc(100vw - 330px);
  position: absolute;
  right: 0;
  background: linear-gradient(45deg, #464646 34%, #546377 51%, #060708 69%);
  background-size: 400% 400%;
  animation: ${flowAnimation} 10s ease infinite;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media screen and (max-width: 1279px) {
    width: 100%;
    margin-top: 30px;
    position: relative;
  }
`;

//
const IsFollowed = styled.div`
  button {
    padding: 8px;
    border-radius: 10px;
    font-weight: 400;
    font-size: 20px;
    background-color: #19242b;
    color: white;

    &:hover,
    &:focus {
      background-color: #9ca3af;
      color: black;
    }
  }

  @media screen and (max-width: 1279px) {
    button {
      font-size: 10px;
      margin-right: 0px;
      margin-bottom: 0px;
    }
  }
`;

const IsFollowAuthor = styled.div`
  span {
    padding: 6px;
    border-radius: 10px;
    font-weight: 400;
    font-size: 20px;
    background-color: #ffffff;
    color: #19242b;
  }

  @media screen and (max-width: 1279px) {
    span {
      font-size: 10px;
      margin-right: 0px;
      margin-bottom: 0px;
    }
  }
`;

const StorySection = styled.div`
  width: 90%;
  margin: 0 auto;
  position: relative;
  margin-top: 100px;
  @media screen and (max-width: 1279px) {
    margin-top: 60px;
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
  width: 230px;
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

const Owned = styled.div`
  position: absolute;
  font-size: 100px;
  font-weight: 1000;
  color: white;
  text-shadow: 3px 6px 4px white;
  top: 120px;

  button {
    padding: 6px;
    border-radius: 10px;
    font-weight: 400;
    margin: 24px;
    font-size: 20px;
    background-color: #19242b;
    color: white;

    &:hover,
    &:focus {
      background-color: #9ca3af;
      color: black;
    }
  }
  @media screen and (max-width: 1279px) {
    font-size: 45px;

    button {
      padding: 6px;
      border-radius: 10px;
      font-weight: 400;
      margin: 15px;
      font-size: 10px;
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // console.log("這裡是這個作者的歷史文章", state.data);
  console.log("現在登入的人是：" + localStorageUserId);

  //從firestore讀取posts資料
  useEffect(() => {
    async function getStories() {
      try {
        setIsLoggedIn(true);
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
        setIsLoggedIn(false);
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
    navigate("/main");
    closeModal();
  };

  //到完整文章
  const modifiedClick = (storyId) => {
    navigate(`/authorpost/${storyId}`);
    setSelectedStoryId(storyId);
    window.scroll(0, 0);
  };

  // console.log(stories);

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
          setIsFollow(true);
        } else {
          setIsFollow(false);
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

  //將文章按照時間順序排序
  const sortTimeOfStory = stories.sort((a, b) => b.time.localeCompare(a.time));
  // console.log(stories);

  const [isMobileSize, setIsMobileSize] = useState(false);

  return (
    <>
      {isLoggedIn ? (
        <IsLoadingPage />
      ) : (
        <Background>
          <TopSection>
            <AlignJustify onClick={() => setIsMobileSize(true)} />
          </TopSection>
          {isMobileSize ? (
            <ShowLeftSection>
              <LeftSectionMobile backgroundImg={backgroundImg}>
                <CloseButton>
                  <button onClick={() => setIsMobileSize(false)}>x</button>
                </CloseButton>

                <LeftNameSection>
                  {isUserStories ? (
                    <>
                      <h1>{`${author[0]?.name}`}</h1>
                      <span>作者本人</span>
                    </>
                  ) : (
                    <>
                      <h1>{`${author[0]?.name}'s`}</h1>
                      <h1>歷史文章</h1>
                      {!isFollow ? (
                        <IsFollowed>
                          <button onClick={handleFollow}>關注作者</button>
                        </IsFollowed>
                      ) : (
                        <IsFollowAuthor>
                          <span disabled>已關注作者</span>
                        </IsFollowAuthor>
                      )}
                    </>
                  )}
                  <h1>{name && name[0]?.name}</h1>
                </LeftNameSection>
                <LeftButtonSection>
                  {/* <button onClick={handlePost}>撰寫文章</button>
                   */}

                  <button onClick={() => navigate("/main")}>返回首頁</button>
                  <button onClick={() => navigate(-1)}>返回</button>
                </LeftButtonSection>

                <FAB>
                  <div>
                    <img src={logoImg} alt={logoImg} />
                    <img src={logoTitle} alt={logoTitle}></img>
                  </div>
                </FAB>
              </LeftSectionMobile>
            </ShowLeftSection>
          ) : null}
          <LeftSection backgroundImg={backgroundImg}>
            <LeftNameSection>
              {isUserStories ? (
                <>
                  <h1>{`${author[0]?.name}`}</h1>
                  <span>作者本人</span>
                </>
              ) : (
                <>
                  <h1>{`${author[0]?.name}'s`}</h1>
                  <h1>歷史文章</h1>
                  {!isFollow ? (
                    <IsFollowed>
                      <button onClick={handleFollow}>關注作者</button>
                    </IsFollowed>
                  ) : (
                    <IsFollowAuthor>
                      <span disabled>已關注作者</span>
                    </IsFollowAuthor>
                  )}
                </>
              )}
            </LeftNameSection>
            <LeftButtonSection>
              <button onClick={() => navigate("/history")}>撰寫文章</button>
              <button onClick={() => navigate("/main")}>返回首頁</button>
            </LeftButtonSection>

            <FAB>
              <div>
                <img src={logoImg} alt={logoImg} />
                <img src={logoTitle} alt={logoTitle}></img>
              </div>
            </FAB>
          </LeftSection>
          <RightSection>
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
                              <form
                                onSubmit={(event) =>
                                  handleSubmit(event, story.storyId)
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
          </RightSection>
        </Background>
      )}
    </>
  );
};

export default VisitAuthor;
