import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./routes/root.tsx";
import Merchants from "./routes/merchants.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import * as types from "styled-components/cssprop";
import "antd/dist/reset.css";
import { QueryClient, QueryClientProvider } from "react-query";

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
