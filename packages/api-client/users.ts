import { UserCreateBody, UserUpdateBody } from "database/schema/users";
import { User } from "database";
import { createInstance } from "./base";
const instance = createInstance("users");
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
export async function loginUser(email: string, password: string) {
  const res = await instance.post("/auth/login", { email, password });
  return res.data;
}
export async function getUserAuth() {
  const customInstance = createInstance("users", "USER");
  if (localStorage.getItem("USER_TOKEN")) {
    const res = await customInstance.get("/auth");
    return res.data;
  } else {
    return null;
  }
  // if (customInstance.defaults.headers.common["Authorization"]) {
  // } else {
  //   return null;
  // }
}
