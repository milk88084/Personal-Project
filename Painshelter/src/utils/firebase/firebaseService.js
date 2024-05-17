import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.jsx";

export const getFirebasePosts = async (field, value) => {
  try {
    const postsData = collection(db, "posts");
    const q = query(postsData, where(field, "==", value));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      const commentsWithNames = await Promise.all(
        data.userComments.map(async (comment) => {
          const userRef = doc(db, "users", comment.id);
          const userSnap = await getDoc(userRef);
          return userSnap.exists()
            ? {
                comment: comment.comment,
                name: userSnap.data().name,
                img: userSnap.data().profileImg,
              }
            : comment;
        })
      );
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
