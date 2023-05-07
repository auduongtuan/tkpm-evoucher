import { Form, Input, Modal, message } from "antd";
import { createMerchant } from "@/api-client";
import useMerchantStore from "./store";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
const MerchantCreateForm = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const { createModalOpen, setCreateModalOpen } = useMerchantStore();
  const queryClient = useQueryClient();

  // const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    setCreateModalOpen(true);
  }, []);
  const handleClose = () => {
    setCreateModalOpen(false);
  };
  const [form] = Form.useForm();
  return (
    <>
      {contextHolder}
      <Modal
        title="Add new merchant"
        open={createModalOpen}
        onCancel={handleClose}
        okText="Create"
        cancelText="Cancel"
        afterClose={() => {
          navigate("/merchants");
        }}
        onOk={() => {
          console.log("aaa");
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              console.log(values);
              createMerchant(values).then(async (data) => {
                console.log(data);
                setCreateModalOpen(false);
                messageApi.success({ content: "Merchant created" });
                await queryClient.refetchQueries({
                  queryKey: ["merchant_list"],
                  type: "active",
                });
              });
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form layout="vertical" autoComplete="off" form={form} className="my-4">
          <Form.Item
            label="Name"
            name={"name"}
            rules={[{ required: true, message: "Please input merchant name!" }]}
          >
            <Input></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default MerchantCreateForm;
