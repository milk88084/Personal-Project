import { useNavigate, useLocation } from "react-router-dom";
import { db, storage } from "../../utils/firebase/firebase.jsx";
import { auth } from "../../utils/firebase/auth.jsx";
import {
  collection,
  query,
  getDocs,
  where,
  doc,
  arrayRemove,
  updateDoc,
} from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
import { modifiedData } from "../../utils/zustand.js";
import moment from "moment";
import styled, { keyframes } from "styled-components";
import backgroundImg from "../../assets/img/hitsoryLeft.jpg";
import logoImg from "../../assets/img/logoImg.png";
import logoTitle from "../../assets/img/logoTitle.png";
import { HistoryModal } from "../../utils/zustand.js";
import ModalHistory from "../../components/ModalHistory.jsx";
import jar from "../../assets/img/historyJar.png";
import broke from "../../assets/img/historyBroke.png";
import pill from "../../assets/icon/pill.png";
import AnimatedNumber from "../../components/AnimatedNumber.jsx";
import IsLoadingPage from "@/components/IsLoadingPage.jsx";
import { UserRoundX, User, StickyNote, AlignJustify } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Swal from "sweetalert2";
import defaultImg from "../../assets/img/defaultImg.png";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import categoryImg from "../../assets/img/categoryImg.jpg";

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

const glowing = keyframes`
  0% { box-shadow: 0 0 5px white; }
  50% { box-shadow: 0 0 20px white; }
  100% { box-shadow: 0 0 5px white; }
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
    z-index: 500;
    background-image: url(${(props) => props.backgroundImg});
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

const CloseButton = styled.div`
  @media screen and (max-width: 1279px) {
    font-size: 30px;
    position: absolute;
    right: 0;
    top: 0;
    margin-right: 20px;
  }
