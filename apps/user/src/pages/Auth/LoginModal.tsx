import useAppStore from "@/stores/useAppStore";
import { Modal, message } from "antd";
import { useState, useEffect } from "react";
import { Form, Input, Button, Alert } from "antd";
import useUserAuth from "@/hooks/useUserAuth";
const LoginModal = () => {
  const loginModal = useAppStore((state) => state.loginModal);
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const { authenticated, refetch, login } = useUserAuth({
    onLoginError: (data) => {
      setErrorMessage(data.message);
    },
    onLoginSuccess: (data) => {
      message.success("Login successfully!");
    },
  });
  useEffect(() => {
    if (authenticated) {
      loginModal.setOpen(false);
    }
  }, [authenticated]);
  const handleLogin = (e) => {
    e.preventDefault();
    // login logic here with tanstack query
    form
      .validateFields()
      .then((values) => {
        login(values);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Modal
      title="Login"
      open={loginModal.open}
      onCancel={() => loginModal.setOpen(false)}
      onOk={handleLogin}
      okText="Login"
    >
      {errorMessage && (
        <Alert type="error" message={errorMessage} className="mb-4"></Alert>
      )}
      <Form layout="vertical" form={form} className="w-full">
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter an email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter an password" }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default LoginModal;
