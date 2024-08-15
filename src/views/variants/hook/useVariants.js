import { create } from "zustand";

const useProduct = create((set) => ({
  modalDelete: false,
  listProducts: [],
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

export default useProduct;
