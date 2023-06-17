import { Static, Type } from "@sinclair/typebox";

export const CampaignCreateSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  description: Type.Optional(Type.String({ minLength: 1 })),
  startedAt: Type.String({ format: "date-time" }),
  endedAt: Type.String({ format: "date-time" }),
  gameIds: Type.Optional(Type.Array(Type.Number())),
  storeIds: Type.Optional(Type.Array(Type.Number())),
  discountType: Type.Union([Type.Literal("PERCENT"), Type.Literal("FIXED")]),
  maxVoucherFixed: Type.Number(),
  maxVoucherPercent: Type.Number(),
  totalBudget: Type.Number(),
  spentBudget: Type.Number(),
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
  merchantId: Type.Optional(Type.Integer()),
});
export type CampaignsParamsType = Static<typeof CampaignsParamsSchema>;
