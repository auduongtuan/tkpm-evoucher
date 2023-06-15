import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Row, Col, Typography } from "antd";
import { capitalize } from "lodash-es";
import {
  getMerchants,
  getStores,
  getUsers,
  getCategories,
  getGames,
  getCampaigns,
  getVouchers,
} from "api-client";
import pluralize from "pluralize-esm";
import { RiGamepadFill } from "react-icons/ri";
import { useEffect } from "react";
import Link from "@/components/Link";
const SectionTitle = ({ title }: { title: React.ReactNode }) => {
  return (
    <div className="flex items-center">
      <div className="text-xl font-semibold grow">{title}</div>
      <a>View more</a>
    </div>
  );
};
const Home = () => {
  // const queryFns = {
  //   merchant: getMerchants,
  //   store: getStores,
  //   category: getCategories,
  //   game: getGames,
  //   campaign: getCampaigns,
  //   user: getUsers,
  //   voucher: getVouchers,
  // };
  // const statistics: {[key: keyof typeof queryFns]: } = Object.keys(queryFns).reduce((acc, recordType) => {
  //   acc[recordType] = useQuery({
  //     queryKey: [recordType, "list"],
  //     queryFn: queryFns[recordType],
  //   });
  //   return acc;
  // }, {});
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude);
      });
    }
  }, []);
  const merchantList = useQuery({
    queryKey: ["merchant", "list"],
    queryFn: getMerchants,
  });
  const storeList = useQuery({
    queryKey: ["store", "list"],
    queryFn: () => getStores({ take: 6 }),
  });
  const campaignList = useQuery({
    queryKey: ["campaign", "list"],
    queryFn: () => getCampaigns(),
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 bg-white rounded-xl">
        <SectionTitle title={"Suggested merchants"} />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {!merchantList.isLoading &&
            merchantList.data &&
            merchantList.data.map((merchant) => {
              return (
                <Link
                  to={`/merchant/${merchant.id}`}
                  key={merchant.id + "record"}
                  className="flex flex-col mt-3 no-underline text-inherit"
                >
                  {merchant.image ? (
                    <img
                      src={merchant.image}
                      className="aspect-[4/3] object-cover rounded-md"
                      alt={merchant.name}
                    />
                  ) : (
                    <div className="aspect-[4/3] object-cover rounded-md bg-gray-200"></div>
                  )}
                  <div className="mt-4 font-medium leading-normal text-md">
                    {merchant.name}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {merchant.stores.length} stores
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
      <div className="p-4 bg-white rounded-xl">
        <SectionTitle title="Nearby Stores" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {!storeList.isLoading &&
            storeList.data &&
            storeList.data.map((store) => {
              return (
                <div key={store.id + "record"} className="flex flex-col mt-3">
                  <div className="font-medium leading-normal text-md">
                    {store.name}
                  </div>
                  <div className="mt-2 text-sm text-gray-600 truncate">
                    {store.address &&
                      store.address.split(",").slice(0, -2).join(", ")}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="p-4 bg-white rounded-xl">
        <SectionTitle title={"Ongoing Campaigns"} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {!campaignList.isLoading &&
            campaignList.data &&
            campaignList.data.map((campaign) => {
              return (
                <Link
                  to={`/campaign/${campaign.id}`}
                  key={campaign.id + "record"}
                  className="flex flex-col mt-3"
                >
                  <div className="font-medium leading-normal text-md">
                    {campaign.name}
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
            })}
        </div>
      </div>
    </div>
  );
};
export default Home;
