import { Static, Type } from "@sinclair/typebox";

export const StaffCreateSchema = Type.Object({
  email: Type.String({ format: "email", minLength: 1 }),
  phone: Type.String({ minLength: 1 }),
  fullName: Type.String({ minLength: 1 }),
  password: Type.String({ minLength: 1 }),
  systemAdmin: Type.Boolean(),
  merchantId: Type.Optional(Type.Integer()),
});

export const StaffUpdateSchema = Type.Partial(StaffCreateSchema);

export type StaffCreateBody = Static<typeof StaffCreateSchema>;
export type StaffUpdateBody = Static<typeof StaffUpdateSchema>;
