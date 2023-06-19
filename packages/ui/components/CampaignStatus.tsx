import { DetailCampaign } from "database";
import { Tag } from "antd";

const CampaignStatus = ({ campaign }: { campaign: DetailCampaign }) => {
  const colorMap = {
    ongoing: "green",
    upcoming: "blue",
    expired: "red",
  };
  return (
    <Tag color={colorMap[campaign.status]} className="uppercase">
      {campaign.status}
    </Tag>
  );
};
export default CampaignStatus;
