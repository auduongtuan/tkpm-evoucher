import { Static, Type } from "@sinclair/typebox";

export const CampaignCreateSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  description: Type.Optional(Type.String({ minLength: 1 })),
  startedAt: Type.String({ format: "date-time" }),
  endedAt: Type.String({ format: "date-time" }),
  gameIds: Type.Optional(Type.Array(Type.Number())),
  storeIds: Type.Optional(Type.Array(Type.Number())),
  discountType: Type.Union([Type.Literal("PERCENT"), Type.Literal("FIXED")]),
  maxVoucherFixed: Type.Optional(Type.Number()),
  maxVoucherPercent: Type.Optional(Type.Number()),
  totalBudget: Type.Optional(Type.Number()),
  spentBudget: Type.Optional(Type.Number()),
  merchantId: Type.Integer(),
});

export const CampaignUpdateSchema = Type.Partial(CampaignCreateSchema);

export type CampaignCreateBody = Static<typeof CampaignCreateSchema>;
export type CampaignUpdateBody = Static<typeof CampaignUpdateSchema>;

export const CampaignsParamsSchema = Type.Object({
  status: Type.Optional(
    Type.Union([
      Type.Literal("all"),
      Type.Literal("upcoming"),
      Type.Literal("ongoing"),
      Type.Literal("expired"),
    ])
  ),
});
export type CampaignsParamsType = Static<typeof CampaignsParamsSchema>;
