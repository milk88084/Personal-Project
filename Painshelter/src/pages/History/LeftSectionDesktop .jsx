import moment from "moment";
import styled from "styled-components";
import logoImg from "@/assets/img/logoImg.png";
import logoTitle from "@/assets/img/logoTitle.png";
import driverObj from "@/utils/newbie-guide/historyPageGuide.js";
import defaultImg from "@/assets/img/defaultImg.png";
import { storage } from "@/utils/firebase/firebase.jsx";
import { toastAlert } from "@/utils/toast.js";
import { useNavigate } from "react-router-dom";
import { HistoryModal } from "@/utils/zustand.js";
import { ToastContainer } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import { UserRoundX, User, StickyNote } from "lucide-react";
import {
  getFirebaseUsers,
  getAuthorsByIds,
  getAuthorJoinedDate,
  handleUnFollow,
  updateProfileImage,
} from "@/utils/firebase/firebaseService.js";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

//#region
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
    height: 40px;
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

const BottomLogo = styled.div`
  width: 100%;
  height: 150px;
  color: black;
  border-radius: 20%;
  display: flex;
  justify-content: space-around;
  align-items: center;

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
    img {
      width: 40px;
      height: 40px;
    }

    img:nth-of-type(2) {
      width: 100px;
    }
  }
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
  z-index: 300;

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
//#endregion

export default function LeftSectionDesktop() {
  const localStorageUserId = window.localStorage.getItem("userId");
  const inputRef = useRef(null);
  const { showModal } = HistoryModal();
  const [authors, setAuthors] = useState();
  const [showImg, setShowImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [authorName, setAuthorName] = useState();
  const [createUserTime, setCreateUserTime] = useState("");
  const [showFriendsList, setShowFriendsList] = useState(false);
  const navigate = useNavigate();

  const upLoadToStorage = async (e) => {
    const file = e.target.files[0];
    const imageRef = storageRef(storage, `authorsImg/${file.name}`);
    const snapshot = await uploadBytes(imageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    setShowImg(url);
  };

  useEffect(() => {
    if (showImg) {
      updateProfileImage(localStorageUserId, showImg);
    }
  }, [showImg, localStorageUserId]);

  useEffect(() => {
    async function fetchUserDataAndAuthors() {
      try {
        const data = await getFirebaseUsers("id", localStorageUserId);
        if (data) {
          setAuthorName(data.name);
          setProfileImg(data.profileImg);
          const followListData = data.followAuthor?.flat() || [];
          if (followListData.length > 0) {
            const authorNamesList = await getAuthorsByIds(followListData);
            setAuthors(authorNamesList);
          }
        }
      } catch (e) {
        toastAlert("error", e, 3000);
      }
    }
    fetchUserDataAndAuthors();
  }, [localStorageUserId]);

  useEffect(() => {
    const creationTime = getAuthorJoinedDate();
    if (creationTime) {
      setCreateUserTime(creationTime);
    }
  }, []);

  function startTheMagicShow() {
    driverObj.drive();
  }

  const handlePost = () => {
    navigate("/post");
    window.scrollTo(0, 0);
  };

  const handleHelp = () => {
    navigate("/help");
    window.scrollTo(0, 0);
  };

  const handleAuthor = (id) => {
    navigate("/visit", { state: { data: id } });
    window.scrollTo(0, 0);
  };

  const deleteFollower = async (id) => {
    await handleUnFollow(id, navigate);
  };

  const showCreation = moment(createUserTime).format("YYYY-MM-DD");
  const profile = profileImg || showImg || defaultImg;

  return (
    <div>
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
                          <HoverCardContent>前往作者文章列表</HoverCardContent>
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
      <LeftSection>
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
          <button onClick={() => setShowFriendsList(true)}>關注作者</button>
          <button onClick={showModal}>點選詩篇</button>
          <button onClick={startTheMagicShow}>新手教學</button>
          <button onClick={() => navigate("/main")}>返回首頁</button>
        </LeftButtonSection>
        <LeftDateSection>
          {!showCreation ? null : <p>Joined in {showCreation}</p>}
        </LeftDateSection>
        <BottomLogo>
          <div>
            <img src={logoImg} alt={logoImg} />
            <img src={logoTitle} alt={logoTitle}></img>
          </div>
        </BottomLogo>
        <div>
          <ToastContainer />
        </div>
      </LeftSection>
    </div>
  );
}
