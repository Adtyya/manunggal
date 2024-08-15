import { create } from "zustand";

const userUser = create((set) => ({
  modalDelete: false,
  modalDescription: false,
  listTreatment: [],
  currentPage: 1,
  search: "",
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
}));

export default userUser;
