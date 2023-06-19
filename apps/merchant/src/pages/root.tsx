import MainLayout from "../components/MainLayout";
import { Outlet, useNavigate } from "react-router-dom";
import useEmployeeAuth from "ui/hooks/useEmployeeAuth";
import { useEffect } from "react";
import { Spin } from "antd";
export default function Root() {
  const { authenticated } = useEmployeeAuth(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (authenticated === false) {
      navigate("/login");
    }
  }, [authenticated]);
  console.log(authenticated);
  return !authenticated ? (
    <div className="flex items-center justify-center w-full h-full min-h-screen">
      <Spin />
    </div>
  ) : (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
