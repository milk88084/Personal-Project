import { create } from "zustand";

export const useLoginState = create((set, get) => ({
  //Login status
  loginStatus: false,
  getLoginStatus: () => get().loginStatus,
  online: () => set({ loginStatus: true }),
  offline: () => set({ loginStatus: false }),
  //Login user name
  loginUserNAme: "",
  getLoginUserNAme: () => get().userNAme,
  //userId
  loginUserId: "",
  getLoginUserId: () => get().loginUserId,
  setLoginUserId: (id) => set({ loginUserId: id }),
  logout: () => set({ loginUserId: "" }),
  //other author post like
  postLikeNumber: "",
  getPostLikeNumber: () => get().postLikeNumber,
  setPostLikeNumber: (number) => set({ postLikeNumber: number }),
  //locationSerach
  locationSerach: [],
  setLocationSearch: (data) => set({ locationSerach: data }),
  getLocationSearch: () => get().locationSerach,

  //modal
  modal: false,
  showModal: () => set({ modal: true }),
  closeModal: () => set({ modal: false }),
  getModal: () => get().modal,
}));

export const modifiedData = create((set, get) => ({
  selectedStoryId: "",
  getSelectedStoryId: () => get().selectedStoryId,
  setSelectedStoryId: (id) => set({ selectedStoryId: id }),
}));

export const useAuthorfiedData = create((set, get) => ({
  selectedStoryId: "",
  getSelectedStoryId: () => get().selectedStoryId,
  setSelectedStoryId: (id) => set({ selectedStoryId: id }),
}));

export const HistoryModal = create((set, get) => ({
  modal: true,
  showModal: () => set({ modal: true }),
  closeModal: () => set({ modal: false }),
}));
