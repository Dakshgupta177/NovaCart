import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL:  "https://novacart-bnwg.onrender.com",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error:", error.response || error.message || error);
    switch(error.response?.status) {
      case 403:
        toast.error("Access denied");
        break;

      case 404:
        toast.error("Resource not found");
        break;

      case 429:
        toast.error("Too many requests !! Wait for 30 seconds.");
        break;

      case 500:
        toast.error("Server error");
        break;
    }

    return Promise.reject(error);
  }
);

export default api;