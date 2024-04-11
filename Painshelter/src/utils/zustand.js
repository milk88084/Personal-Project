import { create } from "zustand";

export const usePageState = create((set, get) => ({
  status: "login",
  showRegisterPage: false,
  show: () => set({ showRegisterPage: true }),
  hide: () => set({ showRegisterPage: false }),
  goRegister: () => set({ status: "register" }),
  goLogin: () => set({ status: "login" }),
  getPageState: () => get().showRegisterPage,
  getStatusState: () => get().status,
}));

export const loginState = create((set, get) => ({
  loginStatus: false,
  getLoginStatus: () => get().loginStatus,
  online: () => set({ loginStatus: true }),
  offline: () => set({ loginStatus: false }),
}));
