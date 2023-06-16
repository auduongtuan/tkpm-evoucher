import { Static, Type } from "@sinclair/typebox";

export const VoucherCreateSchema = Type.Object({
  couponCode: Type.String({ minLength: 1 }),
  campaignId: Type.Integer(),
  userId: Type.Integer(),
  discountType: Type.Union([Type.Literal("PERCENT"), Type.Literal("FIXED")]),
  discountValue: Type.Number(),
  maxDiscount: Type.Optional(Type.Number()),
  expiredAt: Type.Optional(Type.String({ format: "date-time" })),
});

export const VoucherUpdateSchema = Type.Partial(VoucherCreateSchema);

export type VoucherCreateBody = Static<typeof VoucherCreateSchema>;
export type VoucherUpdateBody = Static<typeof VoucherUpdateSchema>;

export const VoucherGenerateSchema = Type.Object({
  userId: Type.Integer(),
  score: Type.Number(),
});

export type VoucherGenerateBody = Static<typeof VoucherGenerateSchema>;
