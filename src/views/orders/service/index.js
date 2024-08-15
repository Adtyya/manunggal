import { api } from "@/utils/axios";

export const getOrders = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(
      `/order?page=${query.page}&perPage=10&search=${query?.search || ""}&status=${query?.status || ""}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getOrdersById = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(`/order/${query.id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const deleteOrdersById = async (id) => {
  try {
    const res = await api.delete(`/order/${id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getAvailableProducts = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(
      `/product?page=${query?.page || 1}&perPage=${query?.limit || 10}&search=${query?.search || ""}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};