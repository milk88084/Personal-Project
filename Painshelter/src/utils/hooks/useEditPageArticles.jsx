import { db } from "../../utils/firebase/firebase.jsx";
import { useEffect, useState } from "react";

import {
  collection,
  query,
  getDocs,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

const useEditPageArticles = (id) => {
  useEffect(() => {
    async function getStories() {
      try {
        const postsData = collection(db, "posts");
        const q = query(postsData, where("storyId", "==", id));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          return data;
          //   const commentsWithNames = await Promise.all(
          //     data.userComments.map(async (comment) => {
          //       const userRef = doc(db, "users", comment.id);
          //       const userSnap = await getDoc(userRef);
          //       return userSnap.exists()
          //         ? {
          //             comment: comment.comment,
          //             name: userSnap.data().name,
          //             img: userSnap.data().profileImg,
          //           }
          //         : comment;
          //     })
          //   );
          //   setComments(commentsWithNames);
        } else {
          console.log("No document found with the given storyId");
        }
      } catch (e) {
        console.error("Error fetching document: ", e);
      }
    }
    getStories();
  }, [db, id]);
};

export default useEditPageArticles;
