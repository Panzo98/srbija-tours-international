import axios from "axios";
import { checkRoute, getCsrfToken } from "../api/AuthService";

const axiosInstance = axios.create({
  baseURL: "https://drivesoft-srbijatours.com/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-CSRF-Token": getCsrfToken(),
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      console.log("Pozivanje checkRoute pre svakog zahteva");
      await checkRoute();
      return config;
    } catch (error) {
      console.error("Greška u checkRoute:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
