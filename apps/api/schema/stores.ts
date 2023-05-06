import { Static, Type } from "@sinclair/typebox";

export const StoreSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  address: Type.String({ minLength: 1 }),
  lat: Type.Number(),
  lng: Type.Number(),
  merchantId: Type.Integer(),
});

export const StoreUpdateSchema = Type.Partial(StoreSchema);

export type StoreType = Static<typeof StoreSchema>;
export type StoreUpdateType = Static<typeof StoreUpdateSchema>;
