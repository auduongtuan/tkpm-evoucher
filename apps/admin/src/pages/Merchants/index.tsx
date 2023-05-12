import { deleteMerchant, getMerchant, getMerchants } from "@/api-client";
import RecordList from "@/components/RecordList";
import { Merchant, Staff, Store } from "database";
import { Outlet } from "react-router-dom";
const Merchants = () => {
  return (
    <>
      <RecordList<Merchant>
        name="merchant"
        getFn={getMerchants}
        deleteFn={deleteMerchant}
        columns={[
          {
            title: "Name",
            dataIndex: "name",
          },
          {
            title: "Number of stores",
            dataIndex: "stores",
            width: "15%",
            render: (stores: Store[]) => (stores ? stores.length : 0),
          },
          {
            title: "Number of staffs",
            dataIndex: "staffs",
            width: "15%",
            render: (staffs: Staff[]) => (staffs ? staffs.length : 0),
          },
        ]}
      />
      <Outlet />
    </>
  );
};
export default Merchants;
