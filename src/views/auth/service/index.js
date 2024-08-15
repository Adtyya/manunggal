import { api } from "../../../utils/axios";

export const signin = async (credentials) => {
  try {
    const res = await api.post("/auth/login", credentials);
    return res.data;
  } catch (error) {
    return error;
  }
};
