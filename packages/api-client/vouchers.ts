import {
  VoucherCreateBody,
  VoucherUpdateBody,
  Voucher,
  DetailVoucher,
} from "database";
import { createInstance } from "./base";
const instance = createInstance("vouchers");
export async function getVouchers(): Promise<DetailVoucher[]> {
  const res = await instance.get("/");

  return res.data;
}

export async function getVoucher(id: string | number): Promise<DetailVoucher> {
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
