import { api } from "@/utils/axios";

export const getProducts = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(
      `/product?page=${query.page}&perPage=10&search=${query.search}&stock=${query.stock}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getProductsById = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(`/product/${query.id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const deleteProductsById = async (id) => {
  try {
    const res = await api.delete(`/product/${id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getProCategories = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(
      `/product-category?page=${query?.page || 1}&perPage=${query?.limit || 10}&search=${query?.search || ""}&stock=${query?.stock || ""}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getProVariant = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(
      `/variant?page=${query?.page || 1}&perPage=${query?.limit || 10}&search=${query?.search || ""}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};