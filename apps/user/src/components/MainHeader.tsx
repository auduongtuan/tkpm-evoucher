import { Button, Layout, Menu, MenuProps, Typography, theme } from "antd";
const { Header } = Layout;

const items1: MenuProps["items"] = [
  {
    key: "/",
    label: "Home",
  },
  {
    key: "/stores",
    label: "Stores",
  },
  {
    key: "/campaigns",
    label: "Campaigns",
  },
];
const MainHeader = () => {
  const {
    token: { colorTextLightSolid },
  } = theme.useToken();
  return (
    <Header className="flex items-center header">
      <div className="flex items-center grow">
        <Typography
          style={{ color: colorTextLightSolid }}
          className="text-xl font-semibold"
        >
          eVoucher
        </Typography>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["/"]}
          items={items1}
          onSelect={(item) => console.log(item)}
          className="ml-8"
        />
      </div>
      <div>
        <Button type="ghost" className="" color="white">
          Login
        </Button>
      </div>
    </Header>
  );
};

export default MainHeader;
