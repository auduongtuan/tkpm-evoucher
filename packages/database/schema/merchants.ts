import { Static, Type } from "@sinclair/typebox";

export const MerchantCreateSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  image: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
});

export const MerchantUpdateSchema = Type.Partial(MerchantCreateSchema);

export type MerchantCreateBody = Static<typeof MerchantCreateSchema>;
export type MerchantUpdateBody = Static<typeof MerchantUpdateSchema>;
