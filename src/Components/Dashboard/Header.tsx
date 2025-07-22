import React, { useContext, useState, useRef } from "react";
import { AuthContext } from "../../contexts/AuthProvider";

interface HeaderProps {
  onSidebarToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSidebarToggle }) => {
  const { user, logOut } = useContext(AuthContext) || {};
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    if (logOut) await logOut();
  };

  return (
    <header className="backdrop-blur-md bg-white/80 shadow rounded-xl mx-2 sm:mx-4 mt-2 sm:mt-4 mb-2 px-4 sm:px-8 py-2 sm:py-3 flex items-center justify-between border border-gray-100 z-50 relative">
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          className="sm:hidden mr-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 shadow transition"
          onClick={onSidebarToggle}
          aria-label="Toggle sidebar"
        >
          {/* Hamburger SVG icon */}
          <svg
            className="w-6 h-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <img
          src="/vite.svg"
          alt="Logo"
          className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-white"
        />
        <span className="text-xl sm:text-2xl font-bold text-blue-700 select-none">
          Gazi Tiles
        </span>
        <span className="ml-2 px-2 py-1 rounded-lg bg-blue-50 text-xs font-semibold text-blue-600 hidden sm:inline-block">
          Dashboard
        </span>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 relative">
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 focus:outline-none group"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="User Avatar"
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-blue-400 shadow"
              />
            ) : (
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-blue-500 flex items-center justify-center text-lg sm:text-xl font-bold text-white border-2 border-white shadow">
                {user?.displayName
                  ? user.displayName.charAt(0)
                  : user?.email?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            <div className="hidden md:flex flex-col items-start">
              <span className="text-gray-800 font-semibold text-base">
                {user?.displayName || user?.email?.split("@")[0] || "User"}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {user?.email}
              </span>
            </div>
          </button>
          <div
            className={`absolute right-0 mt-3 w-56 sm:w-60 bg-white rounded-xl shadow-2xl py-3 border border-blue-100 transition-all duration-200 z-[99] ${
              dropdownOpen
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
            style={{ minWidth: "200px" }}
          >
            <div className="px-5 py-2 border-b border-gray-100 flex items-center gap-3">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-400"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-lg font-bold text-white border-2 border-white">
                  {user?.displayName
                    ? user.displayName.charAt(0)
                    : user?.email?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              <div>
                <div className="font-semibold text-gray-800">
                  {user?.displayName || "User"}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user?.email}
                </div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-5 py-2 mt-1 hover:bg-blue-50 text-blue-600 font-semibold rounded-b-xl flex items-center gap-2 transition"
            >
              <span className="material-icons text-base"></span>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
