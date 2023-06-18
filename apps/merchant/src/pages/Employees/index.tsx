import {
  deleteEmployee,
  getEmployee,
  getEmployees,
  getMerchantEmployees,
} from "api-client";
import RecordList from "ui/admin-components/RecordList";
import { Merchant, Employee, Store } from "database";
import { Outlet } from "react-router-dom";
import { Tag } from "antd";
import useAdminStore from "ui/hooks/useAdminStore";
const Employees = () => {
  const merchantId = useAdminStore((state) => state.employee?.merchantId);
  if (!merchantId) return null;
  return (
    <>
      <RecordList<Employee>
        name="employee"
        getFn={() => getMerchantEmployees(merchantId)}
        deleteFn={deleteEmployee}
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
          // {
          //   title: "Merchant",
          //   dataIndex: "merchant",
          //   width: "25%",
          //   render: (merchant: Merchant, record: Employee) => {
          //     if (record.systemAdmin) {
          //       return <Tag color="purple">System Admin</Tag>;
          //     }
          //     if (merchant) {
          //       return merchant.name;
          //     }

          //     return "";
          //   },
          // },
        ]}
      />
      <Outlet />
    </>
  );
};
export default Employees;
