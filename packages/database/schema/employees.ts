import { Static, Type } from "@sinclair/typebox";

export const EmployeeCreateSchema = Type.Object({
  email: Type.String({ format: "email", minLength: 1 }),
  phone: Type.String({ minLength: 1 }),
  fullName: Type.String({ minLength: 1 }),
  password: Type.String({ minLength: 1 }),
  systemAdmin: Type.Optional(Type.Boolean()),
  merchantId: Type.Optional(Type.Integer()),
});

export const EmployeeLoginSchema = Type.Object({
  email: Type.String({ format: "email", minLength: 1 }),
  password: Type.String({ minLength: 1 }),
});
export const EmployeeUpdateSchema = Type.Partial(EmployeeCreateSchema);

export type EmployeeCreateBody = Static<typeof EmployeeCreateSchema>;
export type EmployeeUpdateBody = Static<typeof EmployeeUpdateSchema>;
export type EmployeeLoginBody = Static<typeof EmployeeLoginSchema>;
