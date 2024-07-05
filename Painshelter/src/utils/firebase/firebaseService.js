import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { db, auth } from "../../utils/firebase/firebase.jsx";

import { toastAlert } from "@/utils/toast.js";
("react-toastify/dist/ReactToastify.css");

//Get the spacific post data from firebase collection
export const getFirebaseSpecificPost = async (field, value) => {
  try {
    const postsData = collection(db, "posts");
    const q = query(postsData, where(field, "==", value));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      const commentsWithNames =
        data.userComments && Array.isArray(data.userComments)
          ? await Promise.all(
              data.userComments.map(async (comment) => {
                const userRef = doc(db, "users", comment.id);
                const userSnap = await getDoc(userRef);
                return userSnap.exists()
                  ? {
                      comment: comment.comment,
                      name: userSnap.data().name,
                      img: userSnap.data().profileImg,
                      id: comment.id,
                    }
                  : comment;
              })
            )
          : [];

      return { ...data, commentsWithNames };
    } else {
      return null;
    }
  } catch (e) {
    toastAlert("error", e, 2000);
    return null;
  }
};

//Get all the Posts data from firebase collection
export const getFirebasePosts = async (field, value) => {
  try {
    const postsData = collection(db, "posts");
    const q = query(postsData, where(field, "==", value));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs.map((doc) => doc.data());
      return data;
    } else {
      return [];
    }
  } catch (e) {
    toastAlert("error", e, 2000);
    return [];
  }
};

//Get all the Posts data from firebase collection
async function fetchData(collectionName, dataMapper, dataSetters) {
  try {
    const data = collection(db, collectionName);
    const q = query(data);
    const querySnapshot = await getDocs(q);
    const mappedData = dataMapper(querySnapshot.docs);
    dataSetters.forEach((setter, index) => {
      setter(mappedData[index]);
    });
  } catch (e) {
    toastAlert("error", e, 2000);
  }
}

export default fetchData;

//Get all Posts data from firebase collection
export const getAllFirebasePosts = async () => {
  try {
    const postsData = collection(db, "posts");
    const q = query(postsData);
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs.map((doc) => doc.data());
      return data;
    } else {
      return [];
    }
  } catch (e) {
    toastAlert("error", e, 2000);
  }
};

//Get Snapshot data from firebase collection
export const getSnapshotPostsData = (id, setStories) => {
  const q = query(collection(db, "posts"), where("userId", "==", id));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
  });
  return unsubscribe;
};

//Get all Users data from firebase collection
export const getFirebaseUsers = async (field, value) => {
  try {
    const usersData = collection(db, "users");
    const q = query(usersData, where(field, "==", value));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      return data;
    }
  } catch (e) {
    toastAlert("error", e, 2000);
    return null;
  }
};

export const getVisitUserData = async (id, setAuthor) => {
  try {
    const authorData = collection(db, "users");
    const q = query(authorData, where("id", "==", id));
    const querySnapshot = await getDocs(q);
    const authorList = querySnapshot.docs.map((doc) => ({
      id: doc.data().id,
      name: doc.data().name,
      img: doc.data().profileImg,
    }));

    setAuthor(authorList);
  } catch (e) {
    toastAlert("error", e, 2000);
  }
};

