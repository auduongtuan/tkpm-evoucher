import { Button, Layout, Menu, MenuProps, Typography, theme } from "antd";
import { Link } from "ui";
const { Header } = Layout;
import useAppStore from "@/stores/useAppStore";
import useUserAuth from "@/hooks/useUserAuth";
import { useNavigate } from "react-router-dom";

const MainHeader = () => {
  const {
    token: { colorTextLightSolid },
  } = theme.useToken();
  const loginModal = useAppStore((state) => state.loginModal);
  const registerModal = useAppStore((state) => state.registerModal);
  const { authenticated, user, logout } = useUserAuth();
  const navigate = useNavigate();
  const items1: MenuProps["items"] = [
    {
      key: "/",
      label: "Home",
    },
    {
      key: "/stores",
      label: "Stores",
    },
    ...(authenticated
      ? [
          {
            key: "/user/vouchers",
            label: "Your Vouchers",
          },
        ]
      : []),
  ];
  return (
    <Header className="flex items-center header">
      <div className="flex items-center grow">
        <Link to="/">
          <Typography
            style={{ color: colorTextLightSolid }}
            className="text-xl font-semibold"
          >
            eVoucher
          </Typography>
        </Link>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["/"]}
          items={items1}
          onSelect={(item) => navigate(item.key)}
          className="ml-8 grow"
        />
      </div>
      <div>
        {authenticated ? (
          <>
            <div className="inline text-white">
              Hi, <span className="font-semibold">{user?.fullName}</span>
            </div>
            <Link className="ml-4 text-white" onClick={() => logout()}>
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link
              className="text-white"
              onClick={() => {
                loginModal.setOpen(true);
              }}
            >
              Log in
            </Link>
            <Link
              className="ml-4 text-white"
              onClick={() => {
                registerModal.setOpen(true);
              }}
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </Header>
  );
};

export default MainHeader;
