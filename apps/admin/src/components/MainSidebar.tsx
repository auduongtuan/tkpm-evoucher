import React, { useState } from "react";

import type { MenuProps } from "antd";
import { ConfigProvider, Layout, Menu, Typography, theme } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;
import {
  RiStoreFill,
  RiStore2Fill,
  RiHome2Fill,
  RiFilter2Fill,
  RiGamepadFill,
  RiImageEditFill,
} from "react-icons/ri";
import { R } from "react-icons/hi2";
import { SubMenuType } from "antd/es/menu/hooks/useItems";
type MenuItem = Required<MenuProps>["items"][number];

type NavigationItem = {
  label: React.ReactNode;
  key: React.Key;
  icon?: React.ReactNode;
  path?: string;
  parent?: string;
};
const navigationItems: NavigationItem[] = [
  { label: "Home", key: "_", path: "/", icon: <RiHome2Fill /> },
  {
    label: "Merchants",
    key: "_merchants",
    path: "/merchants",
    icon: <RiStore2Fill />,
  },
  {
    label: "Stores",
    key: "_stores",
    path: "/stores",
    icon: <RiStoreFill />,
  },
  {
    label: "Categories",
    key: "_categories",
    path: "/categories",
    icon: <RiFilter2Fill />,
  },
  {
    label: "Games",
    key: "_games",
    path: "/games",
    icon: <RiGamepadFill />,
  },
  {
    label: "Campaigns",
    key: "_campaigns",
    path: "/campaigns",
    icon: <RiImageEditFill />,
  },
  // {
  //   label: "Merchant List",
  //   key: "_merchants_list",
  //   path: "/merchants",
  //   parent: "_merchants",
  // },
];
// function getItem(navItem: NavigationItem) {
//   const { path, parent, ...rest } = navItem;

//   return {
//     ...rest,
//     children:
//       navigationItems
//         .filter(
//           (navItem) => "parent" in navItem || navItem.parent == navItem.key
//         )
//         .map((subNavItem) => getItem(subNavItem)) || undefined,
//   };
// }

const items: MenuItem[] = navigationItems.reduce<MenuItem[]>((acc, navItem) => {
  const { path, parent, ...rest } = navItem;
  const menuItem: MenuItem = { ...rest };
  if (!parent) {
    acc.push(menuItem);
  } else {
    const parentItem = acc.find((parentItem) => parentItem?.key == parent);
    if (parentItem) {
      if (!("children" in parentItem))
        (parentItem as SubMenuType).children = [];
      (parentItem as SubMenuType).children.push(menuItem);
    }
  }
  return acc;
}, []);

const MainSidebar = () => {
  const {
    token: { colorBgContainer, colorTextLightSolid },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const handleMenuClick = ({ key }) => {
    const { path } = navigationItems.find((item) => item.key === key) || {};
    console.log(path);
    if (path) {
      navigate(path);
    }
  };
  return (
    <Sider
      // collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      {/* <div
        style={{
          height: 32,
          margin: 16,
          background: "rgba(255, 255, 255, 0.2)",
        }}
      /> */}
      <Typography.Title
        level={4}
        color={colorTextLightSolid}
        css={`
          color: ${colorTextLightSolid} !important;
          padding: 16px 24px;
          margin: 0 !important;
        `}
      >
        eVoucher
      </Typography.Title>
      <Menu
        theme="dark"
        defaultSelectedKeys={[location.pathname.replace("/", "_")]}
        mode="inline"
        items={items}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default MainSidebar;
