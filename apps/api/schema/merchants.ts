import { Static, Type } from "@sinclair/typebox";

export const MerchantSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  image: Type.Optional(Type.String()),
});

export const MerchantUpdateSchema = Type.Partial(MerchantSchema);

export type MerchantCreateBody = Static<typeof MerchantSchema>;
export type MerchantUpdateType = Static<typeof MerchantUpdateSchema>;
