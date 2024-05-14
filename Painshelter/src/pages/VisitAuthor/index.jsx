import { db } from "../../utils/firebase/firebase.jsx";
import {
  collection,
  query,
  getDocs,
  where,
  updateDoc,
  arrayUnion,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import replyData from "../../utils/data/reply.json";
import { useLoginState } from "../../utils/zustand.js";
import styled from "styled-components";
import logoImg from "../../assets/img/logoImg.png";
import logoTitle from "../../assets/img/logoTitle.png";
import backgroundImg from "../../assets/img/historyBanner.jpg";
import heartIcon from "../../assets/icon/heart.png";
import submitIcon from "../../assets/icon/paper-plane.png";
// import backgroundImg from "../../assets/img/backgroundImg.jpg";
import { useAuthorfiedData } from "../../utils/zustand.js";
import IsLoadingPage from "@/components/IsLoadingPage.jsx";
import { AlignJustify, Heart, MessageCircle } from "lucide-react";
import Buttons from "@/components/Buttons.jsx";
import defaultImg from "../../assets/img/defaultImg.png";
import { auth } from "@/utils/firebase/auth.jsx";
import { useAuthCheck } from "@/utils/hooks/useAuthCheck.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IsLoading from "@/components/IsLoadingPage.jsx";

//#region
const Background = styled.div`
  color: white;
  position: relative;
  font-family: "Noto Sans TC", sans-serif;
  height: 100vh;
  background-color: #29292d;
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
  background-color: #666666;
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
    background-color: #666666;
    width: 100%;
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
  font-weight: bolder;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;

  img {
    width: 60px;
    border-radius: 50px;
    height: 60px;
    margin-bottom: 20px;
    border: 1px solid white;
  }

  h1 {
    font-size: 35px;
    margin-bottom: 20px;
    text-align: center;
  }

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
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  useAuthCheck();

  // console.log("這裡是這個作者的歷史文章", state.data);
  console.log("現在登入的人是：" + localStorageUserId);

  //從firestore讀取posts資料
  useEffect(() => {
    const q = query(collection(db, "posts"), where("userId", "==", state.data));
    const dataSnapshot = onSnapshot(q, (querySnapshot) => {
      const stories = querySnapshot.docs.map((doc) => ({
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
      setStories(stories);
      setIsLoggedIn(false);
    });
    return () => dataSnapshot();
  }, []);

  //從firebase讀取users資料
  useEffect(() => {
    async function getAuthor() {
      try {
        setIsLoadingPage(true);
        const authorData = collection(db, "users");
        const q = query(authorData, where("id", "==", state.data));
        const querySnapshot = await getDocs(q);
        const authorList = querySnapshot.docs.map((doc) => ({
          id: doc.data().id,
          name: doc.data().name,
          img: doc.data().profileImg,
        }));

        setAuthor(authorList);
        setTimeout(() => setIsLoadingPage(false), 1000);
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
          toast("❗已按過讚", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          return;
        }
        await updateDoc(docRef, {
          likedAuthorId: arrayUnion(item),
        });
        toast("💛按讚成功!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

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
          toast("❗已給過評論", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          return;
        }
        await updateDoc(docRef, {
          userComments: arrayUnion(replyArray),
        });
        toast("💬留言成功!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
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
          toast("❗已關注", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setIsFollow(false);
          return;
        }
        await updateDoc(docRef, {
          followAuthor: arrayUnion(state.data),
        });
        toast("➕關注成功!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
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
  const profileImg = author[0]?.img || defaultImg;
  console.log(author[0]?.img);

  return (
    <>
      {isLoadingPage ? (
        <IsLoading />
      ) : (
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
                          <img src={profileImg} alt={profileImg} />
                          <h1>{`${author[0]?.name}`}</h1>
                          <p></p>
                          <span>作者本人</span>
                        </>
                      ) : (
                        <>
                          <img src={profileImg} alt={profileImg} />
                          <h1>{`${author[0]?.name}`}</h1>
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

                      <button onClick={() => navigate("/main")}>
                        返回首頁
                      </button>
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
                      <img src={profileImg} alt={profileImg} />
                      <h1>{`${author[0]?.name}`}</h1>
                      <span>作者本人</span>
                    </>
                  ) : (
                    <>
                      <img src={profileImg} alt={profileImg} />
                      <h1>{`${author[0]?.name}`}</h1>
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
                                <Type_relationship key={index}>
                                  #{item}
                                </Type_relationship>
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
                                    <Buttons type="submit" text="送出" />
                                    <Buttons
                                      onClick={() =>
                                        modifiedClick(story.storyId)
                                      }
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
                              <Heart
                                onClick={() => handleLike(story.storyId)}
                              />
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
              </RightSection>
              <div>
                <ToastContainer
                  position="top-center"
                  autoClose={5000}
                  hideProgressBar
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="dark"
                  transition:Bounce
                />
              </div>
            </Background>
          )}
        </>
      )}
    </>
  );
};

export default VisitAuthor;
