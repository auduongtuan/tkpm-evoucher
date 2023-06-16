import { Campaign } from "database";
import { Tag } from "antd";
import { Extended } from "helpers";
import dayjs from "dayjs";

export function getCampaignStatus(campaign: Extended<Campaign>) {
  const currentDate = dayjs();
  if (dayjs(campaign.endedAt).isBefore(currentDate, "day")) {
    return "expired";
  }
  if (dayjs(campaign.startedAt).isAfter(currentDate, "day")) {
    return "upcoming";
  }
  return "ongoing";
}
const CampaignStatus = ({ campaign }: { campaign: Campaign }) => {
  const colorMap = {
    ongoing: "green",
    upcoming: "blue",
    expired: "red",
  };
  return (
    <Tag color={colorMap[getCampaignStatus(campaign)]} className="uppercase">
      {getCampaignStatus(campaign)}
    </Tag>
  );
};
export default CampaignStatus;
