import { useState } from "react";
import { Form, Input, Modal, Checkbox } from "antd";
import { createEmployee, getEmployee, updateEmployee } from "api-client";
import useRouteModal from "ui/hooks/useRouteModal";
import useCrud from "ui/hooks/useCrud";
import { MerchantSelect } from "ui/admin-components/RecordSelect";

const EmployeeForm = () => {
  const { modalProps, closeModal } = useRouteModal("/employees");
  const [form] = Form.useForm();
  const [systemAdmin, setSystemAdmin] = useState(false);
  const { id, formModalProps } = useCrud({
    name: "employee",
    getFn: getEmployee,
    onGetSuccess: (data) => {
      form.setFieldsValue({ ...data });
      setSystemAdmin(data.systemAdmin);
    },
    updateFn: updateEmployee,
    createFn: createEmployee,
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
            ]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="Email"
            name={"email"}
            rules={[
              { required: true, message: "Please input employee email!" },
            ]}
          >
            <Input></Input>
          </Form.Item>

          <Form.Item name={"systemAdmin"} valuePropName="checked">
            <Checkbox>
              This employee is adminstrator for the whole system.
            </Checkbox>
          </Form.Item>
          {!systemAdmin && (
            <Form.Item
              label="Merchant"
              name={"merchantId"}
              rules={[
                { required: true, message: "Please select employee merchant!" },
              ]}
            >
              <MerchantSelect />
            </Form.Item>
          )}
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
            <Input></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default EmployeeForm;
