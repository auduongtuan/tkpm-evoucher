import { Form, Input, Modal, Typography, message } from "antd";
import { createMerchant, getMerchant, updateMerchant } from "api-client";
import useRouteModal from "@/hooks/useRouteModal";
import useCrud from "@/hooks/useCrud";
import { useWatch } from "antd/es/form/Form";
import { Upload } from "ui";

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
  const image = useWatch("image", form);

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
          <label className="block mb-2 text-sm">Image</label>
          {image && <img src={image} className="max-w-full mb-4 rounded-md" />}
          <Form.Item
            label="Image"
            name={"image"}
            hidden
            shouldUpdate
            // rules={[{ type: "url", message: "Please input valid url" }]}
          >
            <Input type="hidden"></Input>
          </Form.Item>
          <Upload
            onUploadDone={(response) => {
              form.setFieldsValue({ image: response.url });
            }}
          ></Upload>
        </Form>
      </Modal>
    </>
  );
};
export default MerchantForm;
