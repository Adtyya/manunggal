import { create } from "zustand";

const useTicket = create((set) => ({
  modalDelete: false,
  listBanners: [],
  currentPage: 1,
  search: "",
  success: false,
  edit: false,
  replace: false,
  delete: false,
  setModalDelete: (value) => {
    set(() => ({ modalDelete: value }));
  },
  setCurrentPage: (value) => {
    set(() => ({ currentPage: value }));
  },
  setSearch: (value) => {
    set(() => ({
      search: value,
    }));
  },
  setSuccess: (value) => {
    set(() => ({ success: value }));
  },
  setEdit: (value) => {
    set(() => ({ edit: value }));
  },
  setReplace: (value) => {
    set(() => ({ replace: value }));
  },
  setDelete: (value) => {
    set(() => ({ delete: value }));
  },
}));

export default useTicket;
