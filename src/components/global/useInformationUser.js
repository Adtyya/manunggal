import { create } from "zustand";

const useInformationUser = create((set) => ({
  role: null,
  all: null,
  setRole: (state) => {
    set(() => ({ role: state }));
  },
  setAll: (state) => {
    set(() => ({ all: state }));
  },
}));

export default useInformationUser;
