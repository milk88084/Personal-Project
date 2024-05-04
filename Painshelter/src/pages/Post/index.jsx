import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginState } from "../../utils/zustand.js";
import { useFormInput } from "../../utils/hooks/useFormInput.jsx";
import { useCheckboxInput } from "../../utils/hooks/useCheckboxInput.jsx";
import { db } from "../../utils/firebase/firebase.jsx";
import { Timestamp, addDoc, collection, updateDoc } from "firebase/firestore";
import LocationSearch from "../../components/LocationSearch.jsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import pill from "../../assets/icon/pill.png";

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
  background: linear-gradient(75deg, #e3ffe7 0%, #d9e7ff 100%);
  width: 1000px;
  height: 100%;
  margin: 0 auto;
  border-radius: 50px 50px 0px 0px;
  padding: 50px;
  button {
    padding: 6px;
    border-radius: 10px;
    font-weight: 300;
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
    width: 80%;
    padding: 30px;

    button {
      padding: 4px;
      font-size: 15px;
    }
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
  margin-right: 60px;
  color: #353535;
  @media screen and (max-width: 1279px) {
    margin-right: 0px;
    font-size: 25px;
  }
`;

const EditTitleInput = styled.div`
  border: 2px solid black;
  border-radius: 7px;
  input {
    width: 400px;
    color: #19242b;
    padding-left: 10px;
    border-radius: 15px;
  }
  @media screen and (max-width: 1279px) {
    border: 1px solid black;
    input {
      width: 100%;
    }
  }
`;

const EditDateInput = styled.div`
  border: 2px solid black;
  border-radius: 7px;
  input {
    width: 400px;
    padding-left: 10px;
    color: #19242b;
    border-radius: 7px;
  }
  @media screen and (max-width: 1279px) {
    border: 1px solid black;
    input {
      width: 100%;
    }
  }
`;

const Tag = styled.li`
  font-size: 18px;
  border-radius: 15px;
  padding: 5px 8px;
  display: inline-block;
  margin: 2px;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? "#19242b" : "#fff")};
  color: ${(props) => (props.selected ? "#fff" : "#19242b")};

  &:hover,
  &:focus {
    background-color: #19242b;
    color: #fff;
  }
  @media screen and (max-width: 1279px) {
    border-radius: 10px;
    font-size: 18px;
    margin: 5px;
  }
`;

const FigureTag = styled.li`
  font-size: 18px;
  border-radius: 15px;
  padding: 5px 8px;
  display: inline-block;
  margin: 2px;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? "#19242b" : "#fff")};
  color: ${(props) => (props.selected ? "#fff" : "#19242b")};

  &:hover,
  &:focus {
    background-color: #19242b;
    color: #fff;
  }
  @media screen and (max-width: 1279px) {
    border-radius: 10px;
    font-size: 18px;
    margin: 5px;
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
    padding-left: 10px;
    padding-top: 10px;
    border-radius: 20px;
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

const ButtonSection = styled.div`
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 50px;

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
    width: 100%;

    button {
      font-size: 15px;
      margin-right: 0px;
      width: 100%;
      margin-bottom: 20px;
    }
  }
`;
//#endregion

export default function Edit() {
  const navigate = useNavigate();
  const { getLoginUserId, locationSerach } = useLoginState();
  const postStory = useFormInput();
  const storyTitle = useFormInput();
  const storyTime = useFormInput();
  const localStorageUserId = window.localStorage.getItem("userId");
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
  const storyType = useCheckboxInput(storyTypeData);
  const storyFigure = useCheckboxInput(storyFigureData);

  const storyLocation = locationSerach[0];
  console.log(storyLocation);

  //調整成不用select方式的選擇人物和主題類型
  const [selectedTypes, setSelectedTypes] = useState([]);
  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const [selectedFigure, setSelectedFigure] = useState([]);
  const toggleFigure = (type) => {
    setSelectedFigure((prev) =>
      prev.incclude(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };
  const handleSubmit = async (event) => {
    // alert("Your favorite flavor is: ");
    event.preventDefault();
    console.log(storyTitle.value);
    console.log(storyTime.value);
    console.log(storyType.getSortedCheckedValues());
    console.log(storyFigure.getSortedCheckedValues());
    console.log(postStory.value);

    try {
      const docRef = await addDoc(collection(db, "posts"), {
        title: storyTitle.value,
        time: storyTime.value,
        location: storyLocation,
        type: selectedTypes,
        figure: selectedFigure,
        story: postStory.value,
        userId: localStorageUserId,
        createdAt: Timestamp.fromDate(new Date()),
      });
      await updateDoc(docRef, { storyId: docRef.id });
      console.log("Document written with ID: ", docRef.id);
      console.log(getLoginUserId());
      toast.success("成功提交：" + storyTitle.value + "故事", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("註冊不成功", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    setTimeout(() => {
      navigate("/history");
    }, 3000);
  };

  return (
    <>
      <Background>
        <Title>撰寫文章</Title>
        <EditSections>
          <form onSubmit={handleSubmit}>
            <EditCategories>
              <EditTitle>疼痛暗號</EditTitle>
              <EditTitleInput>
                <input
                  type="text"
                  label="StoryTitle"
                  value={storyTitle.value}
                  onChange={storyTitle.onChange}
                  {...storyTitle}
                  required
                  placeholder="陽明山的星星"
                />
              </EditTitleInput>
            </EditCategories>
            <EditCategories>
              <EditTitle>發生時間</EditTitle>
              <EditDateInput>
                <input
                  type="date"
                  label="Story time"
                  value={storyTime.value}
                  onChange={storyTime.onChange}
                  {...storyTime}
                  required
                />
              </EditDateInput>
            </EditCategories>
            <EditCategories>
              <EditTitle>發生地點</EditTitle>
              <LocationSearch />
            </EditCategories>
            <EditCategories>
              <EditTitle>故事類型</EditTitle>
              <EditTypesInput>
                <ul>
                  {storyTypeData.map((type) => (
                    <Tag
                      key={type}
                      selected={selectedTypes.includes(type)}
                      onClick={() => toggleType(type)}
                    >
                      {type}
                    </Tag>
                  ))}
                </ul>
              </EditTypesInput>
            </EditCategories>
            <EditCategories>
              <EditTitle>故事對象</EditTitle>
              <EditTypesInput>
                <ul>
                  {storyFigureData.map((type) => (
                    <FigureTag
                      key={type}
                      selected={selectedFigure.includes(type)}
                      onClick={() => toggleFigure(type)}
                    >
                      {type}
                    </FigureTag>
                  ))}
                </ul>
              </EditTypesInput>
            </EditCategories>
            <EditTextArea>
              <p>請輸入故事內容</p>
              <textarea
                className=" border-2 border-black w-1/2 h-24"
                type="text"
                label="Post story"
                {...postStory}
                required
                placeholder="那一天，我哭了一整夜"
                value={postStory.value}
                onChange={postStory.onChange}
              />
            </EditTextArea>
            <button onSubmit={handleSubmit} type="submit">
              送出
            </button>
          </form>
        </EditSections>
        <ButtonSection>
          <button onClick={() => navigate("/")}>回到首頁</button>
          <button onClick={() => navigate("/history")}>回到歷史文章</button>
        </ButtonSection>
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
      </Background>
    </>
  );
}
