import {
  VoucherCreateBody,
  VoucherUpdateBody,
  Voucher,
  VoucherWithStatus,
  VouchersParamsType,
} from "database";
import { createInstance } from "./base";
const instance = createInstance("vouchers");
export async function getVouchers(
  params?: VouchersParamsType
): Promise<VoucherWithStatus[]> {
  const res = await instance.get("/", { params });
  console.log("Params", params);
  return res.data;
}

export async function getVoucher(
  id: string | number
): Promise<VoucherWithStatus> {
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
