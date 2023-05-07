import axios from "axios";
import { Staff } from "database";
import { END_POINT } from "./constants";
const instance = axios.create({
  baseURL: END_POINT + "/staffs",
});
export async function getStaffs(): Promise<Staff[]> {
  const res = await instance.get("/");

  return res.data;
}
