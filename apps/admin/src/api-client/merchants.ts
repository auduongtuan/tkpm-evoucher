import {
  MerchantCreateBody,
  MerchantUpdateBody,
} from "../../../api/schema/merchants";
import { Merchant } from "database";
import axios from "axios";
import { END_POINT } from "./constants";
const instance = axios.create({
  baseURL: END_POINT + "/merchants",
});
export async function getMerchants(): Promise<Merchant[]> {
  const res = await instance.get("/");

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