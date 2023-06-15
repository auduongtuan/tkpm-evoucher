-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "discountType" "DiscountType",
ADD COLUMN     "maxVoucherFixed" DOUBLE PRECISION,
ADD COLUMN     "maxVoucherPercent" DOUBLE PRECISION,
ADD COLUMN     "spentBudget" DOUBLE PRECISION,
ADD COLUMN     "totalBudget" DOUBLE PRECISION;
