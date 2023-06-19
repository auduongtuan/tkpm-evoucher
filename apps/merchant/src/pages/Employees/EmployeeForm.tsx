import { useEffect, useState } from "react";
import { Form, Input, Modal, Checkbox, message } from "antd";
import { createEmployee, getEmployee, updateEmployee } from "api-client";
import useRouteModal from "ui/hooks/useRouteModal";
import useCrud from "ui/hooks/useCrud";
import { MerchantSelect } from "ui/admin-components/RecordSelect";
import useAdminStore from "ui/hooks/useAdminStore";
import { phoneRegex } from "helpers";
import { AxiosError } from "axios";

const EmployeeForm = () => {
  const { modalProps, closeModal } = useRouteModal("/employees");
  const [form] = Form.useForm();
  const merchantId = useAdminStore((state) => state.employee?.merchantId);
  useEffect(() => {
    if (merchantId) {
      form.setFieldsValue({ merchantId });
    }
  }, [merchantId]);
  const { id, formModalProps } = useCrud({
    name: "employee",
    getFn: getEmployee,
    onGetSuccess: (data) => {
      form.setFieldsValue({ ...data });
    },
    updateFn: updateEmployee,
    createFn: createEmployee,
    onCreateError: (error) => {
      if (error instanceof AxiosError) {
        const errorData = error.response?.data;
        if (errorData && errorData.code == "P2002") {
          message.error("Email or phone already exists!");
        }
      }
    },
    closeModal: closeModal,
    form: form,
  });

  return (
    <>
      <Modal {...modalProps} {...formModalProps}>
        <Form layout="vertical" autoComplete="off" form={form} className="my-4">
          <Form.Item label="Merchant" name={"merchantId"} hidden>
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="Full Name"
            name={"fullName"}
            rules={[
              { required: true, message: "Please input employee full name!" },
            ]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="Phone"
            name={"phone"}
            rules={[
              { required: true, message: "Please input employee phone!" },
              { pattern: phoneRegex, message: "Please input valid phone!" },
            ]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="Email"
            name={"email"}
            rules={[
              { required: true, message: "Please input employee email!" },
              { type: "email", message: "Please input valid email!" },
            ]}
          >
            <Input></Input>
          </Form.Item>

          <Form.Item
            label={id ? "Change current password" : "Password"}
            name={"password"}
            rules={[
              {
                required: id ? false : true,
                message: "Please input employee password!",
              },
            ]}
          >
            <Input.Password></Input.Password>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default EmployeeForm;
