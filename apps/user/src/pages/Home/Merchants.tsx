import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Row, Col, Typography } from "antd";
import { capitalize } from "lodash-es";
import SectionTitle from "@/components/SectionTitle";
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

const Merchants = () => {
  const merchantList = useQuery({
    queryKey: ["merchant", "list"],
    queryFn: getMerchants,
  });
  return (
    <div className="p-4 bg-white rounded-xl">
      <SectionTitle title={"Merchants"} />
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
  );
};
export default Merchants;
