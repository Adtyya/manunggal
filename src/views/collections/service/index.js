import { api } from "@/utils/axios";

export const getCollections = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(
      `/collection?page=${query.page}&perPage=10&search=${query.search}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getCollectionsById = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(`/collection/${query.id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const deleteCollectionsById = async (id) => {
  try {
    const res = await api.delete(`/collection/${id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};
