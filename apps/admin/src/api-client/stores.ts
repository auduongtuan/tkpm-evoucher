import { StoreCreateBody } from "./../../../api/schema/stores";
import axios from "axios";
import { Store } from "database";
import { END_POINT } from "./constants";
const instance = axios.create({
  baseURL: END_POINT + "/stores",
});
export async function getStores(): Promise<Store[]> {
  const res = await instance.get("/");

  return res.data;
}

export async function createStore(body: StoreCreateBody): Promise<Store> {
  const res = await instance.post("/", { ...body });

  return res.data;
}

export async function deleteStore(id: number) {
  const res = await instance.delete(`/${id}`);
  return res.data;
}
