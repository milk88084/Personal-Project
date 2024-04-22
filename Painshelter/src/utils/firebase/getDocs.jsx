const getFirestoreData = {
  async getProducts(category, paging) {
    const response = await fetch(
      `${this.backEndHostname}/products/${category}?paging=${paging}`
    );
    return await response.json();
  },

  async getCampaigns() {
    const response = await fetch(`${this.hostname}/marketing/campaigns`);
    return await response.json();
  },
  async function getStories() {
    try {
      const postsData = collection(db, "posts");
      const q = query(
        postsData,
        where("userId", "==", localStorageUserId),
        limit(6)
      );

      const querySnapshot = await getDocs(q);
      const userStoryList = querySnapshot.docs.map((doc) => ({
        title: doc.data().title,
        time: doc.data().time,
        location: doc.data().location,
        type: doc.data().type,
        figure: doc.data().figure,
        story: doc.data().story,
        userComments: doc.data().userComments,
        likedAuthorId: doc.data().likedAuthorId,
        storyId: doc.data().storyId,
      }));
      setStories(userStoryList);
    } catch (e) {
      console.log(e);
    }
  }
};

export default getFirestoreData;
