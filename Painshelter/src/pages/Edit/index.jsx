import styled from "styled-components";
import { useEffect, useState, useRef } from "react";
import { useLoginState } from "../../utils/zustand.js";
import { useEditFormInput } from "../../utils/hooks/useEditFormInput.jsx";
import { useEditCheckboxInput } from "../../utils/hooks/useEditCheckboxInput.jsx";
import EditLocationSearch from "../../components/EditLocationSearch.jsx";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { db } from "../../utils/firebase/firebase.jsx";
import pill from "../../assets/icon/pill.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import {
  Timestamp,
  collection,
  updateDoc,
  query,
  getDocs,
  where,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";

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
  input {
    width: 400px;
    color: black;
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
  input {
    width: 400px;
    color: black;
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
  color: #838383;
  font-size: 20px;
  display: flex;
  p {
    margin-right: 20px;
  }
  @media screen and (max-width: 1279px) {
    font-size: 15px;
    display: block;
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
    color: black;
  }
`;

const ButtonSection = styled.div`
  margin-top: 50px;

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
    justify-content: space-between;
    width: 100%;

    button {
      font-weight: 300;
      font-size: 15px;
      margin-right: 0px;
      width: 100%;
      margin: 10px;
    }
  }
`;

const CommentsSection = styled.div`
  margin-top: 30px;
  font-size: 20px;
  background-color: rgb(255, 255, 255, 0.6);
  width: 100%;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 10px;
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
  @media screen and (max-width: 1279px) {
    width: 40px;
    height: 40px;
    padding: 2px;
  }
`;
//#endregion

export default function Edit() {
  const params = useParams();
  const navigate = useNavigate();
  const { locationSerach } = useLoginState();
  const postStory = useEditFormInput();
  const storyTitle = useEditFormInput();
  const storyTime = useEditFormInput();
  const storyType = useEditCheckboxInput(storyTypeData);
  const storyFigure = useEditCheckboxInput(storyFigureData);
  const storyLocation = locationSerach[0];
  const [locationName, setLocationName] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const top = useRef(null);
  const [comments, setComments] = useState();
  const location = useLocation();

  //回到網頁最上方
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  //取得db資料
  useEffect(() => {
    async function getStories() {
      try {
        const postsData = collection(db, "posts");
        const q = query(postsData, where("storyId", "==", params.id));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data(); // 直接取得数据
          storyTitle.setValue(data.title);
          postStory.setValue(data.story);
          storyTime.setValue(data.time);
          storyType.setCheckedValues(data.type);
          storyFigure.setCheckedValues(data.figure);
          setLocationName(data.location.name);
          const commentsWithNames = await Promise.all(
            data.userComments.map(async (comment) => {
              const userRef = doc(db, "users", comment.id);
              const userSnap = await getDoc(userRef);
              return userSnap.exists()
                ? { comment: comment.comment, name: userSnap.data().name }
                : comment;
            })
          );
          setComments(commentsWithNames);
        } else {
          console.log("No document found with the given storyId");
        }
      } catch (e) {
        console.error("Error fetching document: ", e);
      }
    }
    getStories();
  }, [db, params.id]);

  // console.log(locationName);
  // console.log(storyType.checkedValues);
  // console.log(comments);

  //更新db資料
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(storyTitle.value);
    console.log(storyTime.value);
    console.log(storyType.getSortedCheckedValues());
    console.log(storyFigure.getSortedCheckedValues());
    console.log(postStory.value);
    try {
      const q = query(
        collection(db, "posts"),
        where("storyId", "==", params.id)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          title: storyTitle.value,
          time: storyTime.value,
          // location: storyLocation,
          type: storyType.getSortedCheckedValues(),
          figure: storyFigure.getSortedCheckedValues(),
          story: postStory.value,
          modifiedAt: Timestamp.fromDate(new Date()),
        });
        toast.success("成功修改：" + storyTitle.value + "故事", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        console.error("No document found with the given storyId");
        toast.error("修改失敗", {
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
    } catch (error) {
      console.error("Error updating document: ", error);
      toast.error("修改失敗", {
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
  };

  //刪除文章
  const deleteStory = async () => {
    console.log(params.id);

    if (window.confirm("確定要刪除此篇投稿故事嗎?")) {
      try {
        const q = doc(db, "posts", params.id);
        console.log("delete");
        await deleteDoc(q);
        console.log("finish");
        toast.success("成功刪除：" + storyTitle.value + "故事", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTimeout(() => navigate("/history"), 3000);
      } catch (error) {
        console.error("Error updating document: ", error);
        toast.error("刪除失敗", {
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
    } else {
      console.log("取消刪除動作");
    }
  };

  //編輯按鈕來決定state狀態
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

  //回到最上方
  const scrollSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: "smooth",
    });
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
            <EditTextArea>
              <p>故事內容</p>
              <PreviewTextArea>{postStory.value}</PreviewTextArea>
            </EditTextArea>
            <EditTextArea>
              <p>故事留言</p>
              <CommentsSection>
                {comments && comments.length > 0
                  ? comments.map((data, index) => (
                      <>
                        <AvatarPart>
                          <img src={pill} alt={pill} />
                        </AvatarPart>
                        <CommentPart key={index}>
                          <h2>{data.name}</h2>
                          <p>#{data.comment}</p>
                        </CommentPart>
                      </>
                    ))
                  : null}
              </CommentsSection>
            </EditTextArea>
            <ButtonSection>
              <button onClick={handleHistory}>編輯文章</button>
              <button onClick={() => navigate("/history")}>回到上一頁</button>
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

              {/* <div className="flex mt-12 items-center">
            <label className="block marker:m-3 text-3xl mr-12 font-semibold">
              發生地點
            </label>
            <EditLocationSearch location={locationName} />
          </div> */}

              <EditCategories>
                <EditTitle>故事類型</EditTitle>
                <EditTypesInput>
                  <ul>
                    <li>
                      <input
                        type="checkbox"
                        onChange={storyType.onChange}
                        checked={storyType.checkedValues.includes("成長軌跡")}
                        value="成長軌跡"
                      />
                      成長軌跡
                    </li>
                    <li>
                      <input
                        type="checkbox"
                        onChange={storyType.onChange}
                        checked={storyType.checkedValues.includes("情感關係")}
                        value="情感關係"
                      />
                      情感關係
                    </li>
                    <li>
                      <input
                        type="checkbox"
                        onChange={storyType.onChange}
                        checked={storyType.checkedValues.includes("人際交流")}
                        value="人際交流"
                      />
                      人際交流
                    </li>
                    <li>
                      <input
                        type="checkbox"
                        onChange={storyType.onChange}
                        checked={storyType.checkedValues.includes("生命經歷")}
                        value="生命經歷"
                      />
                      生命經歷
                    </li>
                    <li>
                      <input
                        type="checkbox"
                        onChange={storyType.onChange}
                        checked={storyType.checkedValues.includes("職場發展")}
                        value="職場發展"
                      />
                      職場發展
                    </li>
                  </ul>
                </EditTypesInput>
              </EditCategories>
              <EditCategories>
                <EditTitle>故事對象</EditTitle>
                <EditTypesInput>
                  <ul>
                    <li>
                      <input
                        type="checkbox"
                        onChange={storyFigure.onChange}
                        checked={storyFigure.checkedValues.includes("親人")}
                        value="親人"
                      />
                      親人
                    </li>
                    <li>
                      <input
                        type="checkbox"
                        onChange={storyFigure.onChange}
                        checked={storyFigure.checkedValues.includes("伴侶")}
                        value="伴侶"
                      />
                      伴侶
                    </li>
                    <li>
                      <input
                        type="checkbox"
                        onChange={storyFigure.onChange}
                        checked={storyFigure.checkedValues.includes("朋友")}
                        value="朋友"
                      />
                      朋友
                    </li>
                    <li>
                      <input
                        type="checkbox"
                        onChange={storyFigure.onChange}
                        checked={storyFigure.checkedValues.includes("關係人")}
                        value="關係人"
                      />
                      關係人
                    </li>
                    <li>
                      <input
                        type="checkbox"
                        onChange={storyFigure.onChange}
                        checked={storyFigure.checkedValues.includes("陌生人")}
                        value="陌生人"
                      />
                      陌生人
                    </li>
                    <li>
                      <input
                        type="checkbox"
                        onChange={storyFigure.onChange}
                        checked={storyFigure.checkedValues.includes("那個他")}
                        value="那個他"
                      />
                      那個他
                    </li>
                    <li>
                      <input
                        type="checkbox"
                        onChange={storyFigure.onChange}
                        checked={storyFigure.checkedValues.includes("內在自我")}
                        value="內在自我"
                      />
                      內在自我
                    </li>
                  </ul>
                </EditTypesInput>
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
                <button onClick={handleSubmit}>儲存內容</button>
                <button type="button" onClick={deleteStory}>
                  刪除文章
                </button>
                <button type="button" onClick={handleBackToPreview}>
                  預覽文章
                </button>
                <button onClick={backPreviewPage}>回到上一頁</button>
              </ButtonSection>
            </form>
          </EditSections>
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
    </Background>
  );
}
