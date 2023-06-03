import { Layout, Menu, MenuProps, Typography, theme } from "antd";
const { Header } = Layout;

const items1: MenuProps["items"] = ["1", "2", "3"].map((key) => ({
  key,
  label: `nav ${key}`,
}));
const MainHeader = () => {
  const {
    token: { colorTextLightSolid },
  } = theme.useToken();
  return (
    <Header className="header">
      <Typography style={{ color: colorTextLightSolid }}>eVoucher</Typography>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        items={items1}
      />
    </Header>
  );
};

export default MainHeader;
