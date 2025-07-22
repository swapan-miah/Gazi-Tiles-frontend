import { createBrowserRouter, Link } from "react-router-dom";
import Main from "../Layout/Main/Main";
import DashboardLayout from "../Layout/DashboardLayout/DashboardLayout";
import Home from "../Pages/Home/Home";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import Login from "../Pages/Login/Login";
import SignUp from "../Pages/SignUp/SignUp";
import Forget_Password from "../Pages/Forget_Password/Forget_Password";

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
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
  },
]);

export default router;
