import useAppStore from "@/stores/useAppStore";
import { Modal, message } from "antd";
import { useState, useEffect } from "react";
import { Form, Input, Button, Alert } from "antd";
import useUserAuth from "@/hooks/useUserAuth";
import { useMutation } from "@tanstack/react-query";
import { UserCreateBody } from "database/schema/users";
import { AxiosError } from "axios";
import { createUser } from "api-client";
import { phoneRegex } from "helpers";
const RegisterModal = () => {
  const registerModal = useAppStore((state) => state.registerModal);
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState("");
  // const { authenticated, refetch, register } = useUserAuth({
  //   onRegisterError: (data) => {
  //     setErrorMessage(data.message);
  //   },
  // });
  // useEffect(() => {
  //   if (authenticated) {
  //     registerModal.setOpen(false);
  //   }
  // }, [authenticated]);
  const registerMutation = useMutation({
    mutationFn: async (body: UserCreateBody) => await createUser(body),
    onSuccess: (data) => {
      if (data) {
        form.resetFields();
        message.success("Register successfully");
        registerModal.setOpen(false);
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
        setErrorMessage(
          "There was an error registering your account. Please try again."
        );
        // onLoginError && onLoginError(error.response?.data);
      }
    },
  });
  const handleRegister = (e) => {
    e.preventDefault();
    // register logic here with tanstack query
    form
      .validateFields()
      .then((values) => {
        if (values.password !== values.confirmPassword) {
          setErrorMessage("Password and confirm password must be the same");
          return;
        }
        // register(values);
        const { confirmPassword, ...body } = values;
        registerMutation.mutate(body);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Modal
      title="Register"
      open={registerModal.open}
      onCancel={() => registerModal.setOpen(false)}
      onOk={handleRegister}
      okText="Register"
    >
      {errorMessage && (
        <Alert type="error" message={errorMessage} className="mb-4"></Alert>
      )}
      <Form layout="vertical" form={form} className="w-full">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, type: "email", message: "Please enter an email" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            { required: true, message: "Please enter a phone number" },
            {
              pattern: phoneRegex,
              message: "Please enter a valid phone number",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Please enter a name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter an password" }]}
        >
          <Input type="password" />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[{ required: true, message: "Please enter an password" }]}
        >
          <Input type="password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default RegisterModal;
