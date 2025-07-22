import React, { useContext, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider";
import useAdmin from "../../hooks/useRole";
import Header from "../../Components/Dashboard/Header";
import Sidebar from "../../Components/Dashboard/Sidebar";

const DashboardLayout = () => {
  const { user } = useContext(AuthContext) || {};
  const email = user && typeof user.email === "string" ? user.email : undefined;
  const [isAdmin] = useAdmin(email);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => setSidebarOpen((open) => !open);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header onSidebarToggle={handleSidebarToggle} />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
        <main className="flex-1 p-2 sm:p-6 bg-gray-50 rounded-lg shadow-md m-2 sm:m-4 overflow-auto transition-all duration-200 z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
