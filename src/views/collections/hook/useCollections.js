import { create } from "zustand";

const useCollection = create((set) => ({
  modalDelete: false,
  listCollections: [],
  currentPage: 1,
  search: "",
  success: false,
  edit: false,
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
  setDelete: (value) => {
    set(() => ({ delete: value }));
  },
}));

export default useCollection;
