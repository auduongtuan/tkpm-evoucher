import { PaginationParamsType } from "./../../apps/api/schema/pagination";
import { StoreCreateBody, StoreUpdateBody } from "api/schema/stores";
import { Category, Store } from "database";
import { createInstance } from "./base";
const instance = createInstance("stores");
export async function getStores(
  params?: PaginationParamsType
): Promise<Array<Store & { categories: Category[] }>> {
  const res = await instance.get("/", { params });

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
