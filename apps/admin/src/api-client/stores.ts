import { StoreCreateBody, StoreUpdateBody } from "./../../../api/schema/stores";
import { Category, Store } from "database";
import { createInstance } from "./base";
const instance = createInstance("stores");
export async function getStores(): Promise<
  Array<Store & { categories: Category[] }>
> {
  const res = await instance.get("/");

  return res.data;
}

export async function createStore(
  body: StoreCreateBody
): Promise<Store & { categories: Category[] }> {
  const res = await instance.post("/", { ...body });

  return res.data;
}

export async function getStore(
  id: string | number
): Promise<Store & { categories: Category[] }> {
  const res = await instance.get(`/${id}`);
  return res.data;
}

export async function updateStore(
  id: number,
  body: StoreUpdateBody
): Promise<Store & { categories: Category[] }> {
  const res = await instance.put(`/${id}`, { ...body });
  return res.data;
}

export async function deleteStore(id: number) {
  const res = await instance.delete(`/${id}`);
  return res.data;
}
