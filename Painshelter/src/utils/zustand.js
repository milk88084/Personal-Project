import { create } from "zustand";

export const loginState = create((set, get) => ({
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
}));
