import { api } from "@/utils/axios";

export const getPendingVisitors = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(
      `/pending-visit?page=${query.page}&perPage=10&search=${query.search}&visitDate=${query.visitDate}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getPendingVisitorsById = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(`/pending-visit/${query.id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const followUpPendingVisitorsById = async (id) => {
  try {
    const res = await api.post(`/payment/success/${id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const deletePendingVisitorsById = async (id) => {
  try {
    const res = await api.delete(`/pending-visit/${id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};
