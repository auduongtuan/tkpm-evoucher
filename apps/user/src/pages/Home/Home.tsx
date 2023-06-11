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
        <Typography.Title level={3}>Merchants</Typography.Title>
        <a>View more</a>
        <div className="grid grid-cols-3 gap-4">
          {!merchantList.isLoading &&
            merchantList.data &&
            merchantList.data.map((merchant) => {
              return (
                <div
                  key={merchant.id + "record"}
                  className="flex flex-col mt-3"
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
                  <div className="mt-1 text-gray-600">
                    {merchant.stores.length} stores
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="p-4 bg-white rounded-xl">
        <div className="flex items-center">
          <Typography.Title level={3} className="grow">
            Nearby Stores
          </Typography.Title>
          <a>View more</a>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {!storeList.isLoading &&
            storeList.data &&
            storeList.data.map((store) => {
              return (
                <div key={store.id + "record"} className="flex flex-col mt-3">
                  <div className="font-medium leading-normal text-md">
                    {store.name}
                  </div>
                  <div className="mt-2 text-gray-600 truncate">
                    {store.address &&
                      store.address.split(",").slice(0, -2).join(", ")}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="p-4 bg-white rounded-xl">
        <div className="flex items-center">
          <Typography.Title level={3} className="grow">
            Ongoing Campaigns
          </Typography.Title>
          <a>View more</a>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {!campaignList.isLoading &&
            campaignList.data &&
            campaignList.data.map((campaign) => {
              return (
                <div
                  key={campaign.id + "record"}
                  className="flex flex-col mt-3"
                >
                  <div className="font-medium leading-normal text-md">
                    {campaign.name}
                  </div>
                  <div className="mt-2 text-gray-600 truncate">
                    {campaign.merchant && `by ${campaign.merchant.name}`}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-gray-600">
                    <RiGamepadFill />{" "}
                    {campaign.games &&
                      campaign.games.map((game) => game.name).join(", ")}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
export default Home;
