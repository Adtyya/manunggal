import { api } from "@/utils/axios";

export const getVariants = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(
      `/variant?page=${query.page}&perPage=10&search=${query.search}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getVariantsById = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(`/variant/${query.id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const deleteVariantsById = async (id) => {
  try {
    const res = await api.delete(`/variant/${id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};