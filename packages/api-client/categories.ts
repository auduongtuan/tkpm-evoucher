import {
  CategoryCreateBody,
  CategoryUpdateBody,
} from "database/schema/categories";
import { Category } from "database";
import { createInstance } from "./base";
const instance = createInstance("categories");
export async function getCategories(): Promise<Category[]> {
  const res = await instance.get("/");

  return res.data;
}

export async function getCategory(id: string | number): Promise<Category> {
  const res = await instance.get(`/${id}`);
  return res.data;
}

export async function createCategory(
  body: CategoryCreateBody
): Promise<Category> {
  const res = await instance.post("/", { ...body });

  return res.data;
}

export async function updateCategory(
  id: number,
  body: CategoryUpdateBody
): Promise<Category> {
  const res = await instance.put(`/${id}`, { ...body });

  return res.data;
}

export async function deleteCategory(id: number) {
  const res = await instance.delete(`/${id}`);
  return res.data;
}
