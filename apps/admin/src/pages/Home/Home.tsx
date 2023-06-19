import { useQuery } from "@tanstack/react-query";
import { Col, Typography } from "antd";
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
import { ArcElement, Colors } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";
import { Campaign } from "database";
import Support from "ui/components/Support";
import { formatCurrency, quantityPluralize } from "helpers";
import dayjs from "dayjs";
import { groupBy, uniqWith, isEqual } from "lodash-es";
ChartJS.register(Colors);
ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
  const campaignByMonthLabels = statistics["campaign"].data
    ? uniqWith(
        statistics["campaign"].data
          .map((campaign) => dayjs(campaign.startedAt).format("MM/YYYY"))
          .sort((a, b) => (a == b ? 0 : dayjs(a).isBefore(dayjs(b)) ? 1 : -1)),
        isEqual
      )
    : [];
  const campaignByMonthData = Object.values(
    groupBy(statistics["campaign"].data, (campaign) =>
      dayjs(campaign.startedAt).format("MM/YYYY")
    )
  ).map((campaignList) => campaignList?.length);
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
                        statistics[recordType].data?.length}
                    </div>
                  </div>
                );
              })}
            </section>
            <section>
              <Typography.Title level={4}>Top-campaign stores</Typography.Title>
              {!statistics["store"].isLoading &&
                statistics["store"].data
                  ?.sort((a, b) => b?.campaigns?.length - a?.campaigns?.length)
                  .slice(0, 5)
                  .map((store) => {
                    return (
                      <div className="flex mt-3" key={store.id}>
                        <div className="flex-grow w-12">{store.name}</div>
                        <div>
                          {store.campaigns &&
                            quantityPluralize(
                              store.campaigns?.length,
                              "campaign"
                            )}
                        </div>
                      </div>
                    );
                  })}
            </section>
            <section>
              <Typography.Title level={4}>
                Top-budget campaigns
              </Typography.Title>
              {!statistics["campaign"].isLoading &&
                statistics["campaign"].data
                  ?.sort((a, b) => b?.totalBudget - a?.totalBudget)
                  .slice(0, 5)
                  .map((campaign: Campaign) => {
                    return (
                      <div className="flex mt-3" key={campaign.id}>
                        <div className="flex-grow w-12">{campaign.name}</div>
                        <div>
                          {campaign.totalBudget &&
                            formatCurrency(campaign.totalBudget)}
                        </div>
                      </div>
                    );
                  })}
            </section>
            <section>
              <Typography.Title level={4}>Top users</Typography.Title>
              {!statistics["user"].isLoading &&
                statistics["user"].data
                  ?.sort((a, b) => b?.vouchers?.length - a?.vouchers?.length)
                  .slice(0, 5)
                  .map((user) => {
                    return (
                      <div className="flex mt-3" key={user.id}>
                        <div className="flex-grow w-12">{user.fullName}</div>
                        <div>
                          {user.vouchers &&
                            quantityPluralize(user.vouchers?.length, "voucher")}
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
                        (category) => category.stores?.length
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
            <Typography.Title level={4}>Vouchers by campaigns</Typography.Title>
            {!statistics["campaign"].isLoading && (
              <Doughnut
                className="aspect-video "
                data={{
                  labels: statistics["campaign"].data.map(
                    (campaign) => campaign.name
                  ),

                  datasets: [
                    {
                      label: "Quantity of vouchers",
                      data: statistics["campaign"].data.map(
                        (campaign) => campaign.vouchers?.length
                      ),

                      hoverOffset: 4,
                    },
                  ],
                }}
              />
            )}
          </section>
        </div>
        <div>
          <section className="mb-4">
            <Typography.Title level={4}>Campaigns by month</Typography.Title>

            {!statistics["campaign"].isLoading && (
              <Bar
                key="line-chart"
                className="aspect-video"
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
                  labels: campaignByMonthLabels,
                  datasets: [
                    {
                      label: "Quantity of campaigns",
                      data: campaignByMonthData,
                    },
                  ],
                }}
              />
            )}
          </section>
          <Support />
        </div>
      </div>
    </div>
  );
};
export default Home;
