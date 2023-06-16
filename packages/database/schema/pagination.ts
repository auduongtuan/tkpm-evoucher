import { Static, Type } from "@sinclair/typebox";
export const PaginationQuerySchema = Type.Object({
  take: Type.Optional(Type.Number({ minimum: 1 })),
  skip: Type.Optional(Type.Number({ minimum: 1 })),
});
export type PaginationQueryType = Static<typeof PaginationQuerySchema>;
