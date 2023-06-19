import DeleteRecordButton from "./DeleteRecordButton";
import { useQuery } from "@tanstack/react-query";
import { Button, Space, Table, Typography } from "antd";
import { Link } from "react-router-dom";
import pluralize from "pluralize-esm";
import { capitalize } from "lodash-es";
function RecordList<T extends { id: number; [key: string]: any }>({
  getFn,
  deleteFn,
  name,
  columns,
  viewOnly = false,
}: {
  getFn: () => Promise<Array<(T & { [key: string]: any }) | T>>;
  deleteFn?: (id: number) => Promise<any>;
  name: string;
  columns: object[];
  viewOnly?: boolean;
}) {
  const queryKey = [name, "list"];
  const query = useQuery({
    queryKey: queryKey,
    queryFn: getFn,
  });
  const pluralName = pluralize(name);

  const dataColumns = [
    {
      title: "Id",
      dataIndex: "id",
      width: "60px",
    },
    ...columns,
    ...(viewOnly
      ? []
      : [
          {
            title: "Actions",
            align: "center" as const,
            width: "15%",
            render: (record: T) => (
              <Space size="middle">
                <Link to={`/${pluralName}/edit/${record.id}`}>
                  <Button type="link">Edit</Button>
                </Link>
                {deleteFn ? (
                  <DeleteRecordButton
                    mutationFn={deleteFn}
                    id={record.id}
                    name={record.name}
                    queryKey={queryKey}
                  />
                ) : null}
              </Space>
            ),
          },
        ]),
  ];
  return (
    <>
      <div className="flex mb-4">
        <Typography.Title level={2} className="flex-grow mb-0">
          {capitalize(pluralName)}
        </Typography.Title>
        {!viewOnly && (
          <Link to={`/${pluralName}/new`}>
            <Button type="primary">Add new</Button>
          </Link>
        )}
      </div>
      {!query.isLoading && (
        <Table
          dataSource={query.data}
          columns={dataColumns}
          rowKey={(record) => `${name}_record_${record.id}`}
        />
      )}
    </>
  );
}
export default RecordList;
