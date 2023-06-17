import { Static, Type } from "@sinclair/typebox";

export const StoreSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  address: Type.String({ minLength: 1 }),
  lat: Type.Number(),
  lng: Type.Number(),
  merchantId: Type.Integer(),
  categoryIds: Type.Optional(Type.Array(Type.Number())),
});

export const StoreUpdateSchema = Type.Partial(StoreSchema);

export type StoreCreateBody = Static<typeof StoreSchema>;
export type StoreUpdateBody = Static<typeof StoreUpdateSchema>;

export const StoresParamsSchema = Type.Object({
  merchantId: Type.Optional(Type.Integer()),
  categoryId: Type.Optional(Type.Integer()),
  nearBy: Type.Optional(Type.String()),
});
export type StoresParamsType = Static<typeof StoresParamsSchema>;
