import { Form, Input, Modal, Typography, message } from "antd";
import { createMerchant, getFullMerchant, updateMerchant } from "api-client";
import useRouteModal from "ui/hooks/useRouteModal";
import useCrud from "ui/hooks/useCrud";
import { useWatch } from "antd/es/form/Form";
import { Upload } from "ui";
import UploadFormItem from "ui/admin-components/UploadFormItem";

const MerchantForm = () => {
  const { modalProps, closeModal } = useRouteModal("/merchants");
  const [form] = Form.useForm();
  const { formModalProps } = useCrud({
    name: "merchant",
    getFn: getFullMerchant,
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
          <Form.Item label="Description" name={"description"}>
            <Input.TextArea></Input.TextArea>
          </Form.Item>
          <UploadFormItem form={form} />
        </Form>
      </Modal>
    </>
  );
};
export default MerchantForm;
