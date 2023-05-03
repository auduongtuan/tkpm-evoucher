import { getStores } from "../api-client";
import { useQuery } from "react-query";
import { Table, Typography, Space } from "antd";
import { Merchant, Store } from "database";

const Stores = () => {
  const query = useQuery("stores", getStores);
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
      dataIndex: "merchant",
      key: "merchant",
      render: (merchant: Merchant) => merchant && merchant.name,
    },
    {
      title: "Actions",
      render: (record: Store) => (
        <Space size="middle">
          <a href={`/${record.id}`}>Delete</a>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Typography.Title level={2}>Stores</Typography.Title>
      {!query.isLoading && <Table dataSource={query.data} columns={columns} />}
    </>
  );
};
export default Stores;
