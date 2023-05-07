import { deleteStore, getStores } from "../../api-client";
import { useQuery } from "@tanstack/react-query";
import { Table, Typography, Space, Button } from "antd";
import { Merchant, Store, Category } from "database";
import useStoreStore from "./store";
import StoreCreateForm from "./StoreCreateForm";
import DeleteRecordButton from "@/components/DeleteRecordButton";

const Stores = () => {
  const query = useQuery({
    queryKey: ["store_list"],
    queryFn: getStores,
  });
  if (query.data) console.log(query.data);
  const setCreateModalOpen = useStoreStore((state) => state.setCreateModalOpen);
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Merchant",
      dataIndex: "merchant",
      render: (merchant: Merchant) => merchant && merchant.name,
    },
    {
      title: "Categories",
      dataIndex: "categories",
      render: (categories: Category[]) => {
        console.log(categories);
        return categories.map((category) => category.name).join(", ");
      },
    },
    {
      title: "Actions",
      render: (record: Store) => (
        <Space size="middle">
          <DeleteRecordButton
            mutationFn={deleteStore}
            name={record.name}
            id={record.id}
            queryKey={["store_list"]}
          />
        </Space>
      ),
    },
  ];
  return (
    <>
      <StoreCreateForm />
      <div className="flex mb-4">
        <Typography.Title level={2} className="mb-0 flex-grow">
          Stores
        </Typography.Title>
        <Button onClick={() => setCreateModalOpen(true)}>Add new</Button>
      </div>
      {!query.isLoading && (
        <Table
          dataSource={query.data}
          columns={columns}
          rowKey={(record) => `store_record ${record.id}`}
        />
      )}
    </>
  );
};
export default Stores;
