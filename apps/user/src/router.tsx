import Root from "./pages/root";
// import Categories from "./pages/Categories";
// import Merchants from "./pages/Merchants";
// import Stores from "./pages/Stores";
import { createBrowserRouter } from "react-router-dom";
// import GameForm from "./pages/Games/GameForm";
// import Campaigns from "./pages/Campaigns";
// import Games from "./pages/Games";
// import MerchantForm from "./pages/Merchants/MerchantForm";
// import StoreForm from "./pages/Stores/StoreForm";
// import CategoryForm from "./pages/Categories/CategoryForm";
// import CampaignForm from "./pages/Campaigns/CampaignForm";
// import Employees from "./pages/Employees";
// import EmployeeForm from "./pages/Employees/EmployeeForm";
// import Users from "./pages/Users";
// import UserForm from "./pages/Users/UserForm";
// import Vouchers from "./pages/Vouchers";
// import VoucherForm from "./pages/Vouchers/VoucherForm";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home/Home";
import { RouterProviderProps } from "react-router-dom";
import MerchantDetail from "./pages/Merchants/MerchantDetail";
const router: RouterProviderProps["router"] = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/merchant/:id",
        element: <MerchantDetail />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
export default router;
