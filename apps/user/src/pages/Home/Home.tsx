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
    <Row gutter={16}>
      <Col span={12}>
        <div>
          <Typography.Title level={3}>Statistics</Typography.Title>
          {Object.keys(statistics).map((recordType) => {
            return (
              <div className="flex mt-3">
                <div className="w-12 flex-grow">
                  {pluralize(capitalize(recordType))}
                </div>
                <div>
                  {!statistics[recordType].isLoading &&
                    statistics[recordType].data.length}
                </div>
              </div>
            );
          })}
        </div>
      </Col>
      <Col span={12}></Col>
    </Row>
  );
};
export default Home;
