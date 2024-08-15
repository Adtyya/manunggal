import { create } from "zustand";

const useProduct = create((set) => ({
  modalDelete: false,
  modalDetail: false,
  modalAddProduct: false,
  modalEditProduct: false,
  modalPaid: false,
  listOrders: [],
  currentPage: 1,
  search: "",
  status: "",
  success: false,
  edit: false,
  delete: false,
  paid: false,
  setModalDelete: (value) => {
    set(() => ({ modalDelete: value }));
  },
  setModalDetail: (value) => {
    set(() => ({ modalDetail: value }));
  },
  setModalAddProduct: (value) => {
    set(() => ({ modalAddProduct: value }));
  },
  setModalEditProduct: (value) => {
    set(() => ({ modalEditProduct: value }));
  },
  setModalPaid: (value) => {
    set(() => ({ modalPaid: value }));
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
  setPaid: (value) => {
    set(() => ({ paid: value }));
  },
}));

export default useProduct;
