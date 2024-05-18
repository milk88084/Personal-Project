import { useNavigate, useLocation } from "react-router-dom";
import { storage } from "../../utils/firebase/firebase.jsx";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import defaultImg from "../../assets/img/defaultImg.png";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import categoryImg from "../../assets/img/categoryImg.jpg";
import Buttons from "../../components/Buttons.jsx";
import { useAuthCheck } from "@/utils/hooks/useAuthCheck.jsx";
import driverObj from "../../utils/newbie guide/historyPageGuide.js";
import {
  getFirebasePosts,
  getFirebaseUsers,
  getAuthorsByIds,
  getAuthorJoinedDate,
  handleUnFollow,
  updateProfileImage,
} from "@/utils/firebase/firebaseService.js";
import LeftSectionMobile from "./LeftSectionMobile.jsx";

//#region
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

const LeftNameSection = styled.div`
  font-size: 40px;
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
    border: 2px solid #353535;
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
    opacity: 0.5;
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
  border: 4px solid #888888;
  border-radius: 20px;
  height: 180px;
  font-size: 50px;
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: rgb(255, 255, 255, 0.4);
  }

  &:active {
    transform: scale(0.9);
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }

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

  div:nth-child(2) {
    width: 70%;
    margin: 20px 0;
  }

  div:nth-child(3) {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 90px;
    margin-right: 50px;
  }

  span {
    display: flex;
    width: 100%;
    align-items: center;
    height: 50px;
    margin-top: 20px;
  }

  button {
    animation: ${glowing} 2s infinite ease-in-out;
  }

  @media screen and (max-width: 1279px) {
    width: 400px;
    flex-direction: column;
    padding: 10px;
    border-radius: 20px;

    img {
      width: 70px;
      margin-right: 0px;
      margin-bottom: 15px;
    }

    h1 {
      font-size: 20px;
    }

    h2 {
      font-size: 12px;
    }

    div:nth-child(2) {
      width: 70%;
      margin: 0px 0px;
    }

    div:nth-child(3) {
      font-size: 50px;
      margin-right: 0px;
    }

    span {
      height: 100%;
      margin-top: 20px;
    }

    button {
      width: 120px;
      font-size: 15px;
      margin: 10px 10px;
    }
  }
`;

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
    height: 380px;
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

  h4 {
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
    p {
      font-size: 15px;
      margin-right: 5px;
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
  useAuthCheck();

  //監聽到網頁最上方
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  //Get all the Posts data from firebase collection
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

  const [authorName, setAuthorName] = useState();
  //Get User data from firebase collection
  useEffect(() => {
    async function fetchUserDataAndAuthors() {
      try {
        const data = await getFirebaseUsers("id", localStorageUserId);
        if (data) {
          setAuthorName(data.name);
          setProfileImg(data.profileImg);
          const followListData = data.followAuthor.flat();
          setFollowList(followListData);
          const pressureCount = data.stressRecord.flat();
          setPressure(pressureCount);
          if (followListData.length > 0) {
            const authorNamesList = await getAuthorsByIds(followListData);
            setAuthors(authorNamesList);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    fetchUserDataAndAuthors();
  }, [localStorageUserId]);

  let getLastPressureNumber = {};
  if (pressure && pressure.length > 0) {
    getLastPressureNumber = pressure[pressure?.length - 1];
  }

  const modifiedClick = (storyId) => {
    navigate(`/edit/${storyId}`);
    setSelectedStoryId(storyId);
    window.scroll(0, 0);
  };

  //拿到user的加入日期
  const [createUserTime, setCreateUserTime] = useState("");
  useEffect(() => {
    const creationTime = getAuthorJoinedDate();
    if (creationTime) {
      setCreateUserTime(creationTime);
    }
  }, []);
  const showCreation = moment(createUserTime).format("YYYY-MM-DD");

  //將文章按照時間順序排序
  const sortTimeOfStory = stories.sort((a, b) => b.time.localeCompare(a.time));

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

  //取消追蹤
  const deleteFollower = async (id) => {
    await handleUnFollow(id, navigate);
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
    if (showImg) {
      updateProfileImage(localStorageUserId, showImg);
    }
  }, [showImg, localStorageUserId]);

  const profile = profileImg || showImg || defaultImg;

  //newbie guide
  function startTheMagicShow() {
    driverObj.drive();
  }

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
                <LeftSectionMobile
                  isMobileSize={isMobileSize}
                  setIsMobileSize={setIsMobileSize}
                />
              </ShowLeftSection>
            ) : null}

            <LeftSection backgroundImg={backgroundImg}>
              <LeftNameSection id="profileImg">
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
                <h1>{authorName}</h1>
              </LeftNameSection>
              <LeftButtonSection>
                <button onClick={handlePost}>撰寫文章</button>
                <button onClick={handleHelp}>測量壓力</button>
                <button onClick={() => setShowFriendsList(true)}>
                  關注作者
                </button>
                <button onClick={showModal}>點選詩篇</button>
                <button onClick={startTheMagicShow}>新手教學</button>
                <button onClick={() => navigate("/main")}>返回首頁</button>
              </LeftButtonSection>
              <LeftDateSection>
                <p>Joined in {showCreation}</p>
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
                <section id="statistics">
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
                <CategoriesSection id="storySection">
                  <div>
                    <img src={logoImg} alt={logoImg} />
                  </div>
                  <div>
                    <h1>「你的疼痛都保留在這裡」</h1>
                    <h2>無論是失落、孤獨還是挫折，故事都值得被記錄下來。</h2>
                    <h2>
                      在這個安全的地方，你可以毫無保留地表達自己，寫下你的故事，分享疼痛。
                    </h2>
                    <span>
                      <Buttons onClick={handlePost} text="投稿故事" />
                      <Buttons
                        onClick={() => scrollSection(storyRef)}
                        text="歷史文章"
                      />
                    </span>
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
                              <h4 key={index}>#{item}</h4>
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
    </div>
  );
}