//Get user id to check the name from firebase collection
export const getAuthorsByIds = async (authorIds) => {
  try {
    const authorData = collection(db, "users");
    const promises = authorIds.map((authorId) => {
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
    return authorNamesList;
  } catch (e) {
    toastAlert("error", e, 2000);
    return [];
  }
};

//Get author joined data
export const getAuthorJoinedDate = () => {
  const user = auth.currentUser;
  if (user) {
    const creationTime = user.metadata.creationTime;
    return creationTime;
  } else {
    return null;
  }
};

//Modified the post function
export const handleEditSubmit = async (
  event,
  value,
  storyTitle,
  storyTime,
  storyImage,
  storyType,
  storyFigure,
  postStory,
  setIsEdit
) => {
  event.preventDefault();
  const result = await Swal.fire({
    title: "確定修改故事？",
    text: "修改後將無法恢復",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#363636",
    cancelButtonColor: "#d2d2d2",
    confirmButtonText: "儲存",
    cancelButtonText: "取消",
  });

  if (result.isConfirmed) {
    try {
      const q = query(collection(db, "posts"), where("storyId", "==", value));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          title: storyTitle.value,
          time: storyTime.value,
          imgUrl: storyImage.value,
          type: storyType.getSortedCheckedValues(),
          figure: storyFigure.getSortedCheckedValues(),
          story: postStory.value,
          modifiedAt: Timestamp.fromDate(new Date()),
        });
        toast.success("成功修改故事", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setIsEdit(true);
      } else {
        toast.error("修改失敗", {
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
    } catch (error) {
      toast.error("修改失敗", {
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

//Delete the post function
export const handleDeletePost = async (id, navigate) => {
  const result = await Swal.fire({
    title: "確定刪除故事？",
    text: "刪除後將無法恢復",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#363636",
    confirmButtonText: "刪除",
  });

  if (result.isConfirmed) {
    try {
      const q = doc(db, "posts", id);
      await deleteDoc(q);
      Swal.fire({
        title: "刪除故事",
        text: "此篇故事已被刪除",
        icon: "success",
      });
      toast.success("成功刪除故事", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setTimeout(() => navigate("/history"), 2000);
    } catch (error) {
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

//Update the survey data to the firestore function
export const updateUserStressRecord = async (
  userId,
  score,
  complete,
  setIsLoading
) => {
  try {
    const q = query(collection(db, "users"), where("id", "==", userId));
    const recordArray = { time: Timestamp.fromDate(new Date()), number: score };
    const querySnapshot = await getDocs(q);

    if (complete === false) {
      return;
    } else if (complete) {
      const docRef = querySnapshot.docs[0].ref;
      setIsLoading(true);
      await updateDoc(docRef, {
        number: score,
        stressRecord: arrayUnion(recordArray),
      });
      setIsLoading(false);
    }
  } catch (e) {
    toastAlert("error", e, 2000);
  }
};

//UnFollow authors click function
export const handleUnFollow = async (authorId, navigate) => {
  const result = await Swal.fire({
    title: "確定取消追蹤？",
    text: "取消後無法恢復",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#363636",
    cancelButtonColor: "#d2d2d2",
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  });
  if (result.isConfirmed) {
    try {
      const localStorageUserId = localStorage.getItem("userId");
      const userRef = doc(db, "users", localStorageUserId);
      await updateDoc(userRef, {
        followAuthor: arrayRemove(authorId),
      });
      Swal.fire({
        title: "取消追蹤!",
        text: "此作者已取消追蹤",
        icon: "success",
      });
      navigate("/history");
    } catch (error) {
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

//Uplaod the profile image to the firebase collection
export const updateProfileImage = async (userId, imageUrl) => {
  if (imageUrl) {
    try {
      const q = query(collection(db, "users"), where("id", "==", userId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          profileImg: imageUrl,
        });
      } else {
        return null;
      }
    } catch (e) {
      toastAlert("error", e, 2000);
    }
  }
};

//Submit the post to Firebase
export const handleSubmitPost = async (
  event,
  storyTitle,
  storyTime,
  storyLocation,
  selectedTypes,
  selectedFigure,
  showImg,
  postStory,
  localStorageUserId,
  navigate
) => {
  event.preventDefault();
  const result = await Swal.fire({
    title: "確定提交故事?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#363636",
    cancelButtonColor: "#d2d2d2",
    confirmButtonText: "提交",
    cancelButtonText: "取消",
  });
  if (result.isConfirmed) {
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        title: storyTitle.value,
        time: storyTime.value,
        location: storyLocation,
        type: selectedTypes,
        figure: selectedFigure,
        imgUrl: showImg,
        story: postStory.value,
        userId: localStorageUserId,
        createdAt: Timestamp.fromDate(new Date()),
      });
      await updateDoc(docRef, { storyId: docRef.id });
      toast.success("成功提交：" + storyTitle.value + "故事", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setTimeout(() => {
        navigate("/history");
      }, 1000);
    } catch (error) {
      toast.error("投稿失敗", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      navigate("/post");
    }
  }
};

export const submitComment = async (event, storyId, setStories) => {
  event.preventDefault();
  const commentContent = event.target.replySelect.value;
  const localStorageUserId = window.localStorage.getItem("userId");
  const replyArray = { id: localStorageUserId, comment: commentContent };

  try {
    const q = query(collection(db, "posts"), where("storyId", "==", storyId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      const docData = querySnapshot.docs[0].data();
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
      setStories((prev) =>
        prev.map((story) => {
          if (story.storyId === storyId) {
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
    }
  } catch (e) {
    toastAlert("error", e, 2000);
  }
};

export const submitLike = async (id, localStorageUserId, setStories) => {
  try {
    const q = query(collection(db, "posts"), where("storyId", "==", id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      const docData = querySnapshot.docs[0].data();

      if (
        docData.likedAuthorId &&
        docData.likedAuthorId.includes(localStorageUserId)
      ) {
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
        likedAuthorId: arrayUnion(localStorageUserId),
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

      setStories((prev) =>
        prev.map((story) => {
          if (story.storyId === id) {
            const updatedStory = {
              ...story,
              likedAuthorId: docData.likedAuthorId
                ? [...docData.likedAuthorId, localStorageUserId]
                : [localStorageUserId],
            };
            return updatedStory;
          }
          return story;
        })
      );
    }
  } catch (e) {
    toastAlert("error", e, 2000);
  }
};

export const submitFollowAuthor = async (
  localStorageUserId,
  id,
  setIsFollow
) => {
  try {
    const q = query(
      collection(db, "users"),
      where("id", "==", localStorageUserId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      const docData = querySnapshot.docs[0].data();
      if (docData.followAuthor && docData.followAuthor.includes(id)) {
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
        followAuthor: arrayUnion(id),
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
    toastAlert("error", e, 2000);
  }
};
