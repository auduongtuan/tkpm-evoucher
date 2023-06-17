import { Static, Type } from "@sinclair/typebox";

export const VoucherCreateSchema = Type.Object({
  couponCode: Type.String({ minLength: 1 }),
  campaignId: Type.Integer(),
  userId: Type.Integer(),
  discountType: Type.Union([Type.Literal("PERCENT"), Type.Literal("FIXED")]),
  discountValue: Type.Number(),
  maxDiscount: Type.Number(),
  expiredAt: Type.String({ format: "date-time" }),
  usedAt: Type.Optional(Type.String({ format: "date-time" })),
});

export const VoucherUpdateSchema = Type.Partial(VoucherCreateSchema);

export type VoucherCreateBody = Static<typeof VoucherCreateSchema>;
export type VoucherUpdateBody = Static<typeof VoucherUpdateSchema>;

export const VoucherGenerateSchema = Type.Object({
  userId: Type.Integer(),
  score: Type.Number(),
  gameSlug: Type.String({ minLength: 1 }),
});

export type VoucherGenerateBody = Static<typeof VoucherGenerateSchema>;
export const VouchersParamsSchema = Type.Object({
  merchantId: Type.Optional(Type.Integer()),
});
export type VouchersParamsType = Static<typeof VouchersParamsSchema>;
