import {
  deleteCategory,
  getCategory,
  getCategories,
  getMerchantCategories,
} from "api-client";
import RecordList from "ui/admin-components/RecordList";
import { Category, Store } from "database";
import { Outlet } from "react-router-dom";
import useAdminStore from "ui/hooks/useAdminStore";
const Categories = () => {
  const employee = useAdminStore((state) => state.employee);
  const merchantId = employee?.merchantId;
  if (!merchantId) return null;
  return (
    <>
      <RecordList<Category>
        name="category"
        getFn={async () => await getMerchantCategories(merchantId)}
        deleteFn={deleteCategory}
        viewOnly
        columns={[
          {
            title: "Name",
            dataIndex: "name",
          },
          {
            title: "Number of stores",
            dataIndex: "stores",
            width: "25%",
            render: (stores: Store[]) => (stores ? stores.length : 0),
          },
        ]}
      />
      <Outlet />
    </>
  );
};
export default Categories;
