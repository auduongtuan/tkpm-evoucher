import { useState } from "react";
import { Form, Input, Modal, Checkbox } from "antd";
import { createUser, getUser, updateUser } from "api-client";
import useRouteModal from "@/hooks/useRouteModal";
import useCrud from "@/hooks/useCrud";

const UserForm = () => {
  const { modalProps, closeModal } = useRouteModal("/users");
  const [form] = Form.useForm();
  const [systemAdmin, setSystemAdmin] = useState(false);
  const { id, formModalProps } = useCrud({
    name: "user",
    getFn: getUser,
    onGetSuccess: (data) => {
      form.setFieldsValue({ ...data });
    },
    updateFn: updateUser,
    createFn: createUser,
    closeModal: closeModal,
    form: form,
  });
  const onValuesChange = ({ systemAdmin }) => {
    if (systemAdmin !== undefined) setSystemAdmin(systemAdmin);
  };
  return (
    <>
      <Modal {...modalProps} {...formModalProps}>
        <Form
          layout="vertical"
          autoComplete="off"
          form={form}
          onValuesChange={onValuesChange}
          className="my-4"
        >
          <Form.Item
            label="Full Name"
            name={"fullName"}
            rules={[
              { required: true, message: "Please input user full name!" },
            ]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="Phone"
            name={"phone"}
            rules={[{ required: true, message: "Please input user phone!" }]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="Email"
            name={"email"}
            rules={[{ required: true, message: "Please input user email!" }]}
          >
            <Input></Input>
          </Form.Item>

          <Form.Item
            label={id ? "Change current password" : "Password"}
            name={"password"}
            rules={[
              {
                required: id ? false : true,
                message: "Please input user password!",
              },
            ]}
          >
            <Input></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default UserForm;
