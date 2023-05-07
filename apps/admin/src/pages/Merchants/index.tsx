import MerchantList from "@/pages/Merchants/MerchantList";
import { Outlet } from "react-router-dom";
const Merchants = () => {
  return (
    <>
      <MerchantList />
      <Outlet />
    </>
  );
};
export default Merchants;
