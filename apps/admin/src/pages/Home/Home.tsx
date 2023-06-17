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
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(Colors);
ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const queryFns = {
    merchant: getMerchants,
    store: getStores,
    category: getCategories,
    game: getGames,
    campaign: getCampaigns,
    user: getUsers,
    voucher: getVouchers,
  };
  const statistics = Object.keys(queryFns).reduce((acc, recordType) => {
    acc[recordType] = useQuery({
      queryKey: [recordType, "list"],
      queryFn: queryFns[recordType],
    });
    return acc;
  }, {});
  return (
    <div className="grid">
      <div className="grid grid-cols-3 gap-10">
        <div>
          <Typography.Title level={3}>Statistics</Typography.Title>
          <div className="flex flex-col gap-8">
            <section>
              <Typography.Title level={4}>Overall</Typography.Title>
              {Object.keys(statistics).map((recordType) => {
                return (
                  <div className="flex mt-3" key={recordType}>
                    <div className="flex-grow w-12">
                      {pluralize(capitalize(recordType))}
                    </div>
                    <div>
                      {!statistics[recordType].isLoading &&
                        statistics[recordType].data.length}
                    </div>
                  </div>
                );
              })}
            </section>
            <section>
              <Typography.Title level={4}>Top-campaign stores</Typography.Title>
              {!statistics["store"].isLoading &&
                statistics["store"].data
                  .sort((a, b) => b?.campaigns?.length - a?.campaigns?.length)
                  .slice(0, 5)
                  .map((store) => {
                    return (
                      <div className="flex mt-3" key={store.id}>
                        <div className="flex-grow w-12">{store.name}</div>
                        <div>
                          {store.campaigns && store.campaigns.length}{" "}
                          {pluralize("campaign")}
                        </div>
                      </div>
                    );
                  })}
            </section>
            <section>
              <Typography.Title level={4}>Top users</Typography.Title>
              {!statistics["user"].isLoading &&
                statistics["user"].data
                  .sort((a, b) => b?.vouchers?.length - a?.vouchers?.length)
                  .slice(0, 5)
                  .map((user) => {
                    return (
                      <div className="flex mt-3" key={user.id}>
                        <div className="flex-grow w-12">{user.fullName}</div>
                        <div>
                          {user.vouchers && user.vouchers.length}{" "}
                          {pluralize("vouchers")}
                        </div>
                      </div>
                    );
                  })}
            </section>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <section>
            <Typography.Title level={4}>Stores by category</Typography.Title>
            {!statistics["category"].isLoading && (
              <Doughnut
                className="aspect-video "
                options={
                  {
                    // plugins: {
                    //   legend: {
                    //     position: "right",
                    //   },
                    // },
                    // aspectRatio: 2,
                  }
                }
                data={{
                  labels: statistics["category"].data.map(
                    (category) => category.name
                  ),

                  datasets: [
                    {
                      label: "Quantity of stores",
                      data: statistics["category"].data.map(
                        (category) => category.stores.length
                      ),
                      // backgroundColor: [
                      //   "rgb(255, 99, 132)",
                      //   "rgb(54, 162, 235)",
                      //   "rgb(255, 205, 86)",
                      // ],
                      hoverOffset: 4,
                    },
                  ],
                }}
              />
            )}
          </section>
          <section>
            <Typography.Title level={4}>Campaigns by category</Typography.Title>
            {!statistics["campaign"].isLoading && (
              <Doughnut
                className="aspect-video "
                options={
                  {
                    // plugins: {
                    //   legend: {
                    //     position: "right",
                    //   },
                    // },
                    // aspectRatio: 2,
                  }
                }
                data={{
                  labels: statistics["campaign"].data.map(
                    (campaign) => campaign.name
                  ),

                  datasets: [
                    {
                      label: "Quantity of vouchers",
                      data: statistics["campaign"].data.map(
                        (campaign) => campaign.vouchers.length
                      ),
                      // backgroundColor: [
                      //   "rgb(255, 99, 132)",
                      //   "rgb(54, 162, 235)",
                      //   "rgb(255, 205, 86)",
                      // ],
                      hoverOffset: 4,
                    },
                  ],
                }}
              />
            )}
          </section>
        </div>
      </div>
      <Col span={12}></Col>
    </div>
  );
};
export default Home;
