import Axios from "axios";
import { toast } from "react-toastify";

import { cleanTokenKey, getToken } from "../context/Auth";

const defaultErrorMessage = "Something went wrong, please try again.";

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
    toast.error(
      error.response ? error.response.data.message : defaultErrorMessage
    );

    if (error.response?.status === 401) {
      cleanTokenKey();
    }
    throw error;
  }
);

export default api;
