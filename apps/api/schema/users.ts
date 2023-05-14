import { Static, Type } from "@sinclair/typebox";

export const UserCreateSchema = Type.Object({
  email: Type.String({ format: "email", minLength: 1 }),
  phone: Type.String({ minLength: 1 }),
  fullName: Type.String({ minLength: 1 }),
  password: Type.String({ minLength: 1 }),
});

export const UserUpdateSchema = Type.Partial(UserCreateSchema);

export type UserCreateBody = Static<typeof UserCreateSchema>;
export type UserUpdateBody = Static<typeof UserUpdateSchema>;
