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
import Merchants from "./Merchants";
import Stores from "./Stores";
import Campaigns from "./Campaigns";

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

  return (
    <div className="flex flex-col gap-4">
      <Merchants />
      <Stores />
      <Campaigns />
    </div>
  );
};
export default Home;
