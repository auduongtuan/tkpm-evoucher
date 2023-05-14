import MainLayout from "../components/MainLayout";
import { Outlet, useNavigate } from "react-router-dom";
import useEmployeeAuth from "@/hooks/useEmployeeAuth";
export default function Root() {
  const { authenticated } = useEmployeeAuth(true);
  const navigate = useNavigate();
  if (!authenticated) {
    navigate("/login");
  }
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
