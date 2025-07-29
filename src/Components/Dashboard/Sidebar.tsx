import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Add Company", path: "/dashboard/add-company" },
  { name: "Add Product", path: "/dashboard/add-product" },
  { name: "Purchase Form", path: "/dashboard/purchase-form" },
  { name: "Stock", path: "/dashboard/stock" },
  { name: "Sales Form", path: "/dashboard/sale-form" },
  { name: "Sales History", path: "/dashboard/sales-history" },
  // { name: "Godown", path: "/dashboard/godown" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => (
  <>
    <div
      className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-200 sm:hidden ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
      aria-hidden="true"
    />
    <aside
      className={`fixed sm:static top-0 left-0 h-full w-48 bg-white shadow-lg flex flex-col py-8 px-2 z-50 transition-transform duration-200 sm:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
      }`}
    >
      <button
        className="sm:hidden absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
        onClick={onClose}
        aria-label="Close sidebar"
      >
        <span className="material-icons">close</span>
      </button>
      <nav className="flex flex-col gap-2 mt-8 sm:mt-0">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 font-medium transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600 ${
                isActive ? "bg-blue-100 text-blue-700" : ""
              }`
            }
            onClick={onClose}
          >
            <span className="truncate">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  </>
);

export default Sidebar;
