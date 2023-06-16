import { Static, Type } from "@sinclair/typebox";

export const GameCreateSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  slug: Type.String({ minLength: 1 }),
  image: Type.Optional(Type.String({ minLength: 1 })),
});

export const GameUpdateSchema = Type.Partial(GameCreateSchema);

export type GameCreateBody = Static<typeof GameCreateSchema>;
export type GameUpdateBody = Static<typeof GameUpdateSchema>;
