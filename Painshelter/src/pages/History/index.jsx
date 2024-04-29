import { useNavigate } from "react-router-dom";
import { db } from "../../utils/firebase/firebase.jsx";
import { auth } from "../../utils/firebase/auth.jsx";
import { collection, query, getDocs, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import poem from "../../utils/data/poem.json";
import { modifiedData } from "../../utils/zustand.js";
import moment from "moment";
import styled from "styled-components";
import backgroundImg from "../../assets/img/historyBanner.jpg";
import logoImg from "../../assets/img/logoImg.png";
import { HistoryModal } from "../../utils/zustand.js";
import ModalHistory from "../../components/ModalHistory.jsx";

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
`;

const Categories = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 50px;
  padding: 20px;
  font-weight: 500;
`;

const CategoriesSection = styled.div`
  text-align: center;
`;

//#endregion

export default function History() {
  const [stories, setStories] = useState([]);
  const navigate = useNavigate();
  const poemData = poem;
  const rand = Math.floor(Math.random() * poemData.length);
  const randPoem = poemData[rand];
  const localStorageUserId = window.localStorage.getItem("userId");
  const { setSelectedStoryId } = modifiedData();
  const [followList, setFollowList] = useState();
  const [authors, setAuthors] = useState();
  const [pressure, setPressure] = useState();
  const [lastPressure, setLastPressure] = useState();
  const { modal } = HistoryModal();

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
  console.log(getLastPressureNumber.number);

  const modifiedClick = (storyId) => {
    navigate(`/edit/${storyId}`);
    setSelectedStoryId(storyId);
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

        {/* <Categories>
          <CategoriesSection>
            <p>文章數量</p>
            <p>{stories.length}篇</p>
          </CategoriesSection>
          <CategoriesSection>
            <p>壓力指數</p>
            <p>{getLastPressureNumber.number}分</p>
          </CategoriesSection>
          <CategoriesSection>
            <p>關注作者</p>
            <p>{authors && authors.length}位</p>
          </CategoriesSection>
        </Categories> */}
      </Background>

      {modal ? <ModalHistory /> : null}

      {/* <h2 className="text-6xl font-sans font-black tracking-wider text-center ">
        暖心小語
      </h2>
      <p className="m-3 bg-yellow-300">標題：{randPoem.title}</p>
      <p className="m-3 bg-green-300">內文：{randPoem.content}</p> */}
      <button
        className="bg-blue-600 text-white mt-3"
        onClick={() => navigate("/post")}
      >
        點我撰寫日記
      </button>

      {/* <div>
        <h1 className="m-3 bg-yellow-300">關注列表</h1>
        {authors &&
          authors.map((name, index) => <p key={index}>{name.name}</p>)}
      </div> */}

      <p className="m-3 bg-yellow-300">歷史日記</p>
      {/* {stories &&
        stories.map((story, index) => {
          return (
            <div className="bg-blue-600 text-white mt-3" key={index}>
              <p>標題：{story.title}</p>
              <p>時間：{story.time}</p>
              <p>地點：{story.location.name}</p>
              <p>類型：{story.type}</p>
              <p>人物：{story.figure}</p>
              <p>內文：{story.story}</p>
              <p>
                按讚數量：
                {story.likedAuthorId?.length > 0
                  ? story.likedAuthorId.length
                  : 0}
              </p>
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

              <button
                className="bg-red-600 text-white mt-3 m-2"
                onClick={() => modifiedClick(story.storyId)}
              >
                編輯
              </button>
            </div>
          );
        })} */}
      <button
        className="bg-pink-600 text-white mt-3 m-2"
        onClick={() => navigate("/")}
      >
        點我回首頁
      </button>
    </div>
  );
}
