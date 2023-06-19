/*
  Warnings:

  - Made the column `discountType` on table `Campaign` required. This step will fail if there are existing NULL values in that column.
  - Made the column `maxVoucherFixed` on table `Campaign` required. This step will fail if there are existing NULL values in that column.
  - Made the column `maxVoucherPercent` on table `Campaign` required. This step will fail if there are existing NULL values in that column.
  - Made the column `spentBudget` on table `Campaign` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalBudget` on table `Campaign` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Campaign" ALTER COLUMN "discountType" SET NOT NULL,
ALTER COLUMN "maxVoucherFixed" SET NOT NULL,
ALTER COLUMN "maxVoucherPercent" SET NOT NULL,
ALTER COLUMN "spentBudget" SET NOT NULL,
ALTER COLUMN "spentBudget" SET DEFAULT 0,
ALTER COLUMN "totalBudget" SET NOT NULL;

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "averageScore" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "image" TEXT;
