import { Form, Input, Modal } from "antd";
import { createCategory, getCategory, updateCategory } from "api-client";
import useRouteModal from "ui/hooks/useRouteModal";
import useCrud from "ui/hooks/useCrud";

const CategoryForm = () => {
  const { modalProps, closeModal } = useRouteModal("/categories");
  const [form] = Form.useForm();
  const { formModalProps } = useCrud({
    name: "category",
    getFn: getCategory,
    onGetSuccess: (data) => {
      form.setFieldsValue({ ...data });
    },
    updateFn: updateCategory,
    createFn: createCategory,
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
            rules={[{ required: true, message: "Please input category name!" }]}
          >
            <Input></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default CategoryForm;
