import Axios from "axios";
import { toast } from "react-toastify";

import { getToken } from "../context/Auth";

const api = Axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = getToken();
  if (token) {
    config!.headers!.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      toast.error(error.response.data.message);
    }
    throw error;
  }
);

export default api;
