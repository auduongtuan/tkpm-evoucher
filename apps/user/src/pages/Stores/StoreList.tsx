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
import SectionTitle from "@/components/SectionTitle";
const StoreList = () => {
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

  const storeList = useQuery({
    queryKey: ["store", "list"],
    queryFn: () => getStores(),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 bg-white rounded-xl">
        <SectionTitle title="Stores List" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {!storeList.isLoading &&
            storeList.data &&
            storeList.data.map((store) => {
              return (
                <Link
                  to={`/store/${store.id}`}
                  key={store.id + "record"}
                  className="flex flex-col mt-3"
                  // target="_blank"
                >
                  {store.merchant.image && (
                    <img src={store.merchant.image} className="mb-4" />
                  )}
                  <div className="font-medium leading-normal text-md">
                    {store.name}
                  </div>
                  <div className="mt-2 text-sm text-gray-600 truncate">
                    {store.address &&
                      store.address.split(",").slice(0, -2).join(", ")}
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
};
export default StoreList;
