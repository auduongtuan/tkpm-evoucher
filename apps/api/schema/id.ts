import { Static, Type } from "@sinclair/typebox";
export const IdParamsSchema = Type.Object({
  id: Type.Number({ minimum: 1 }),
});
export type IdParamsType = Static<typeof IdParamsSchema>;
