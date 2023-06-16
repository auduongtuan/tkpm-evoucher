import { useQuery } from "@tanstack/react-query";
import SectionTitle from "@/components/SectionTitle";
import { getCampaigns } from "api-client";
import { RiGamepadFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import Link from "@/components/Link";
import { Radio, RadioChangeEvent, Empty } from "antd";
import CampaignStatus from "@/components/CampaignStatus";

const Campaigns = () => {
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude);
      });
    }
  }, []);
  const [status, setStatus] = useState<
    "all" | "ongoing" | "upcoming" | "expired"
  >("all");
  const campaignList = useQuery({
    queryKey: ["campaign", "list", status],
    queryFn: () => getCampaigns({ status }),
  });
  return (
    <div className="p-4 bg-white rounded-xl">
      <SectionTitle title={"Ongoing Campaigns"} />
      <Radio.Group
        className="mt-3"
        defaultValue={"all"}
        options={[
          { label: "All", value: "all" },
          { label: "Ongoing", value: "ongoing" },
          { label: "Upcoming", value: "upcoming" },
          { label: "Expired", value: "expired" },
        ]}
        onChange={({ target: { value } }: RadioChangeEvent) => setStatus(value)}
        optionType="button"
        buttonStyle="solid"
      ></Radio.Group>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {!campaignList.isLoading &&
          campaignList.data &&
          (campaignList.data.length > 0 ? (
            campaignList.data.map((campaign) => {
              return (
                <Link
                  to={`/campaign/${campaign.id}`}
                  key={campaign.id + "record"}
                  className="flex flex-col mt-3"
                >
                  {campaign.image ? (
                    <img
                      src={campaign.image}
                      className="mb-3 aspect-[4/3] object-cover rounded-md"
                      alt={campaign.name}
                    />
                  ) : (
                    <div className="mb-3 aspect-[4/3] object-cover rounded-md bg-gray-200"></div>
                  )}
                  <div className="font-medium leading-normal text-md">
                    {campaign.name}
                  </div>
                  <div className="mt-1">
                    <CampaignStatus campaign={campaign} />
                  </div>
                  <div className="mt-2 text-sm text-gray-600 truncate">
                    {campaign.merchant && `by ${campaign.merchant.name}`}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <RiGamepadFill />{" "}
                    {campaign.games &&
                      campaign.games.map((game) => game.name).join(", ")}
                  </div>
                </Link>
              );
            })
          ) : (
            <Empty
              className="col-span-3"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ))}
      </div>
    </div>
  );
};
export default Campaigns;
