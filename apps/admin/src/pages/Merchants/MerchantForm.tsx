import { Form, Input, Modal } from "antd";
import { createMerchant, getMerchant, updateMerchant } from "@/api-client";
import useRouteModal from "@/components/useRouteModal";
import useCrud from "@/components/useCrud";

const MerchantForm = () => {
  const { modalProps, closeModal } = useRouteModal("/merchants");
  const [form] = Form.useForm();
  const { formModalProps } = useCrud({
    name: "merchant",
    getFn: getMerchant,
    onGetSuccess: (data) => {
      form.setFieldsValue({ ...data });
    },
    updateFn: updateMerchant,
    createFn: createMerchant,
    closeModal: closeModal,
    form: form,
  });

  return (
    <>
      <Modal {...modalProps} {...formModalProps}>
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
export default MerchantForm;
