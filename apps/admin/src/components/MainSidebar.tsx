import React, { useState } from "react";

import type { MenuProps } from "antd";
import { Button, Layout, Menu, Typography, theme } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  RiStoreFill,
  RiStore2Fill,
  RiHome2Fill,
  RiFilter2Fill,
  RiGamepadFill,
  RiImageEditFill,
  RiCoupon2Fill,
  RiShieldUserFill,
  RiUser3Fill,
} from "react-icons/ri";
import { SubMenuType } from "antd/es/menu/hooks/useItems";
import useEmployeeAuth from "ui/hooks/useEmployeeAuth";
const { Header, Content, Footer, Sider } = Layout;
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
  {
    label: "Employees",
    key: "_employees",
    path: "/employees",
    icon: <RiShieldUserFill />,
  },
  {
    label: "Users",
    key: "_users",
    path: "/users",
    icon: <RiUser3Fill />,
  },
  {
    label: "Vouchers",
    key: "_vouchers",
    path: "/vouchers",
    icon: <RiCoupon2Fill />,
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
    if (path) {
      navigate(path);
    }
  };
  const { employee, logout } = useEmployeeAuth(true);
  return (
    <Sider
      // collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div className="flex flex-col h-full">
        <Typography.Title
          level={4}
          color={colorTextLightSolid}
          className="text-white m-0 py-4 px-6"
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
        <div className="flex-grow"></div>
        <div className="flex-grow-0 text-white py-4 px-6">
          <div>{employee && employee.fullName}</div>
          <Button
            type="link"
            onClick={() => logout && logout()}
            className="-mx-4"
          >
            Logout
          </Button>
        </div>
      </div>
    </Sider>
  );
};

export default MainSidebar;
