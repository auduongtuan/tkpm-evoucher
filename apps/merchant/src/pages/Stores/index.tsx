import { deleteStore, getStores } from "api-client";
import { Merchant, Store, Category } from "database";
import { Outlet } from "react-router-dom";
import RecordList from "ui/admin-components/RecordList";
import useAdminStore from "ui/hooks/useAdminStore";
const Stores = () => {
  const employee = useAdminStore((state) => state.employee);
  return (
    <>
      <Outlet />
      <RecordList<Store>
        name="store"
        getFn={async () =>
          getStores({
            merchantId:
              employee && employee.merchantId ? employee.merchantId : undefined,
          })
        }
        deleteFn={deleteStore}
        columns={[
          {
            title: "Name",
            dataIndex: "name",
          },
          {
            title: "Merchant",
            dataIndex: "merchant",
            width: "20%",

            render: (merchant: Merchant) => merchant && merchant.name,
          },
          {
            title: "Categories",
            dataIndex: "categories",
            width: "15%",

            render: (categories: Category[]) => {
              return categories.map((category) => category.name).join(", ");
            },
          },
        ]}
      />
    </>
  );
};
export default Stores;
