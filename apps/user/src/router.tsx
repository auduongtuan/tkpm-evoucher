import Root from "./pages/root";
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home/Home";
import { RouterProviderProps } from "react-router-dom";
import MerchantDetail from "./pages/Merchants/MerchantDetail";
import CampaignDetail from "./pages/Campaigns/CampaignDetail";
import StoreList from "./pages/Stores/StoreList";
import StoreDetail from "./pages/Stores/StoreDetail";
import UserVoucher from "./pages/Users/UserVouchers";
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
      {
        path: "/campaign/:id",
        element: <CampaignDetail />,
      },
      {
        path: "/stores",
        element: <StoreList />,
      },
      {
        path: "/stores/category/:categoryId",
        element: <StoreList />,
      },
      {
        path: "/store/:id",
        element: <StoreDetail />,
      },
      {
        path: "/user/vouchers",
        element: <UserVoucher />,
      },
    ],
  },
]);
export default router;
