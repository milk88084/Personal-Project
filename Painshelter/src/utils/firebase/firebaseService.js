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
import { db, auth } from "../../utils/firebase/firebase.jsx";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Get the spacific post data from firebase collection
export const getFirebaseSpacificPost = async (field, value) => {
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
      console.log("No document found with the given storyId");
      return null;
    }
  } catch (e) {
    console.error("Error fetching document: ", e);
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
      console.log("No documents found with the given query.");
      return [];
    }
  } catch (e) {
    console.error("Error fetching documents: ", e);
    return [];
  }
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
    console.error("Error fetching document: ", e);
    return null;
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
    console.error("Error fetching authors: ", e);
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
    cancelButtonColor: "#d33",
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
        console.error("No document found with the given storyId");
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
      console.error("Error updating document: ", error);
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
      console.log("delete");
      await deleteDoc(q);
      console.log("finish");
      Swal.fire({
        title: "刪除故事",
        text: "此篇故事已被刪除",
        icon: "success",
      });
      setTimeout(() => navigate("/history"), 2000);
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
  } else {
    console.log("取消刪除動作");
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
  } catch (error) {
    console.error("Error updating document: ", error);
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
        followAuthor: arrayRemove(authorId),
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
        console.log("No user found with the given ID.");
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  } else {
    console.log("Image URL is empty.");
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
    cancelButtonColor: "#d33",
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
      await updateDoc(docRef, { storyId: docRef.id, imgUrl: showImg });
      console.log("Document written with ID: ", docRef.id);
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
      console.error("Error adding document: ", error);
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
