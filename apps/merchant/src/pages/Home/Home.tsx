import { useQuery } from "@tanstack/react-query";
import { Typography } from "antd";
import { capitalize } from "lodash-es";
import {
  getStores,
  getVouchers,
  getMerchantCampaigns,
  getMerchantCategories,
} from "api-client";
import pluralize from "pluralize-esm";
import chartColors from "ui/components/chartColors";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import useAdminStore from "ui/hooks/useAdminStore";
import Support from "ui/components/Support";
import { formatCurrency } from "helpers";
import { Campaign } from "database";
ChartJS.register(Colors);
ChartJS.register(ArcElement, Tooltip, Legend);
const Home = () => {
  const merchantId = useAdminStore((state) => state.employee?.merchantId);
  if (!merchantId) return null;
  const queryFns = {
    // merchant: getMerchants,
    store: async () => await getStores({ merchantId: merchantId }),
    category: async () => await getMerchantCategories(merchantId),
    // game: getGames,
    campaign: async () => await getMerchantCampaigns(merchantId),
    voucher: () => getVouchers({ merchantId: merchantId }),
  };
  const statistics = Object.keys(queryFns).reduce((acc, recordType) => {
    acc[recordType] = useQuery({
      queryKey: [recordType, "list"],
      queryFn: queryFns[recordType],
    });
    return acc;
  }, {});
  const joinedCategories = statistics["category"].data
    ? statistics["category"].data.filter(
        (category) => category.stores.length > 0
      )
    : [];
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
                      {!statistics[recordType]?.isLoading &&
                      recordType == "category"
                        ? statistics[recordType].data.filter(
                            (category) => category.stores.length > 0
                          ).length
                        : statistics[recordType].data?.length}
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
                          {store.campaigns && store.campaigns?.length}{" "}
                          {pluralize("campaign")}
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
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <section>
            <Typography.Title level={4}>Stores by category</Typography.Title>
            {joinedCategories && (
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
                  labels: joinedCategories.map((category) => category.name),

                  datasets: [
                    {
                      label: "Quantity of stores",
                      data: joinedCategories.map(
                        (category) => category.stores?.length
                      ),
                      backgroundColor: chartColors,
                      hoverOffset: 4,
                    },
                  ],
                }}
              />
            )}
          </section>
          <section>
            <Typography.Title level={4}>Campaigns by stores</Typography.Title>
            {!statistics["campaign"]?.isLoading &&
              statistics["campaign"]?.data && (
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
                    labels: statistics["campaign"].data?.map(
                      (campaign) => campaign.name
                    ),

                    datasets: [
                      {
                        label: "Quantity of stores",
                        data: statistics["campaign"].data?.map(
                          (campaign) => campaign.stores?.length
                        ),
                        backgroundColor: chartColors,
                        hoverOffset: 4,
                      },
                    ],
                  }}
                />
              )}
          </section>
        </div>
        <Support />
      </div>
    </div>
  );
};
export default Home;
