import Root from "./routes/root";
import Categories from "./pages/Categories";
import Merchants from "./pages/Merchants";
import Stores from "./pages/Stores";
import { createBrowserRouter } from "react-router-dom";
import GameForm from "./pages/Games/GameForm";
import Campaigns from "./pages/Campaigns";
import Games from "./pages/Games";
import MerchantForm from "./pages/Merchants/MerchantForm";
import StoreForm from "./pages/Stores/StoreForm";
import CategoryForm from "./pages/Categories/CategoryForm";
import CampaignForm from "./pages/Campaigns/CampaignForm";
import Staffs from "./pages/Staffs";
import StaffForm from "./pages/Staffs/StaffForm";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "merchants",
        element: <Merchants />,
        children: [
          {
            path: "new",
            element: <MerchantForm />,
          },
          {
            path: "edit/:id",
            element: <MerchantForm />,
          },
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
        path: "staffs",
        element: <Staffs />,
        children: [
          {
            path: "new",
            element: <StaffForm />,
          },
          {
            path: "edit/:id",
            element: <StaffForm />,
          },
        ],
      },
    ],
  },
]);
export default router;
