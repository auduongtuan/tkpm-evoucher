import { Form, Input, Modal, message, Select, Row, Col } from "antd";
import { createStore, getCategories, getMerchants } from "@/api-client";
import useStoreStore from "./store";
import { useQueryClient, useQuery } from "@tanstack/react-query";
const StoreCreateForm = () => {
  const { createModalOpen, setCreateModalOpen } = useStoreStore();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const merchantListQuery = useQuery({
    queryKey: ["merchant_list"],
    queryFn: getMerchants,
  });
  const categoryListQuery = useQuery({
    queryKey: ["category_list"],
    queryFn: getCategories,
  });
  return (
    <>
      <Modal
        title="Add new store"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        okText="Create"
        cancelText="Cancel"
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              console.log(values);
              createStore(values).then(async (data) => {
                console.log(data);
                setCreateModalOpen(false);
                message.success({ content: "Store created" });
                await queryClient.invalidateQueries({
                  queryKey: ["store_list"],
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
            label="Merchant"
            name={"merchantId"}
            rules={[{ required: true, message: "Please select a merchant!" }]}
          >
            <Select
              showSearch
              placeholder="Select a merchant"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onSelect={(value, { label }) => {
                form.setFieldValue("name", label + " ");
              }}
              options={
                !merchantListQuery.isLoading && merchantListQuery.data
                  ? merchantListQuery.data.map((merchant) => ({
                      value: merchant.id,
                      label: merchant.name,
                    }))
                  : []
              }
            />
          </Form.Item>
          <Form.Item
            label="Category"
            name={"categoryIds"}
            rules={[{ required: true, message: "Please select a merchant!" }]}
          >
            <Select
              showSearch
              mode="multiple"
              placeholder="Select categories"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              // onSelect={(value, { label }) => {
              //   form.setFieldValue("name", label + " ");
              // }}
              options={
                !categoryListQuery.isLoading && categoryListQuery.data
                  ? categoryListQuery.data.map((category) => ({
                      value: category.id,
                      label: category.name,
                    }))
                  : []
              }
            />
          </Form.Item>
          <Form.Item
            label="Name"
            name={"name"}
            rules={[{ required: true, message: "Please input store name!" }]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="Address"
            name={"address"}
            rules={[{ required: true, message: "Please input store address!" }]}
          >
            <Input></Input>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Lat"
                name={"lat"}
                rules={[{ required: true, message: "Please input store lat!" }]}
              >
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Lng"
                name={"lng"}
                rules={[{ required: true, message: "Please input store lng!" }]}
              >
                <Input></Input>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default StoreCreateForm;
