import { Static, Type } from "@sinclair/typebox";
export const PaginationParamsSchema = Type.Object({
  take: Type.Optional(Type.Number({ minimum: 1 })),
  skip: Type.Optional(Type.Number({ minimum: 1 })),
});
export type PaginationParamsType = Static<typeof PaginationParamsSchema>;
