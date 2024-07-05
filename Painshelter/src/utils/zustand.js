import { create } from "zustand";

export const useLoginState = create((set) => ({
  //Login status
  loginStatus: false,
  online: () => set({ loginStatus: true }),
  offline: () => set({ loginStatus: false }),
  //Login user name
  loginUserName: "",
  //userId
  loginUserId: "",
  setLoginUserId: (id) => set({ loginUserId: id }),
  logout: () => set({ loginUserId: "" }),
  //other author post like
  postLikeNumber: "",
  setPostLikeNumber: (number) => set({ postLikeNumber: number }),
  //locationSearch
  locationSearch: [],
  setLocationSearch: (data) => set({ locationSearch: data }),
  //modal
  modal: false,
  showModal: () => set({ modal: true }),
  closeModal: () => set({ modal: false }),
}));

export const modifiedData = create((set) => ({
  selectedStoryId: "",
  setSelectedStoryId: (id) => set({ selectedStoryId: id }),
}));

export const useAuthorfieldData = create((set) => ({
  selectedStoryId: "",
  setSelectedStoryId: (id) => set({ selectedStoryId: id }),
}));

export const HistoryModal = create((set) => ({
  modal: true,
  showModal: () => set({ modal: true }),
  closeModal: () => set({ modal: false }),
}));

export const MainModal = create((set) => ({
  modal: true,
  showModal: () => set({ modal: true }),
  closeModal: () => set({ modal: false }),
}));

export const useHelpModal = create((set) => ({
  modal: false,
  showModal: () => set({ modal: true }),
  closeModal: () => set({ modal: false }),
}));

export const useLyric = create((set) => ({
  title: "",
  searchStatus: false,
  setTitle: (title) => set({ title }),
  setStatus: () => set({ searchStatus: true }),
  setStatusfalse: () => set({ searchStatus: false }),
}));
