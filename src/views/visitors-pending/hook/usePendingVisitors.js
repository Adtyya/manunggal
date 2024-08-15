import { create } from "zustand";

const usePendingVisitor = create((set) => ({
  modalDelete: false,
  modalDetail: false,
  modalFollowUp: false,
  listVisitors: [],
  currentPage: 1,
  search: "",
  visitDate: "",
  success: false,
  edit: false,
  delete: false,
  followUp: false,
  setModalDelete: (value) => {
    set(() => ({ modalDelete: value }));
  },
  setModalDetail: (value) => {
    set(() => ({ modalDetail: value }));
  },
  setModalFollowUp: (value) => {
    set(() => ({ modalFollowUp: value }));
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
  setFollowUp: (value) => {
    set(() => ({ followUp: value }));
  },
}));

export default usePendingVisitor;
