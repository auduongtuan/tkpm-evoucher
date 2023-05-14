import {
  VoucherCreateBody,
  VoucherUpdateBody,
} from "../../../api/schema/vouchers";
import { Voucher } from "database";
import axios from "axios";
import { END_POINT } from "./constants";
const instance = axios.create({
  baseURL: END_POINT + "/vouchers",
});
export async function getVouchers(): Promise<Voucher[]> {
  const res = await instance.get("/");

  return res.data;
}

export async function getVoucher(id: string | number): Promise<Voucher> {
  const res = await instance.get(`/${id}`);
  return res.data;
}

export async function createVoucher(body: VoucherCreateBody): Promise<Voucher> {
  const res = await instance.post("/", { ...body });

  return res.data;
}

export async function updateVoucher(
  id: number,
  body: VoucherUpdateBody
): Promise<Voucher> {
  const res = await instance.put(`/${id}`, { ...body });

  return res.data;
}

export async function deleteVoucher(id: number) {
  const res = await instance.delete(`/${id}`);
  return res.data;
}
