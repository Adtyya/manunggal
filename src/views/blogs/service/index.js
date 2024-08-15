import { api } from "@/utils/axios";

export const getBlogs = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(
      `/blog?page=${query.page}&perPage=10&search=${query.search}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getBlogsById = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(`/blog/${query.id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const deleteBlogsById = async (id) => {
  try {
    const res = await api.delete(`/blog/${id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};
