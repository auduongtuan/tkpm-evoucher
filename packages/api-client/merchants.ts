import {
  MerchantCreateBody,
  MerchantUpdateBody,
} from "database/schema/merchants";
import {
  Merchant,
  Store,
  Employee,
  Campaign,
  StoreWithCategories,
  CategoryWithStores,
  FullMerchant,
} from "database";
import { createInstance } from "./base";
const instance = createInstance("merchants");
export async function getMerchants(): Promise<
  Array<Merchant & { stores: StoreWithCategories[]; employees: Employee[] }>
> {
  const res = await instance.get("/");

  return res.data;
}
export async function getMerchantCategories(
  id: string | number
): Promise<CategoryWithStores[]> {
  const res = await instance.get(`/${id}/categories`);
  return res.data;
}

export async function getMerchantEmployees(
  id: string | number
): Promise<Employee[]> {
  const res = await instance.get(`/${id}/employees`);
  return res.data;
}

export async function getMerchantCampaigns(
  id: string | number
): Promise<Campaign[]> {
  const res = await instance.get(`/${id}/campaigns`);
  return res.data;
}

export async function getMerchant(id: string | number): Promise<Merchant> {
  const res = await instance.get(`/${id}`);
  return res.data;
}

export async function getFullMerchant(
  id: string | number
): Promise<FullMerchant> {
  const res = await instance.get(`/${id}/full`);
  return res.data;
}

export async function createMerchant(
  body: MerchantCreateBody
): Promise<Merchant> {
  const res = await instance.post("/", { ...body });

  return res.data;
}

export async function updateMerchant(
  id: number,
  body: MerchantUpdateBody
): Promise<Merchant> {
  const res = await instance.put(`/${id}`, { ...body });

  return res.data;
}

export async function deleteMerchant(id: number) {
  const res = await instance.delete(`/${id}`);
  return res.data;
}
