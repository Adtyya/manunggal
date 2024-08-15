import { create } from "zustand";

const useVisitor = create((set) => ({
  modalDelete: false,
  modalDetail: false,
  listVisitors: [],
  currentPage: 1,
  search: "",
  visitDate: "",
  success: false,
  edit: false,
  delete: false,
  setModalDelete: (value) => {
    set(() => ({ modalDelete: value }));
  },
  setModalDetail: (value) => {
    set(() => ({ modalDetail: value }));
  },
  setCurrentPage: (value) => {
    set(() => ({ currentPage: value }));
  },
  setSearch: (value) => {
    set(() => ({
      search: value,
    }));
  },
  setVisitDate: (value) => {
    set(() => ({
      visitDate: value,
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

export default useVisitor;
