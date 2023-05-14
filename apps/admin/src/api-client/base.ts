import axios from "axios";
import { END_POINT } from "./constants";
export function createInstance(name: string) {
  return axios.create({
    baseURL: END_POINT + "/" + name,
    headers: {
      common: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });
}
