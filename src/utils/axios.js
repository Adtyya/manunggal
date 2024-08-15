import axios from "axios";

export const api = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: import.meta.env.VITE_BE_BASE_URL || "http://localhost:5000/api",
  // withCredentials: false,
});

api.interceptors.request.use(
  (cfg) => {
    const token = localStorage.getItem("token");
    if (token) {
      cfg.headers["Authorization"] = `Bearer ${token.replace(
        /^"(.*)"$/,
        "$1"
      )}`;
    }
    return cfg;
  },
  (error) => {
    return error;
  }
);

api.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
    }
    // return err;
    return err?.response;
  }
);