`;

const LeftNameSection = styled.div`
  font-size: 50px;
  font-weight: bolder;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    margin-right: 20px;
    border-radius: 50%;
    cursor: pointer;
  }

  img:hover {
    scale: 1.5;
  }
  @media screen and (max-width: 1279px) {
    font-size: 40px;
    padding: 20px;
    margin-top: 30px;
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

const LeftDateSection = styled.div`
  opacity: 0.5;
`;

const RightSection = styled.div`
  width: calc(100vw - 330px);
  position: absolute;
  right: 0;
  background: linear-gradient(45deg, #262222 34%, #161a1f 51%, #060708 69%);
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

const Categories = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100vh;
  padding: 30px;
  width: 100%;

  section {
    width: 100%;
    display: flex;
    margin-bottom: 15px;
  }

  span {
    width: 100px;
  }
  @media screen and (max-width: 1279px) {
    padding: 0px;
    margin-top: 15px;
    margin-bottom: 20px;
    height: 100%;

    section {
      flex-direction: column;
      margin: 15px;
      justify-content: center;
      align-items: center;
    }

    span {
      height: 15px;
    }
  }
`;

const TopCategories = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: rgb(255, 255, 255, 0.4);
  border-radius: 20px;
  height: 180px;
  font-size: 50px;
  padding: 10px;
  cursor: pointer;

  span {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    height: 100px;
  }

  @media screen and (max-width: 1279px) {
    width: 400px;
    img {
      height: 60px;
    }
  }
`;

const CategoriesImg = styled.div`
  border-radius: 20px;
  margin-bottom: 18px;
  width: 100%;
  overflow: hidden;
  height: 180px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  @media screen and (max-width: 1279px) {
    display: none;
  }
`;

const CategoriesSection = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(255, 255, 255, 0.4);
  padding: 15px;
  border-radius: 20px;

  img {
    width: 150px;
    margin-right: 20px;
  }

  h1 {
    font-size: 25px;
    margin-bottom: 15px;
  }

  h2 {
    font-size: 15px;
  }

  button {
    padding: 8px 24px;
    border-radius: 8px;
    font-weight: 400;
    font-size: 16px;
    margin-top: 10px;
    margin-right: 15px;
    background-color: #19242b;
    color: white;
    animation: ${glowing} 2s infinite ease-in-out;
    &:hover,
    &:focus {
      background-color: #9ca3af;
      color: black;
    }
  }

  div:nth-child(2) {
    width: 70%;
  }

  div:nth-child(3) {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 90px;
    margin-right: 50px;
  }

  @media screen and (max-width: 1279px) {
    width: 400px;
    margin: 0px;
    padding: 0px;
    height: auto;
    margin-bottom: 20px;
    padding-bottom: 10px;

    div:nth-child(1) {
      width: 80px;
    }

    div:nth-child(2) {
      width: 300px;
    }

    div:nth-child(3) {
      width: 70px;
      font-size: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      margin-right: 0px;
    }

    h1 {
      font-size: 20px;
      margin-bottom: 20px;
    }

    h2 {
      width: 260px;
      font-size: 12px;
    }

    img {
      width: 60px;
      margin: 0px;
    }
  }
`;

const StorySection = styled.div`
  width: 100%;
  padding: 45px 45px 0 45px;
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
  justify-content: space-around;
  position: relative;
  @media screen and (max-width: 1279px) {
    height: 280px;
  }
`;

const PostIndex = styled.div`
  font-size: 200px;
  line-height: 220px;
  font-weight: bold;
  opacity: 0.6;
  color: #8e9eab;
  text-shadow: 3px 1px 6px white;
  display: flex;
  margin-left: 30px;

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
    width: 80%;
    padding: 10px;
    p {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 13px;
      margin-top: 4px;
    }

    span {
      margin-right: 5px;
      padding: 3px;
      border-radius: 8px;
      margin-top: 3px;
    }

    h3 {
      font-size: 12px;
    }

    button {
      padding: 5px;

      font-weight: 200;
      font-size: 12px;

      margin-top: 6px;
    }
  }
`;

const Heart = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 50px;
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
    margin-left: 15px;
    p {
      font-size: 15px;
      margin-left: 5px;
    }
    img {
      width: 20px;
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

const OtherAuthorList = styled.div`
  width: 500px;
  height: auto;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
  background: linear-gradient(125deg, #eef2f3, #8e9eab);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Noto Sans TC", sans-serif;
  color: #19242b;

  button {
    padding: 10px;
    border-radius: 7px;
    font-weight: 300;
    font-size: 15px;
    background-color: #9ca3af;
    color: #19242b;
    margin: 20px 0px 20px 0px;

    &:hover,
    &:focus {
      background-color: #19242b;
      color: white;
    }
  }
  h1 {
    font-size: 40px;
    font-weight: 900;
    margin: 20px 0px 20px 0px;
  }

  @media screen and (max-width: 1279px) {
    width: 70%;
    height: 90%;
    margin: 0 auto;
    background: linear-gradient(125deg, #eef2f3, #8e9eab);
    border-radius: 20px;
    margin-top: 30px;
  }
`;

const StyledUser = styled(User)`
  width: 30px;
  height: 30px;
`;

const FollowerList = styled.div`
  background-color: white;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  width: 300px;
  padding: 10px;
  margin-bottom: 20px;
  div {
    display: flex;
    align-items: center;
  }

  p {
    font-size: 18px;
    margin-left: 10px;
  }

  span {
    padding: 10px;
    display: flex;
    margin: 2px;
    cursor: pointer;

    &:hover {
      background-color: #9ca3af;
      color: #19242b;
      border-radius: 15px;
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
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [profileImg, setProfileImg] = useState(null);

  //監聽到網頁最上方
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    async function getStories() {
      try {
        setIsLoading(true);
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
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    getStories();
  }, []);

  console.log(pressure);
  // console.log(followList);
  // console.log(stories);
  let getLastPressureNumber = {};
  if (pressure && pressure.length > 0) {
    getLastPressureNumber = pressure[pressure?.length - 1];
  } else {
    // console.log("沒有測驗過");
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
          profileImg: doc.data().profileImg,
        }));
        setName(author);
        setProfileImg(author[0].profileImg);
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

  const handlePost = () => {
    navigate("/post");
    window.scrollTo(0, 0);
  };

  const handleHelp = () => {
    navigate("/help");
    window.scrollTo(0, 0);
  };

  //追蹤list去其他作者的頁面
  const handleAuthor = (id) => {
    navigate("/visit", { state: { data: id } });
    window.scrollTo(0, 0);
  };
  console.log(authors);

  //取消追蹤
  const deleteFollower = async (id) => {
    const result = await Swal.fire({
      title: "確定取消追蹤？",
      text: "取消後無法恢復",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#363636",
      cancelButtonColor: "#d33",
      confirmButtonText: "確定",
      cancelButtonText: "取消",
    });

    if (result.isConfirmed) {
      try {
        const localStorageUserId = localStorage.getItem("userId");
        const userRef = doc(db, "users", localStorageUserId);
        console.log("delete");
        await updateDoc(userRef, {
          followAuthor: arrayRemove(id),
        });
        console.log("finish");
        Swal.fire({
          title: "取消追蹤!",
          text: "此作者已取消追蹤",
          icon: "success",
        });
        navigate("/history");
      } catch (error) {
        console.error("Error updating document: ", error);
        toast.error("刪除失敗", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    }
  };

  const [isMobileSize, setIsMobileSize] = useState(false);
  const storyRef = useRef(null);
  const scrollSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  //上傳圖片

  const inputRef = useRef(null);
  const [showImg, setShowImg] = useState(null);
  const [fileName, setFileName] = useState("");
  const upLoadToStorage = async (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    const imageRef = storageRef(storage, `authorsImg/${file.name}`);
    const snapshot = await uploadBytes(imageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    setShowImg(url);
    console.log(showImg);
    console.log(fileName);
  };

  useEffect(() => {
    const updateProfileImage = async () => {
      if (showImg) {
        try {
          const q = query(
            collection(db, "users"),
            where("id", "==", localStorageUserId)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await updateDoc(docRef, {
              profileImg: showImg,
            });
          }
        } catch (error) {
          console.error("Error updating document: ", error);
        }
      }
    };

    updateProfileImage();
  }, [showImg]);

  const profile = profileImg || showImg || defaultImg;

  return (
    <div>
      {isLoading ? (
        <IsLoadingPage />
      ) : (
        <>
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
                    <input
                      label="Image"
                      placeholder="Choose image"
                      accept="image/png,image/jpeg"
                      type="file"
                      ref={inputRef}
                      onChange={upLoadToStorage}
                      hidden
                    />
                    <img
                      src={profile}
                      alt={profile}
                      onClick={() => inputRef.current.click()}
                    />

                    <h1>{`${name && name[0]?.name}`}</h1>
                  </LeftNameSection>
                  <LeftButtonSection>
                    <button onClick={handlePost}>撰寫文章</button>
                    <button onClick={handleHelp}>測量壓力</button>
                    <button onClick={() => setShowFriendsList(true)}>
                      關注作者
                    </button>
                    <button onClick={showModal}>點選詩篇</button>
                    <button onClick={() => navigate("/main")}>返回首頁</button>
                  </LeftButtonSection>
                  <LeftDateSection>
                    <p>Join in {showCreation}</p>
                  </LeftDateSection>
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
                <input
                  label="Image"
                  placeholder="Choose image"
                  accept="image/png,image/jpeg"
                  type="file"
                  ref={inputRef}
                  onChange={upLoadToStorage}
                  hidden
                />
                <img
                  src={profile}
                  alt={profile}
                  onClick={() => inputRef.current.click()}
                />
                <h1>{`${name && name[0]?.name}`}</h1>
              </LeftNameSection>
              <LeftButtonSection>
                <button onClick={handlePost}>撰寫文章</button>
                <button onClick={handleHelp}>測量壓力</button>
                <button onClick={() => setShowFriendsList(true)}>
                  關注作者
                </button>
                <button onClick={showModal}>點選詩篇</button>
                <button onClick={() => navigate("/main")}>返回首頁</button>
              </LeftButtonSection>
              <LeftDateSection>
                <p>Join in {showCreation}</p>
              </LeftDateSection>
              <FAB>
                <div>
                  <img src={logoImg} alt={logoImg} />
                  <img src={logoTitle} alt={logoTitle}></img>
                </div>
              </FAB>
            </LeftSection>
            <RightSection>
              <Categories>
                <section>
                  <TopCategories onClick={() => navigate("/help")}>
                    <h1>
                      <h2>壓力</h2>
                      <h2>指數</h2>
                    </h1>
                    <span>
                      {getLastPressureNumber?.number ? (
                        <>
                          <p>
                            <AnimatedNumber
                              end={getLastPressureNumber?.number}
                            />
                          </p>
                          <p>分</p>
                        </>
                      ) : (
                        <p>0分</p>
                      )}
                    </span>
                    <img src={broke} alt={broke} />
                  </TopCategories>
                  <span></span>
                  <TopCategories onClick={() => navigate("/help")}>
                    <h1>
                      <h2>關注</h2>
                      <h2>作者</h2>
                    </h1>
                    <span>
                      {authors && authors.length ? (
                        <>
                          <p>
                            <AnimatedNumber end={authors && authors.length} />
                          </p>
                          <p>位</p>
                        </>
                      ) : (
                        <p>0位</p>
                      )}
                    </span>
                    <img src={jar} alt={jar} />
                  </TopCategories>
                </section>
                <CategoriesImg>
                  <img src={categoryImg} alt={categoryImg}></img>
                </CategoriesImg>
                <CategoriesSection>
                  <div>
                    <img src={logoImg} alt={logoImg} />
                  </div>
                  <div>
                    <h1>「你的疼痛都保留在這裡」</h1>
                    <h2>無論是失落、孤獨還是挫折，故事都值得被記錄下來。</h2>
                    <h2>
                      在這個安全的地方，你可以毫無保留地表達自己，寫下你的故事，分享疼痛。
                    </h2>
                    <button onClick={handlePost}>撰寫文章</button>
                    <button onClick={() => scrollSection(storyRef)}>
                      歷史文章
                    </button>
                  </div>
                  <div>
                    {stories.length ? (
                      <>
                        <p>
                          <AnimatedNumber end={stories.length} />
                        </p>
                        <p>篇</p>
                      </>
                    ) : (
                      <p>0篇</p>
                    )}
                  </div>
                </CategoriesSection>
              </Categories>
              <StorySection ref={storyRef}>
                {sortTimeOfStory &&
                  sortTimeOfStory.map((story, index) => {
                    return (
                      <EachStory key={index}>
                        <PostIndex>
                          <p>{index + 1}</p>
                        </PostIndex>
                        <MainContent>
                          <h1>疼痛暗號：{story.title}</h1>
                          <h1>
                            {story.time}@{story.location.name}
                          </h1>
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
                          <button onClick={() => modifiedClick(story.storyId)}>
                            完整文章
                          </button>
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
            </RightSection>

            {/* <TopSection>
              <TopSectionName>
                <img src={logoImg} alt="logo" />
                <h1>{name && name[0]?.name}</h1>
              </TopSectionName>
              <p>{showCreation}</p>
            </TopSection> */}
          </Background>

          {modal ? <ModalHistory /> : null}
          {showFriendsList ? (
            <OtherAuthorList>
              <h1>關注列表</h1>
              <section>
                {authors &&
                  authors.map((name, index) => (
                    <>
                      <FollowerList>
                        <div>
                          <StyledUser />
                          <p key={index}>{name.name}</p>
                        </div>
                        <div>
                          <span onClick={() => handleAuthor(name.id)}>
                            <HoverCard>
                              <HoverCardTrigger>
                                <StickyNote />
                              </HoverCardTrigger>
                              <HoverCardContent>
                                前往作者文章列表
                              </HoverCardContent>
                            </HoverCard>
                          </span>
                          <span onClick={() => deleteFollower(name.id)}>
                            <HoverCard>
                              <HoverCardTrigger>
                                <UserRoundX />
                              </HoverCardTrigger>
                              <HoverCardContent>取消追蹤作者</HoverCardContent>
                            </HoverCard>
                          </span>
                        </div>
                      </FollowerList>
                    </>
                  ))}
              </section>
              <button onClick={() => setShowFriendsList(false)}>關閉</button>
            </OtherAuthorList>
          ) : null}
        </>
      )}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
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
  );
}
