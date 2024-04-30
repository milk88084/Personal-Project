import { useNavigate } from "react-router-dom";
import { db } from "../../utils/firebase/firebase.jsx";
import { auth } from "../../utils/firebase/auth.jsx";
import { collection, query, getDocs, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { modifiedData } from "../../utils/zustand.js";
import moment from "moment";
import styled from "styled-components";
import backgroundImg from "../../assets/img/historyBanner.jpg";
import logoImg from "../../assets/img/logoImg.png";
import logoTitle from "../../assets/img/logoTitle.png";
import { HistoryModal } from "../../utils/zustand.js";
import ModalHistory from "../../components/ModalHistory.jsx";
import follower from "../../assets/icon/follower.png";
import pressureIcon from "../../assets/icon/pressure.png";
import write from "../../assets/icon/write.png";
import pill from "../../assets/icon/pill.png";

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
  color: white;
  position: relative;
`;

const TopSection = styled.div`
  background-image: url(${backgroundImg});
  width: 100%;
  height: 100vh;
  position: relative;

  p {
    position: absolute;
    text-align: end;
    font-size: 40px;
    font-weight: 600;
    color: white;
    text-shadow: 3px 4px 6px white;
    bottom: 0;
    right: 0;
    margin-right: 30px;
    margin-bottom: 30px;
    opacity: 0.2;
  }

  @media screen and (max-width: 1279px) {
    p {
      font-size: 20px;
      font-weight: 400;
      text-shadow: 2px 3px 4px white;
      margin-right: 20px;
      margin-bottom: 15px;
    }
  }
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

  @media screen and (max-width: 1279px) {
    margin-left: 50px;
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
  }
`;

const Categories = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 50px;
  padding: 20px;
  font-weight: 500;
  @media screen and (max-width: 1279px) {
    padding: 15px;
    margin-top: 20px;
  }
`;

const CategoriesSection = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  p {
    font-size: 100px;
    font-weight: 900;
  }

  h1 {
    font-size: 30px;
    margin-left: 30px;
    opacity: 0.6;
  }

  img {
    width: 40px;
    height: 40px;
    opacity: 0.6;
  }

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
    width: 100%;
    display: flex;
    div {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    p {
      font-size: 50px;
      font-weight: 600;
    }

    h1 {
      font-size: 15px;
      margin-left: 7px;
    }

    img {
      width: 20px;
      height: 20px;
    }

    button {
      padding: 6px;
      border-radius: 10px;
      font-weight: 400;
      margin: 15px;
      font-size: 10px;
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
  height: 300px;
  background: #8e9eab;
  background: -webkit-linear-gradient(to right, #eef2f3, #8e9eab);
  background: linear-gradient(to right, #eef2f3, #8e9eab);

  color: #555555;
  border-radius: 20px 20px 0 0px;
  box-shadow: 20px -10px 20px 10px rgba(0, 0, 0, 0.2);
  margin-top: -30px;
  display: flex;

  div:nth-of-type(1) {
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
  }
  div:nth-of-type(2) {
    width: 60%;
    padding: 20px;

    p {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 15px;
    }
  }

  div:nth-of-type(3) {
    width: 10%;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  h1 {
    font-size: 30px;
    font-weight: bold;
  }

  span {
    background: #8e9eab;
    margin-right: 10px;
    padding: 3px;
    border-radius: 8px;
    color: white;
    font-size: 13px;
  }

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
    height: 250px;

    div:nth-of-type(1) {
      width: 65px;
      height: 150px;
      font-size: 70px;
    }
    div:nth-of-type(2) {
      width: 65%;
      padding: 10px;

      p {
        -webkit-line-clamp: 1;
        margin-top: 10px;
      }
    }

    div:nth-of-type(3) {
      width: 9%;
      display: block;
    }

    h1 {
      font-size: 12px;
    }

    span {
      margin-right: 7px;
      padding: 2px;
      border-radius: 5px;
      font-size: 10px;
    }

    button {
      padding: 4px;
      border-radius: 5px;
      font-size: 11px;
      margin-top: 8px;
    }
  }
`;

const Heart = styled.div`
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
    p {
      font-size: 15px;
      margin-left: 5px;
    }
    img {
      width: 20px;
    }
  }
`;

const Comment = styled.div`
  position: absolute;
  margin-left: 367px;
  margin-top: 260px;
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

export default function History() {
  const [stories, setStories] = useState([]);
  const navigate = useNavigate();
  const localStorageUserId = window.localStorage.getItem("userId");
  const { setSelectedStoryId } = modifiedData();
  const [followList, setFollowList] = useState();
  const [authors, setAuthors] = useState();
  const [pressure, setPressure] = useState();
  const { modal, showModal } = HistoryModal();

  useEffect(() => {
    async function getStories() {
      try {
        const postsData = collection(db, "posts");
        const authorData = collection(db, "users");
        const q = query(postsData, where("userId", "==", localStorageUserId));
        const qA = query(authorData, where("id", "==", localStorageUserId));
        const querySnapshot = await getDocs(q);
        const userStoryList = querySnapshot.docs.map((doc) => ({
          title: doc.data().title,
          time: doc.data().time,
          location: doc.data().location,
          type: doc.data().type,
          figure: doc.data().figure,
          story: doc.data().story,
          userComments: doc.data().userComments,
          likedAuthorId: doc.data().likedAuthorId,
          storyId: doc.data().storyId,
        }));
        setStories(userStoryList);
        const querySnapshotA = await getDocs(qA);
        const followListData = querySnapshotA.docs
          .map((doc) => doc.data().followAuthor)
          .flat();
        setFollowList(followListData);
        const pressureCount = querySnapshotA.docs
          .map((doc) => doc.data().stressRecord)
          .flat();
        setPressure(pressureCount);
      } catch (e) {
        console.log(e);
      }
    }
    getStories();
  }, []);

  // console.log(pressure);
  // console.log(followList);
  // console.log(stories);
  let getLastPressureNumber = {};
  if (pressure && pressure.length > 0) {
    getLastPressureNumber = pressure[pressure?.length - 1];
  } else {
    console.log("沒有測驗過");
  }
  // console.log(getLastPressureNumber.number);

  const modifiedClick = (storyId) => {
    navigate(`/edit/${storyId}`);
    setSelectedStoryId(storyId);
    window.scroll(0, 0);
  };

  //用作者id去對應到相對的名稱
  useEffect(() => {
    async function getAuthors() {
      try {
        const authorData = collection(db, "users");
        const promises = followList.map((authorId) => {
          const q = query(authorData, where("id", "==", authorId));
          return getDocs(q);
        });
        const querySnapshots = await Promise.all(promises);
        const authorNamesList = querySnapshots.map((snapshot) => {
          return snapshot.docs.map((doc) => ({
            id: doc.data().id,
            name: doc.data().name,
          }))[0];
        });
        if (followList && followList.length > 0) {
          setAuthors(authorNamesList);
        }
      } catch (e) {
        console.log(e);
      }
    }
    getAuthors();
  }, [db, followList]);
  // console.log(authors);

  //拿到作者本人的名字
  const [name, setName] = useState();
  useEffect(() => {
    async function getAuthor() {
      try {
        const authorData = collection(db, "users");
        const q = query(authorData, where("id", "==", localStorageUserId));
        const querySnapshot = await getDocs(q);
        const author = querySnapshot.docs.map((doc) => ({
          name: doc.data().name,
        }));
        setName(author);
      } catch (e) {
        console.log(e);
      }
    }
    getAuthor();
  }, []);
  // console.log(name[0]?.name);

  //拿到user的加入日期
  const [createUserTime, setCreateUserTime] = useState("");
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const creationTime = user.metadata.creationTime;
      setCreateUserTime(creationTime);
    } else {
      console.log("No user is signed in.");
    }
  }, []);
  const showCreation = moment(createUserTime).format("YYYY-MM-DD");

  //將文章按照時間順序排序
  const sortTimeOfStory = stories.sort((a, b) => b.time.localeCompare(a.time));
  // console.log(stories);

  return (
    <div>
      <Background>
        <TopSection>
          <TopSectionName>
            <img src={logoImg} alt="logo" />
            <h1>{name && name[0]?.name}</h1>
          </TopSectionName>
          <p>{showCreation}</p>
        </TopSection>

        <Categories>
          <CategoriesSection>
            {stories.length ? <p>{stories.length}篇</p> : <p>0篇</p>}
            <div>
              <img src={write} alt={write} />
              <h1>文章數量</h1>
            </div>
            <button onClick={() => navigate("/post")}>撰寫文章</button>
          </CategoriesSection>

          <CategoriesSection>
            {getLastPressureNumber?.number ? (
              <p>{getLastPressureNumber?.number}分</p>
            ) : (
              <p>0分</p>
            )}

            <div>
              <img src={pressureIcon} alt={pressureIcon} />
              <h1>壓力分數</h1>
            </div>
            <button onClick={() => navigate("/help")}>測量壓力</button>
          </CategoriesSection>

          <CategoriesSection>
            {authors && authors.length ? (
              <p>{authors && authors.length}位</p>
            ) : (
              <p>0位</p>
            )}

            <div>
              <img src={follower} alt={follower} />
              <h1>關注作者</h1>
            </div>
            <button>瀏覽他人文章</button>
          </CategoriesSection>
        </Categories>

        <Title>歷史文章</Title>
        <StorySection>
          {sortTimeOfStory &&
            sortTimeOfStory.map((story, index) => {
              return (
                <EachStory key={index}>
                  <div>
                    <p>{index + 1}</p>
                  </div>
                  <div>
                    <h1>疼痛暗號：{story.title}</h1>
                    <h2>
                      {story.time}@{story.location.name}
                    </h2>
                    <h2>
                      {story.type.map((item, index) => (
                        <span key={index}>#{item}</span>
                      ))}
                    </h2>
                    <h2>
                      {story.figure.map((item, index) => (
                        <span key={index}>{item}</span>
                      ))}
                    </h2>
                    <p>{story.story}</p>
                    <button onClick={() => modifiedClick(story.storyId)}>
                      編輯
                    </button>
                  </div>
                  <div>
                    <Heart>
                      <img src={pill} alt={pill} />
                      <p>
                        {story.likedAuthorId?.length > 0
                          ? story.likedAuthorId.length
                          : 0}
                      </p>
                    </Heart>
                  </div>

                  {/* 
                  <Comment>
                    {story.userComments ? (
                      <p>
                        留言內容：
                        {story.userComments?.map((comment, index) => (
                          <p key={index}>{comment.comment}</p>
                        ))}
                      </p>
                    ) : (
                      ""
                    )}
                  </Comment> */}
                </EachStory>
              );
            })}
        </StorySection>

        <FAB>
          <button onClick={() => navigate("/")}>點我回首頁</button>
          <div>
            <img src={logoImg} alt={logoImg} />
            <img src={logoTitle} alt={logoTitle}></img>
          </div>

          <button onClick={showModal}>看小故事</button>
        </FAB>
      </Background>

      {modal ? <ModalHistory /> : null}

      {/* <div>
        <h1 className="m-3 bg-yellow-300">關注列表</h1>
        {authors &&
          authors.map((name, index) => <p key={index}>{name.name}</p>)}
      </div> */}
    </div>
  );
}
