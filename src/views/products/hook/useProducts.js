import { create } from "zustand";

const useProduct = create((set) => ({
  modalDelete: false,
  modalDescription: false,
  modalCategory: false,
  listProducts: [],
  currentPage: 1,
  search: "",
  stock: "",
  success: false,
  edit: false,
  delete: false,
  setModalDelete: (value) => {
    set(() => ({ modalDelete: value }));
  },
  setModalDescription: (value) => {
    set(() => ({ modalDescription: value }));
  },
  setModalCategory: (value) => {
    set(() => ({ modalCategory: value }));
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
  setStock: (value) => {
    set(() => ({ stock: value }));
  },
}));

export default useProduct;
