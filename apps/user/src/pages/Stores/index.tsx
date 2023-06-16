import { deleteStore, getStores } from "api-client";
import { Merchant, Store, Category } from "database";
import { Outlet } from "react-router-dom";
import RecordList from "@/components/RecordList";
const Stores = () => {
  return (
    <>
      <Outlet />
      <RecordList<Store>
        name="store"
        getFn={getStores}
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
              console.log(categories);
              return categories.map((category) => category.name).join(", ");
            },
          },
        ]}
      />
    </>
  );
};
export default Stores;
