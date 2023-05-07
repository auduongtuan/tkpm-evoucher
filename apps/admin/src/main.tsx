import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./routes/root";
import Categories from "./routes/categories";
import Merchants from "./pages/Merchants";
import Stores from "./pages/Stores";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import * as types from "styled-components/cssprop";
import "antd/dist/reset.css";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Campaigns from "./routes/campaigns";
import Games from "./routes/games";
import MerchantCreateForm from "./pages/Merchants/MerchantCreateForm";

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
            element: <MerchantCreateForm />,
          },
        ],
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "campaigns",
        element: <Campaigns />,
      },
      {
        path: "stores",
        element: <Stores />,
      },
      {
        path: "games",
        element: <Games />,
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
