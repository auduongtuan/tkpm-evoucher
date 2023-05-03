import { getCategories } from "../api-client";
import { useQuery } from "react-query";
import { Table, Typography, Space } from "antd";
import { Merchant } from "database";

const Merchants = () => {
  const query = useQuery("categories", getCategories);
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
      title: "Number of stores",
      dataIndex: "stores",
      key: "stores_length",
      render: (stores) => (stores ? stores.length : 0),
    },
    {
      title: "Actions",
      render: (record: Merchant) => (
        <Space size="middle">
          <a href={`/${record.id}`}>Delete</a>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Typography.Title level={2}>Categories</Typography.Title>
      {!query.isLoading && <Table dataSource={query.data} columns={columns} />}
    </>
  );
};
export default Merchants;
