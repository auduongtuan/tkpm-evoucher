import { useEffect, useState } from "react";
import { Alert, Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import useEmployeeAuth from "ui/hooks/useEmployeeAuth";
const Login = () => {
  // login page with antd components here
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const { authenticated, refetch, login } = useEmployeeAuth(false, {
    onLoginError: (data) => {
      setErrorMessage(data.message);
    },
  });
  useEffect(() => {
    if (authenticated) {
      navigate("/");
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
    <div className="bg-gray-200 flex items-center justify-center p-4 min-h-[100vh]">
      <div className="max-w-md p-8 bg-white border-gray-100 rounded-md shadow-md">
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
