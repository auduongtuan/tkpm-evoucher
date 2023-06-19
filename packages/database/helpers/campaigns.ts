import dayjs from "dayjs";
import { Campaign, CampaignsOnStores } from "@prisma/client";
import { CampaignStatus } from "..";
// import { Extended } from "helpers";
export function isCampaignExpired(campaign: Campaign) {
  return dayjs(campaign.endedAt).isBefore(dayjs(), "day");
}

export function simplifyCampaigns(
  campaigns: (CampaignsOnStores & { campaign: Campaign })[]
) {
  return campaigns.map((campaign) => campaign.campaign);
}

export function computeCampaignStatus<T extends Campaign>(
  campaign: T
): T & { status: CampaignStatus } {
  const currentDate = dayjs();
  let status = "ongoing" as CampaignStatus;
  if (dayjs(campaign.endedAt).isBefore(currentDate, "day")) {
    status = "expired";
  }
  if (dayjs(campaign.startedAt).isAfter(currentDate, "day")) {
    status = "upcoming";
  }
  return {
    ...campaign,
    status,
  };
}
