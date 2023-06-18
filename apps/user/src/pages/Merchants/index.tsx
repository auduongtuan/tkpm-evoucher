import { deleteMerchant, getFullMerchant, getMerchants } from "api-client";
import RecordList from "@/components/RecordList";
import { Merchant, Employee, Store } from "database";
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
            title: "Number of employees",
            dataIndex: "employees",
            width: "15%",
            render: (employees: Employee[]) =>
              employees ? employees.length : 0,
          },
        ]}
      />
      <Outlet />
    </>
  );
};
export default Merchants;
