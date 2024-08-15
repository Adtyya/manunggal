import { api } from "@/utils/axios";

export const getBanners = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(
      `/banner?page=${query.page}&perPage=10&search=${query.search}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getBannersAvailable = async () => {
  try {
    const res = await api.get(`/banner/available`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getBannersById = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(`/banner/${query.id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const deleteBannersById = async (id) => {
  try {
    const res = await api.delete(`/banner/${id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};
