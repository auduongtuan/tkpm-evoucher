import dayjs from "dayjs";
import { Campaign, CampaignsOnStores } from "@prisma/client";
// import { Extended } from "helpers";
export function isCampaignExpired(campaign: Campaign) {
  return dayjs(campaign.endedAt).isBefore(dayjs(), "day");
}

export function simplifyCampaigns(
  campaigns: (CampaignsOnStores & { campaign: Campaign })[]
) {
  return campaigns.map((campaign) => campaign.campaign);
}
