import { deleteCategory, getCategory, getCategories } from "api-client";
import RecordList from "ui/admin-components/RecordList";
import { Category, Store } from "database";
import { Outlet } from "react-router-dom";
const Categories = () => {
  return (
    <>
      <RecordList<Category>
        name="category"
        getFn={getCategories}
        deleteFn={deleteCategory}
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
