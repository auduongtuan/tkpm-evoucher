import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./routes/root";
import Categories from "./pages/Categories";
import Merchants from "./pages/Merchants";
import Stores from "./pages/Stores";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import * as types from "styled-components/cssprop";
import GameForm from "./pages/Games/GameForm";
import "antd/dist/reset.css";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Campaigns from "./pages/Campaigns";
import Games from "./pages/Games";
import MerchantForm from "./pages/Merchants/MerchantForm";
import StoreForm from "./pages/Stores/StoreForm";
import CategoryForm from "./pages/Categories/CategoryForm";

// Create a client
const queryClient = new QueryClient();
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
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
