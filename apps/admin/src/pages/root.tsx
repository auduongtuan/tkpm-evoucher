import MainLayout from "../components/MainLayout";
import { Outlet, useNavigate } from "react-router-dom";
import useEmployeeAuth from "@/hooks/useEmployeeAuth";
import { useEffect } from "react";
import { Spin } from "antd";
export default function Root() {
  const { authenticated } = useEmployeeAuth(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (authenticated === false) {
      navigate("/login");
    }
  }, [authenticated]);

  return !authenticated ? (
    <div className="flex w-full h-full min-h-screen items-center justify-center">
      <Spin />
    </div>
  ) : (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
