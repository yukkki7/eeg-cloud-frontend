import { create } from "zustand";

interface UserInfo {
  firstName: string;
  lastName: string;
  birthDate: string; // 格式 "YYYY-MM-DD"
  gender: "male" | "female" | "other" | "";
}

interface AppState {
  userInfo: UserInfo;
  setUserInfo: (info: Partial<UserInfo>) => void;
}

export const useStore = create<AppState>((set) => ({
  userInfo: {
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
  },
  setUserInfo: (info) =>
    set((state) => ({
      userInfo: { ...state.userInfo, ...info },
    })),
}));
