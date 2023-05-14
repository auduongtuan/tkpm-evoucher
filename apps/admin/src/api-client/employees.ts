import {
  EmployeeCreateBody,
  EmployeeUpdateBody,
} from "../../../api/schema/employees";
import { Employee } from "database";
import { createInstance } from "./base";
const instance = createInstance("employees");
export async function getEmployees(): Promise<Employee[]> {
  const res = await instance.get("/");

  return res.data;
}

export async function getEmployee(id: string | number): Promise<Employee> {
  const res = await instance.get(`/${id}`);
  return res.data;
}

export async function createEmployee(
  body: EmployeeCreateBody
): Promise<Employee> {
  const res = await instance.post("/", { ...body });

  return res.data;
}

export async function updateEmployee(
  id: number,
  body: EmployeeUpdateBody
): Promise<Employee> {
  const res = await instance.put(`/${id}`, { ...body });

  return res.data;
}

export async function deleteEmployee(id: number) {
  const res = await instance.delete(`/${id}`);
  return res.data;
}
export async function createAuthentication(email: string, password: string) {
  const res = await instance.post("/auth/login", { email, password });
  return res.data;
}
export async function getEmployeeAuth() {
  const res = await instance.get("/auth");
  return res.data;
}
