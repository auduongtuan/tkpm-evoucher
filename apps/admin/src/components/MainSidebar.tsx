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
import useAdminStore from "ui/hooks/useAdminStore";
import { SystemLogo } from "ui";
const { Sider } = Layout;
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
];

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
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const handleMenuClick = ({ key }) => {
    const { path } = navigationItems.find((item) => item.key === key) || {};
    if (path) {
      navigate(path);
    }
  };
  const employee = useAdminStore((state) => state.employee);
  const logout = useAdminStore((state) => state.logout);
  return (
    <Sider
      // collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div className="flex flex-col h-full">
        <SystemLogo subName="Admin" />
        <Menu
          theme="dark"
          defaultSelectedKeys={[location.pathname.replace("/", "_")]}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
        />
        <div className="flex-grow"></div>
        <div className="flex-grow-0 px-6 py-4 text-white">
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
