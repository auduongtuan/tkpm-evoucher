import { Form, Input, Modal, Checkbox, message } from "antd";
import { createEmployee, getEmployee, updateEmployee } from "api-client";
import useRouteModal from "ui/hooks/useRouteModal";
import useCrud from "ui/hooks/useCrud";
import { MerchantSelect } from "ui/admin-components/RecordSelect";
import { phoneRegex } from "helpers";
import { useWatch } from "antd/es/form/Form";
import { AxiosError } from "axios";
const EmployeeForm = () => {
  const { modalProps, closeModal } = useRouteModal("/employees");
  const [form] = Form.useForm();
  // const [systemAdmin, setSystemAdmin] = useState(false);
  const { id, formModalProps } = useCrud({
    name: "employee",
    getFn: getEmployee,
    onGetSuccess: (data) => {
      form.setFieldsValue({ ...data });
      // setSystemAdmin(data.systemAdmin);
    },
    updateFn: updateEmployee,
    createFn: createEmployee,
    closeModal: closeModal,
    valuesFilter: (values) => {
      return {
        ...values,
        merchantId: values.systemAdmin ? null : values.merchantId,
      };
    },
    onCreateError: (error) => {
      if (error instanceof AxiosError) {
        const errorData = error.response?.data;
        if (errorData && errorData.code == "P2002") {
          message.error("Email or phone already exists!");
        }
      }
    },
    form: form,
  });
  const systemAdmin = useWatch<boolean>("systemAdmin", form);
  return (
    <>
      <Modal {...modalProps} {...formModalProps}>
        <Form layout="vertical" autoComplete="off" form={form} className="my-4">
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
            <Input.Password></Input.Password>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default EmployeeForm;
