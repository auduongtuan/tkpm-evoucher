import { Static, Type } from "@sinclair/typebox";

export const CampaignCreateSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  description: Type.Optional(Type.String({ minLength: 1 })),
  startedAt: Type.String({ format: "date-time" }),
  endedAt: Type.String({ format: "date-time" }),
  gameIds: Type.Optional(Type.Array(Type.Number())),
  storeIds: Type.Optional(Type.Array(Type.Number())),
  merchantId: Type.Integer(),
});

export const CampaignUpdateSchema = Type.Partial(CampaignCreateSchema);

export type CampaignCreateBody = Static<typeof CampaignCreateSchema>;
export type CampaignUpdateBody = Static<typeof CampaignUpdateSchema>;
