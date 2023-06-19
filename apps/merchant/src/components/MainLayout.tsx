import React from "react";

import { Layout, theme } from "antd";
import MainSidebar from "./MainSidebar";
const { Content } = Layout;

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout className="min-h-screen">
      <MainSidebar />
      <div className="flex justify-center p-6 grow">
        {/* <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb> */}
        <Content
          className="max-w-screen-xl p-6 bg-white rounded-md shrink-0"
          // style={{
          //   padding: 24,
          //   margin: 0,
          //   minHeight: 280,
          //   background: colorBgContainer,
          // }}
        >
          {children}
        </Content>
      </div>
    </Layout>
  );
};

export default MainLayout;
