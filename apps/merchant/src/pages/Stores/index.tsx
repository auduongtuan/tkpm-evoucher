import { deleteStore, getStores } from "api-client";
import { Merchant, Store, Category } from "database";
import { Outlet } from "react-router-dom";
import RecordList from "ui/admin-components/RecordList";
import useEmployeeAuth from "ui/hooks/useEmployeeAuth";
const Stores = () => {
  const { authenticated, employee } = useEmployeeAuth(false);
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
