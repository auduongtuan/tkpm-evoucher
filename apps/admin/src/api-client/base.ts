import axios from "axios";
import { END_POINT } from "./constants";
export function createInstance(name: string) {
  const instance = axios.create({
    baseURL: END_POINT + "/" + name,
  });
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return instance;
}
