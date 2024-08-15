import { create } from "zustand";

const useArticle = create((set) => ({
  modalDelete: false,
  modalDescription: false,
  currentPage: 1,
  search: "",
  status: "",
  edit: false,
  success: false,
  delete: false,
  setModalDelete: (value) => {
    set(() => ({ modalDelete: value }));
  },
  setModalDescription: (value) => {
    set(() => ({ modalDescription: value }));
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
  setDelete: (value) => {
    set(() => ({ delete: value }));
  },
  setStatus: (value) => {
    set(() => ({ status: value }));
  },
}));

export default useArticle;
