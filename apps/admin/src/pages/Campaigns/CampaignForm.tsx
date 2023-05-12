import { Form, Input, Modal } from "antd";
import { createCampaign, getCampaign, updateCampaign } from "@/api-client";
import useRouteModal from "@/components/useRouteModal";
import useCrud from "@/components/useCrud";

const CampaignForm = () => {
  const { modalProps, closeModal } = useRouteModal("/campaigns");
  const [form] = Form.useForm();
  const { formModalProps } = useCrud({
    name: "campaign",
    getFn: getCampaign,
    onGetSuccess: (data) => {
      form.setFieldsValue({ ...data });
    },
    updateFn: updateCampaign,
    createFn: createCampaign,
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
            rules={[{ required: true, message: "Please input campaign name!" }]}
          >
            <Input></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default CampaignForm;
