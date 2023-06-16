import dayjs from "dayjs";
import { Campaign } from "@prisma/client";
export function isCampaignExpired(campaign: Campaign) {
  return dayjs(campaign.endedAt).isBefore(dayjs(), "day");
}
