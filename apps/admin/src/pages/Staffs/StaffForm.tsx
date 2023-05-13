import { Form, Input, Modal } from "antd";
import { createStaff, getStaff, updateStaff } from "@/api-client";
import useRouteModal from "@/components/useRouteModal";
import useCrud from "@/components/useCrud";
import pluralize from "pluralize-esm";

const StaffForm = () => {
  const { modalProps, closeModal } = useRouteModal("/staffs");
  const [form] = Form.useForm();
  const { formModalProps } = useCrud({
    name: "staff",
    getFn: getStaff,
    onGetSuccess: (data) => {
      form.setFieldsValue({ ...data });
    },
    updateFn: updateStaff,
    createFn: createStaff,
    closeModal: closeModal,
    form: form,
  });
  console.log(pluralize("staff"));
  return (
    <>
      <Modal {...modalProps} {...formModalProps}>
        <Form layout="vertical" autoComplete="off" form={form} className="my-4">
          <Form.Item
            label="Full Name"
            name={"fullName"}
            rules={[{ required: true, message: "Please input staff name!" }]}
          >
            <Input></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default StaffForm;
