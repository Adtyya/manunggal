import { api } from "@/utils/axios";

export const getTickets = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(
      `/sales-order?page=${query.page}&perPage=10&search=${query.search}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getSalesOrderById = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(`/sales-order/${query.id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getSalesContractById = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(`/sales-contract/${query.id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const deleteSalesOrder = async (id) => {
  try {
    const res = await api.delete(`/sales-order/${id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getAgentBySearch = async (query) => {
  try {
    const res = await api.get(`/agent?page=1&perPage=25&search=${query}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getCustomerBySearch = async (query) => {
  try {
    const res = await api.get(`/customer?page=1&perPage=25&search=${query}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getSOBySearch = async (query) => {
  try {
    const res = await api.get(`/sales-order?page=1&perPage=25&search=${query}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getSalesContractBySearch = async (query) => {
  try {
    const res = await api.get(
      `/sales-contract?page=1&perPage=25&search=${query}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getAgentById = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(`/agent/${query.id}`);
    return res.data;
  } catch (error) {
    return;
  }
};

export const getProductBySearch = async (query) => {
  try {
    const res = await api.get(`/product?page=1&perPage=25&search=${query}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getAllAgent = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(
      `/customer?page=${query.page}&perPage=10&search=${query.search}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getAllSalesOrder = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(
      `/sales-order?page=${query.page}&perPage=10&search=${query.search}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getAllSalesContract = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(
      `/sales-contract?page=${query.page}&perPage=10&search=${query.search}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getAllProduct = async ({ queryKey }) => {
  try {
    const [key, query] = queryKey;
    const res = await api.get(
      `/product?page=${query.page}&perPage=10&search=${query.search}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};
