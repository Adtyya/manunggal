import { api } from "@/utils/axios";

export const getSummary = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(`/report/summary/${query.filter}`);
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

export const getTicketsAvailable = async () => {
  try {
    const res = await api.get(`/ticket/available`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getChart = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(`/report/chart/${query.filter}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getMapping = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(`/report/mapping/${query.filter}`);
    return res.data;
  } catch (error) {
    return error;
  }
};
