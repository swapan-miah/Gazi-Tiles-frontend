import { createBrowserRouter, Link } from "react-router-dom";
import Main from "../Layout/Main/Main";
import DashboardLayout from "../Layout/DashboardLayout/DashboardLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [{ path: "/", element: <Home></Home> }],
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
