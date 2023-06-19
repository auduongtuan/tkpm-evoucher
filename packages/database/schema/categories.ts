import { Static, Type } from "@sinclair/typebox";

export const CategoryCreateSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
});

export const CategoryUpdateSchema = Type.Partial(CategoryCreateSchema);

export type CategoryCreateBody = Static<typeof CategoryCreateSchema>;
export type CategoryUpdateBody = Static<typeof CategoryUpdateSchema>;

export const CategoriesParamsSchema = Type.Object({
  merchantId: Type.Optional(Type.Integer()),
});
export type CategoriesParamsType = Static<typeof CategoriesParamsSchema>;
