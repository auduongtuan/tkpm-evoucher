import axios from "axios";
import { Category } from "database";
import { END_POINT } from "./constants";
const instance = axios.create({
  baseURL: END_POINT + "/categories",
});
export async function getCategories(): Promise<Category[]> {
  const res = await instance.get("/");

  return res.data;
}

export async function deleteCategory(id: number) {
  const res = await instance.delete(`/${id}`);
  return res.data;
}
