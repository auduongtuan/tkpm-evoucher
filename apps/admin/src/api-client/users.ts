import { UserCreateBody, UserUpdateBody } from "../../../api/schema/users";
import { User } from "database";
import axios from "axios";
import { END_POINT } from "./constants";
const instance = axios.create({
  baseURL: END_POINT + "/users",
});
export async function getUsers(): Promise<User[]> {
  const res = await instance.get("/");

  return res.data;
}

export async function getUser(id: string | number): Promise<User> {
  const res = await instance.get(`/${id}`);
  return res.data;
}

export async function createUser(body: UserCreateBody): Promise<User> {
  const res = await instance.post("/", { ...body });

  return res.data;
}

export async function updateUser(
  id: number,
  body: UserUpdateBody
): Promise<User> {
  const res = await instance.put(`/${id}`, { ...body });

  return res.data;
}

export async function deleteUser(id: number) {
  const res = await instance.delete(`/${id}`);
  return res.data;
}
