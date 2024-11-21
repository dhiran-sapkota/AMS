import axios from "axios";
import Cookies from "js-cookie";

const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL: `${baseURL}/api`,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${Cookies.get("Authorization")}`,
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    // TODO: need to implement refresh token logic
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      Cookies.remove("Authorization");
      localStorage.clear();
      location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
