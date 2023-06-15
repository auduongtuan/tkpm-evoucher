import axios from "axios";
import { END_POINT } from "./constants";
export function createInstance(
  name: string,
  tokenRole: "EMPLOYEE" | "USER" | "EITHER" = "EITHER"
) {
  const instance = axios.create({
    baseURL: END_POINT + "/" + name,
  });
  instance.interceptors.request.use(
    (config) => {
      if (tokenRole == "EITHER") {
        const employeeToken = localStorage.getItem(`EMPLOYEE_TOKEN`);
        const userToken = localStorage.getItem("USER_TOKEN");
        if (employeeToken) {
          config.headers.Authorization = `Bearer ${employeeToken}`;
        } else if (userToken) {
          config.headers.Authorization = `Bearer ${userToken}`;
        }
      } else {
        const token = localStorage.getItem(`${tokenRole}_TOKEN`);
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
