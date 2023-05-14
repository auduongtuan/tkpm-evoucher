import { createAuthentication } from "@/api-client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Form, Input } from "antd";
import { EmployeeLoginBody } from "../../../../api/schema/employees";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
const Login = () => {
  // login page with antd components here
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const loginMutation = useMutation({
    mutationFn: async (body: EmployeeLoginBody) =>
      await createAuthentication(body.email, body.password),
    onSuccess: (data) => {
      const { token } = data;
      if (token) {
        localStorage.setItem("token", token);
        navigate("/");
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data.message);
      }
    },
  });
  const handleLogin = (e) => {
    e.preventDefault();
    // login logic here with tanstack query
    form
      .validateFields()
      .then((values) => {
        loginMutation.mutate(values);
        console.log(values);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="bg-gray-200 flex items-center justify-center p-4 min-h-[100vh]">
      <div className="bg-white max-w-md shadow-md border-gray-100 p-8 rounded-md">
        <h1>Login</h1>
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
            <Input type="password" />
          </Form.Item>
          <Button type="primary" htmlType="button" onClick={handleLogin}>
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;