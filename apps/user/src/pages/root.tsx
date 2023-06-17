import MainLayout from "../components/MainLayout";
import { Outlet, useNavigate } from "react-router-dom";
import useEmployeeAuth from "@/hooks/useUserAuth";
import { useEffect } from "react";
import { Spin } from "antd";
import useAppStore from "@/stores/useAppStore";
export default function Root() {
  const { authenticated } = useEmployeeAuth(true);
  const navigate = useNavigate();
  const requestUserCoords = useAppStore((state) => state.requestUserCoords);
  useEffect(() => {
    requestUserCoords();
  }, []);
  // useEffect(() => {
  //   if (authenticated === false) {
  //     navigate("/login");
  //   }
  // }, [authenticated]);

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
