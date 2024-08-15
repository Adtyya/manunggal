import { create } from "zustand";

function getToken() {
  return localStorage.getItem("token") || null;
}

const useAuth = create((set) => ({
  accessToken: getToken(),
  setAccessToken: (state) => {
    set(() => ({ accessToken: state }));
  },
}));

export default useAuth;
