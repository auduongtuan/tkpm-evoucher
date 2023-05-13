import { deleteStaff, getStaff, getStaffs } from "@/api-client";
import RecordList from "@/components/RecordList";
import { Merchant, Staff, Store } from "database";
import { Outlet } from "react-router-dom";
const Staffs = () => {
  return (
    <>
      <RecordList<Staff>
        name="staff"
        getFn={getStaffs}
        deleteFn={deleteStaff}
        columns={[
          {
            title: "Full Name",
            dataIndex: "fullName",
          },
          {
            title: "Email",
            dataIndex: "email",
          },
          {
            title: "Merchant",
            dataIndex: "merchant",
            width: "25%",
            render: (merchant: Merchant) => (merchant ? merchant.name : ""),
          },
        ]}
      />
      <Outlet />
    </>
  );
};
export default Staffs;
