import { getGames } from "../api-client";
import { useQuery } from "@tanstack/react-query";
import { Table, Typography, Space } from "antd";
import { Game } from "database";

const Games = () => {
  const query = useQuery({
    queryKey: ["game_list"],
    queryFn: getGames,
  });
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
      title: "Actions",
      render: (record: Game) => (
        <Space size="middle">
          <a href={`/${record.id}`}>Delete</a>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Typography.Title level={2}>Games</Typography.Title>
      {!query.isLoading && <Table dataSource={query.data} columns={columns} />}
    </>
  );
};
export default Games;
