import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.jsx";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Get all the data from firebase collection
export const getFirebasePosts = async (field, value) => {
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
