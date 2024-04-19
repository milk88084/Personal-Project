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

const VisitAuthor = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [author, setAuthor] = useState([]);
  const { closeModal } = useLoginState();
  const localStorageUserId = window.localStorage.getItem("userId");

  // console.log("這裡是這個作者的歷史文章", state.data);
  // console.log("現在登入的人是：" + localStorageUserId);

  //從firestore讀取posts資料
  useEffect(() => {
    async function getStories() {
      try {
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
        }));
        setStories(userStoryList);
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
    navigate("/");
    closeModal();
  };

  return (
    <>
      {isUserStories ? (
        <p>這是你自己的頁面</p>
      ) : (
        <p>這個作者叫做： {author[0]?.name}</p>
      )}

      {stories.map((story, index) => {
        return (
          <div
            className="bg-blue-600 text-white mt-3 "
            key={index}
            id={stories.storyId}
          >
            <p>疼痛暗號：{story.title}</p>
            <p>故事地點：{story.location.name}</p>
            <p>時間：{story.time}</p>
            <p>類型：{story.type}</p>
            <p>人物：{story.figure}</p>
            <p>內容：{story.story}</p>
            <div className="bg-yellow-300 flex justify-evenly text-black ">
              <span>
                按讚數量：
                {story.likedAuthorId?.length > 0
                  ? story.likedAuthorId.length
                  : 0}
              </span>

              <div>
                留言回覆數量：
                <span>
                  {story.userComments?.length > 0
                    ? story.userComments.length
                    : 0}
                </span>
              </div>
            </div>

            {!isUserStories ? (
              <div className="bg-white flex justify-evenly text-black ">
                <button
                  className="bg-red-300"
                  onClick={() => handleLike(story.storyId)}
                >
                  我要按讚
                </button>
                <span className="bg-red-300">我要留言</span>
                <form onSubmit={(event) => handleSubmit(event, story.storyId)}>
                  <select name="replySelect" className="bg-red-300">
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
              </div>
            ) : (
              ""
            )}
          </div>
        );
      })}
      <button onClick={handleBack}>回首頁</button>
    </>
  );
};

export default VisitAuthor;
