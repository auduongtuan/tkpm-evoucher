import { StaffCreateBody, StaffUpdateBody } from "../../../api/schema/staffs";
import { Staff } from "database";
import axios from "axios";
import { END_POINT } from "./constants";
const instance = axios.create({
  baseURL: END_POINT + "/staffs",
});
export async function getStaffs(): Promise<Staff[]> {
  const res = await instance.get("/");

  return res.data;
}

export async function getStaff(id: string | number): Promise<Staff> {
  const res = await instance.get(`/${id}`);
  return res.data;
}

export async function createStaff(body: StaffCreateBody): Promise<Staff> {
  const res = await instance.post("/", { ...body });

  return res.data;
}

export async function updateStaff(
  id: number,
  body: StaffUpdateBody
): Promise<Staff> {
  const res = await instance.put(`/${id}`, { ...body });

  return res.data;
}

export async function deleteStaff(id: number) {
  const res = await instance.delete(`/${id}`);
  return res.data;
}
