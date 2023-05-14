import { deleteUser, getUsers } from "@/api-client";
import RecordList from "@/components/RecordList";
import { User, Voucher } from "database";
import { Outlet } from "react-router-dom";
const Users = () => {
  return (
    <>
      <RecordList<User>
        name="user"
        getFn={getUsers}
        deleteFn={deleteUser}
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
            title: "Phone",
            dataIndex: "phone",
          },
          {
            title: "Number of vouchers",
            dataIndex: "vouchers",
            width: "25%",
            render: (vouchers: Voucher[]) => {
              return vouchers ? vouchers.length : 0;
            },
          },
        ]}
      />
      <Outlet />
    </>
  );
};
export default Users;
