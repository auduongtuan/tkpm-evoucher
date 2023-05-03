-- AlterTable
ALTER TABLE "Campaign" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GamesOnCampaigns" ADD COLUMN     "configs" TEXT;

-- AlterTable
ALTER TABLE "Merchant" ADD COLUMN     "image" TEXT;
