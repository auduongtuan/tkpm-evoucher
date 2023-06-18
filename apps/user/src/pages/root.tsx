import MainLayout from "../components/MainLayout";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import useAppStore from "@/stores/useAppStore";
export default function Root() {
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
