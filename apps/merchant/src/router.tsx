import Root from "./pages/root";
import Categories from "./pages/Categories";
import Merchant from "./pages/Merchant";
import Stores from "./pages/Stores";
import { RouterProviderProps, createBrowserRouter } from "react-router-dom";
import GameForm from "./pages/Games/GameForm";
import Campaigns from "./pages/Campaigns";
import Games from "./pages/Games";
import MerchantForm from "./pages/Merchant/MerchantForm";
import StoreForm from "./pages/Stores/StoreForm";
import CategoryForm from "./pages/Categories/CategoryForm";
import CampaignForm from "./pages/Campaigns/CampaignForm";
import Employees from "./pages/Employees";
import EmployeeForm from "./pages/Employees/EmployeeForm";
import Vouchers from "./pages/Vouchers";
import VoucherForm from "./pages/Vouchers/VoucherForm";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home/Home";
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
        path: "merchant",
        element: <Merchant />,
        children: [
          {
            path: "edit",
            element: <MerchantForm />,
          },
          // {
          //   path: "edit/:id",
          //   element: <MerchantForm />,
          // },
        ],
      },
      {
        path: "categories",
        element: <Categories />,
        children: [
          {
            path: "new",
            element: <CategoryForm />,
          },
          {
            path: "edit/:id",
            element: <CategoryForm />,
          },
        ],
      },
      {
        path: "campaigns",
        element: <Campaigns />,
        children: [
          {
            path: "new",
            element: <CampaignForm />,
          },
          {
            path: "edit/:id",
            element: <CampaignForm />,
          },
        ],
      },
      {
        path: "stores",
        element: <Stores />,
        children: [
          {
            path: "new",
            element: <StoreForm />,
          },
          {
            path: "edit/:id",
            element: <StoreForm />,
          },
        ],
      },
      {
        path: "games",
        element: <Games />,
        children: [
          {
            path: "new",
            element: <GameForm />,
          },
          {
            path: "edit/:id",
            element: <GameForm />,
          },
        ],
      },
      {
        path: "employees",
        element: <Employees />,
        children: [
          {
            path: "new",
            element: <EmployeeForm />,
          },
          {
            path: "edit/:id",
            element: <EmployeeForm />,
          },
        ],
      },
      {
        path: "employees",
        element: <Employees />,
        children: [
          {
            path: "new",
            element: <EmployeeForm />,
          },
          {
            path: "edit/:id",
            element: <EmployeeForm />,
          },
        ],
      },
      {
        path: "vouchers",
        element: <Vouchers />,
        children: [
          {
            path: "new",
            element: <VoucherForm />,
          },
          {
            path: "edit/:id",
            element: <VoucherForm />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
export default router;
