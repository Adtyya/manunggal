import { api } from "@/utils/axios";

export const getUsers = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(
      `/user?page=${query.page}&perPage=10&search=${query.search}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getUserById = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(`/user/${query.id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const deleteUserById = async (id) => {
  try {
    const res = await api.delete(`/user/${id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};
