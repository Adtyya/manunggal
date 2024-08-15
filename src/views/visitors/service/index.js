import { api } from "@/utils/axios";

export const getVisitors = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(
      `/visit?page=${query.page}&perPage=10&search=${query.search}&visitDate=${query.visitDate}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getVisitorsById = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(`/visit/${query.id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const deleteVisitorsById = async (id) => {
  try {
    const res = await api.delete(`/visit/${id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};
