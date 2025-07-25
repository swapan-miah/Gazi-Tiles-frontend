import { createBrowserRouter, Link } from "react-router-dom";
import Main from "../Layout/Main/Main";
import DashboardLayout from "../Layout/DashboardLayout/DashboardLayout";
import Home from "../Pages/Home/Home";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import Login from "../Pages/Login/Login";
import SignUp from "../Pages/SignUp/SignUp";
import Forget_Password from "../Pages/Forget_Password/Forget_Password";
import Company from "../Pages/Dashboard/Company/Company";
import Product from "../Pages/Dashboard/Product/Product";
import Purchase from "../Pages/Dashboard/Purchase/Purchase";
import Store from "../Pages/Dashboard/Store/Store";
import SaleForm from "../Pages/Dashboard/SaleForm/SaleForm";
import SalesList from "../Pages/Dashboard/SaleList/SaleList";
import Godown from "../Pages/Dashboard/Godown/Godown";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      { path: "/", element: <Home></Home> },
      { path: "/login", element: <Login></Login> },
      { path: "/signup", element: <SignUp></SignUp> },
      {
        path: "/forget-password",
        element: <Forget_Password></Forget_Password>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      // <PrivateRoute>
      <DashboardLayout></DashboardLayout>
      // </PrivateRoute>
    ),
    children: [
      {
        path: "/dashboard/add-company",
        element: <Company></Company>,
      },
      {
        path: "/dashboard/add-product",
        element: <Product></Product>,
      },
      {
        path: "/dashboard/purchase-form",
        element: <Purchase></Purchase>,
      },
      {
        path: "/dashboard/stock",
        element: <Store></Store>,
      },
      {
        path: "/dashboard/sale-form",
        element: <SaleForm></SaleForm>,
      },
      {
        path: "/dashboard/sales-history",
        element: <SalesList></SalesList>,
      },
      {
        path: "/dashboard/godown",
        element: <Godown></Godown>,
      },
    ],
  },
]);

export default router;
