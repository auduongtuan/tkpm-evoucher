import { getCampaigns } from "../api-client";
import { useQuery } from "react-query";
import { Table, Typography, Space } from "antd";
import { Campaign, Merchant } from "database";

const Campaigns = () => {
  const query = useQuery("campaigns", getCampaigns);
  if (query.data) console.log(query.data);
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Merchant",
      key: "merchant",
      dataIndex: "merchant",
      render: (merchant: Merchant) => merchant.name,
    },
    {
      title: "Number of stores applied",
      dataIndex: "stores",
      key: "stores_length",
      render: (stores) => (stores ? stores.length : 0),
    },
    {
      title: "Actions",
      render: (record: Campaign) => (
        <Space size="middle">
          <a href={`/${record.id}`}>Delete</a>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Typography.Title level={2}>Campaigns</Typography.Title>
      {!query.isLoading && <Table dataSource={query.data} columns={columns} />}
    </>
  );
};
export default Campaigns;
