import React from "react";

import { Layout, theme } from "antd";
import MainHeader from "./MainHeader";
import LoginModal from "../pages/Auth/LoginModal";
import RegisterModal from "../pages/Auth/RegisterModal";
const { Content } = Layout;

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <div className="min-h-screen font-sans">
      <LoginModal />
      <RegisterModal />
      <MainHeader />
      {/* <MainSidebar /> */}
      <div className="flex justify-center w-full min-h-screen p-6 bg-gray-100">
        {/* <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="grow-0 shrink-0 w-full max-w-[1120px] p-4 m-0 min-h-[280px] ">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
