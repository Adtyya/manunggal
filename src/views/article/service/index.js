import { api } from "@/utils/axios";

export const getArticles = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(
      `/article?page=${query.page}&perPage=10&search=${query.search}&status=${query.status}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getArticlesById = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(`/article/${query.id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const deleteArticlesById = async (id) => {
  try {
    const res = await api.delete(`/article/${id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};
