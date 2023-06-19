import { PaginationQueryType } from "database/schema/pagination";
import { StoreCreateBody, StoreUpdateBody, StoresParamsType } from "database";
import {
  Campaign,
  Category,
  Store,
  Merchant,
  DetailStore,
  StoreWithCategories,
} from "database";
import { createInstance } from "./base";
const instance = createInstance("stores");

export async function getStores(
  params?: PaginationQueryType & StoresParamsType
): Promise<Array<DetailStore>> {
  const res = await instance.get("/", { params });

  return res.data;
}

export async function createStore(
  body: StoreCreateBody
): Promise<StoreWithCategories> {
  const res = await instance.post("/", { ...body });
  return res.data;
}

export async function getStore(id: string | number): Promise<DetailStore> {
  const res = await instance.get(`/${id}`);
  return res.data;
}

export async function updateStore(
  id: number,
  body: StoreUpdateBody
): Promise<StoreWithCategories> {
  const res = await instance.put(`/${id}`, { ...body });
  return res.data;
}

export async function deleteStore(id: number) {
  const res = await instance.delete(`/${id}`);
  return res.data;
}
