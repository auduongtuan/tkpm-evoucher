import MainLayout from "../components/MainLayout";
import { Outlet, useNavigate } from "react-router-dom";
import useEmployeeAuth from "@/hooks/useEmployeeAuth";
import { useEffect } from "react";
export default function Root() {
  const { authenticated } = useEmployeeAuth(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (authenticated === false) {
      navigate("/login");
    }
  }, [authenticated]);

  return (
    authenticated && (
      <MainLayout>
        <Outlet />
      </MainLayout>
    )
  );
}
