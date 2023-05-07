import { deleteMerchant, getMerchants } from "@/api-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Typography, Space, Button, Modal } from "antd";
import { Merchant, Staff, Store } from "database";
import MerchantCreateForm from "./MerchantCreateForm";
import useMerchantStore from "./store";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import DeleteRecordButton from "@/components/DeleteRecordButton";
import { Link } from "react-router-dom";
const MerchantList = () => {
  const query = useQuery({
    queryKey: ["merchant_list"],
    queryFn: getMerchants,
  });

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
      title: "Number of stores",
      dataIndex: "stores",
      render: (stores: Store[]) => (stores ? stores.length : 0),
    },
    {
      title: "Number of staffs",
      dataIndex: "staffs",
      render: (staffs: Staff[]) => (staffs ? staffs.length : 0),
    },
    {
      title: "Actions",
      render: (record: Merchant) => (
        <Space size="middle">
          <DeleteRecordButton
            mutationFn={deleteMerchant}
            id={record.id}
            name={record.name}
            queryKey={["merchant_list"]}
          />
        </Space>
      ),
    },
  ];
  const { setCreateModalOpen } = useMerchantStore((state) => ({
    setCreateModalOpen: state.setCreateModalOpen,
  }));
  return (
    <>
      {/* <MerchantCreateForm /> */}
      <div className="flex mb-4">
        <Typography.Title level={2} className="mb-0 flex-grow">
          Merchants
        </Typography.Title>
        <Link to="/merchants/new">
          <Button>Add new</Button>
        </Link>
        {/* <Button onClick={() => setCreateModalOpen(true)}>Add new</Button> */}
      </div>
      {!query.isLoading && (
        <Table
          dataSource={query.data}
          columns={columns}
          rowKey={(record) => `merchant_record ${record.id}`}
        />
      )}
    </>
  );
};
export default MerchantList;
