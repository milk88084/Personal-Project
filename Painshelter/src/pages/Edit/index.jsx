import styled from "styled-components";
import { useEffect, useState, useRef } from "react";
import { useEditFormInput } from "../../utils/hooks/useEditFormInput.jsx";
import { useEditCheckboxInput } from "../../utils/hooks/useEditCheckboxInput.jsx";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { storage } from "../../utils/firebase/firebase.jsx";
import { ToastContainer } from "react-toastify";
import storyTypeData from "@/utils/data/storyTypeData.json";
import storyFigureData from "@/utils/data/storyFigureData.json";
import defaultImg from "../../assets/img/defaultImg.png";
import Buttons from "../../components/Buttons.jsx";
import { useAuthCheck } from "@/utils/hooks/useAuthCheck.jsx";
import {
  Undo2,
  ScanSearch,
  Trash2,
  Save,
  Image,
  Pencil,
  Home,
} from "lucide-react";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import {
  getFirebaseSpacificPost,
  handleEditSubmit,
  handleDeletePost,
} from "@/utils/firebase/firebaseService.js";

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
  background: linear-gradient(60deg, #aeb4c0 0%, #d9e7ff 100%);
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
  border-radius: 7px;
  input {
    width: 400px;
    color: #353535;
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
  border-radius: 7px;
  input {
    width: 400px;
    color: #353535;
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
  font-size: 20px;
  display: flex;
  p {
    background: #8e9eab;
    padding: 4px 12px;
    border-radius: 12px;
    margin-right: 20px;
    color: white;
  }
  @media screen and (max-width: 1279px) {
    margin-top: 20px;
    font-size: 15px;
  }
`;

const PrevImg = styled.div`
  width: 600px;
  img {
    border-radius: 20px;
  }
  @media screen and (max-width: 1279px) {
    width: 100%;
    img {
      margin-top: 20px;
    }
  }
`;

const EditImg = styled.div`
  @media screen and (max-width: 1279px) {
    margin-top: 20px;
    margin-bottom: 15px;
    width: 100%;
  }
`;

const EditTextArea = styled.div`
  margin-top: 50px;
  color: #353535;
  p {
    font-size: 30px;
    font-weight: 600;
    margin-right: 50px;
    border-radius: 7px;
  }

  textarea {
    border: 2px solid black;
    width: 100%;
    height: 300px;
    margin-top: 50px;
    color: #353535;
    border-radius: 20px;
    padding-left: 10px;
    padding-top: 10px;
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
    color: #353535;
  }
`;

const ButtonSection = styled.div`
  margin-top: 20px;
  display: flex;

  @media screen and (max-width: 1279px) {
    justify-content: space-between;
    width: 100%;
  }
`;

const CommentsSection = styled.div`
  margin-top: 30px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  img {
    border-radius: 50px;
  }

  @media screen and (max-width: 1279px) {
    width: 40px;
    height: 40px;
    padding: 2px;
  }
`;

const Reply = styled.div`
  display: flex;
  border-radius: 20px;
  height: 100px;
  background-color: rgb(255, 255, 255, 0.6);
  margin-bottom: 30px;
  align-items: center;
  padding: 8px 24px;
  cursor: pointer;

  &:hover {
    background: #1d1d1d;
    color: white;
  }
  &:active {
    box-shadow: 2px 2px 5px #666666;
    transform: scale(0.9);
  }
  @media screen and (max-width: 1279px) {
    border-radius: 15px;
  }
`;
//#endregion

export default function Edit() {
  const params = useParams();
  const top = useRef(null);
  const navigate = useNavigate();
  const postStory = useEditFormInput();
  const storyTitle = useEditFormInput();
  const storyTime = useEditFormInput();
  const storyImage = useEditFormInput();
  const storyType = useEditCheckboxInput(storyTypeData);
  const storyFigure = useEditCheckboxInput(storyFigureData);
  const [locationName, setLocationName] = useState();
  const [isEdit, setIsEdit] = useState(true);
  const [comments, setComments] = useState();
  const location = useLocation();
  useAuthCheck();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    async function fetchData() {
      const data = await getFirebaseSpacificPost("storyId", params.id);
      if (data) {
        storyTitle.setValue(data.title);
        postStory.setValue(data.story);
        storyTime.setValue(data.time);
        storyType.setCheckedValues(data.type);
        storyFigure.setCheckedValues(data.figure);
        storyImage.setValue(data.imgUrl);
        setLocationName(data.location.name);
        setComments(data.commentsWithNames);
      }
    }
    fetchData();
  }, [params.id]);

  const inputRef = useRef(null);
  const [showImg, setShowImg] = useState(null);
  const [fileName, setFileName] = useState("");
  const upLoadToStorage = async (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    const imageRef = storageRef(storage, `postsImg/${fileName}`);
    const snapshot = await uploadBytes(imageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    setShowImg(url);
  };

  const handleSubmit = async (event) => {
    await handleEditSubmit(
      event,
      params.id,
      storyTitle,
      storyTime,
      storyImage,
      storyType,
      storyFigure,
      postStory,
      setIsEdit
    );
  };

  const deleteStory = async () => {
    await handleDeletePost(params.id, navigate);
  };

  const handleHistory = () => {
    setIsEdit(false);
    scrollSection(top);
  };

  const handleBackToPreview = () => {
    setIsEdit(true);
    scrollSection(top);
  };

  const backPreviewPage = () => {
    navigate("/history");
    setIsEdit(true);
    scrollSection(top);
  };

  const scrollSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  const handleClikcToCommentAuthorPage = (id) => {
    navigate("/visit", { state: { data: id } });
  };

  return (
    <Background>
      {isEdit ? (
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
            <EditCategories>
              <EditTitle>記憶照片</EditTitle>
              <PrevImg>
                <img src={storyImage.value} alt={storyImage.value} />
              </PrevImg>
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
                      <Reply
                        key={index}
                        onClick={() => handleClikcToCommentAuthorPage(data.id)}
                      >
                        <AvatarPart>
                          {data.img ? (
                            <img src={data.img} alt="profileImg" />
                          ) : (
                            <img src={defaultImg} alt="profileImg" />
                          )}
                        </AvatarPart>
                        <CommentPart key={index}>
                          <h2>{data.name}</h2>
                          <p>#{data.comment}</p>
                        </CommentPart>
                      </Reply>
                    ))
                  : null}
              </CommentsSection>
            </EditTextArea>
            <ButtonSection>
              <Buttons
                title={"編輯"}
                onClick={handleHistory}
                icon={<Pencil />}
              />
              <Buttons
                title={"上一頁"}
                onClick={() => navigate(-1)}
                icon={<Undo2 />}
              />
              <Buttons
                title={"回首頁"}
                onClick={() => navigate("/main")}
                icon={<Home />}
              />
            </ButtonSection>
          </EditSections>
        </>
      ) : (
        <>
          <Title ref={top}>文章編輯</Title>
          <EditSections>
            <form>
              <EditCategories>
                <EditTitle>疼痛暗號</EditTitle>
                <EditTitleInput>
                  <input
                    type="text"
                    value={storyTitle.value}
                    onChange={storyTitle.onChange}
                    maxLength="10"
                    required
                  />
                </EditTitleInput>
              </EditCategories>
              <EditCategories>
                <EditTitle>發生時間</EditTitle>
                <EditDateInput>
                  <input
                    className="inline"
                    type="date"
                    label="Story time"
                    value={storyTime.value}
                    onChange={storyTime.onChange}
                    required
                  />
                </EditDateInput>
              </EditCategories>
              <EditCategories>
                <EditTitle>故事類型</EditTitle>
                <EditTypesInput>
                  <ul>
                    {storyTypeData.map((option) => (
                      <li key={option}>
                        <input
                          type="checkbox"
                          onChange={storyType.onChange}
                          checked={storyType.checkedValues.includes(option)}
                          value={option}
                        />
                        {option}
                      </li>
                    ))}
                  </ul>
                </EditTypesInput>
              </EditCategories>
              <EditCategories>
                <EditTitle>故事對象</EditTitle>
                <EditTypesInput>
                  <ul>
                    {storyFigureData.map((option) => (
                      <li key={option}>
                        <input
                          type="checkbox"
                          onChange={storyFigure.onChange}
                          checked={storyFigure.checkedValues.includes(option)}
                          value={option}
                        />
                        {option}
                      </li>
                    ))}
                  </ul>
                </EditTypesInput>
              </EditCategories>
              <EditCategories>
                <EditTitle>
                  <p>記憶照片</p>
                  <EditImg>
                    <input
                      label="Image"
                      placeholder="Choose image"
                      accept="image/png,image/jpeg"
                      type="file"
                      ref={inputRef}
                      onChange={upLoadToStorage}
                      hidden
                    />
                    <Buttons
                      title={"插入圖片"}
                      onClick={() => inputRef.current.click()}
                      icon={<Image />}
                    />
                  </EditImg>
                </EditTitle>
                <PrevImg>
                  {showImg ? (
                    <img src={showImg} />
                  ) : (
                    <img src={storyImage.value} />
                  )}
                </PrevImg>
              </EditCategories>
              <EditTextArea>
                <p>請輸入故事內容</p>
                <textarea
                  label="Post story"
                  required
                  value={postStory.value}
                  onChange={postStory.onChange}
                />
              </EditTextArea>
              <ButtonSection>
                <Buttons
                  title={"儲存"}
                  type={"button"}
                  onClick={handleSubmit}
                  icon={<Save />}
                />
                <Buttons
                  title={"刪除"}
                  type={"button"}
                  onClick={deleteStory}
                  icon={<Trash2 />}
                />
                <Buttons
                  title={"預覽"}
                  onClick={handleBackToPreview}
                  icon={<ScanSearch />}
                />
                <Buttons
                  title={"上一頁"}
                  onClick={backPreviewPage}
                  icon={<Undo2 />}
                />
              </ButtonSection>
            </form>
          </EditSections>
        </>
      )}
      <ToastContainer />
    </Background>
  );
}
