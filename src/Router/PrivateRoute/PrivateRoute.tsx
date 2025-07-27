import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider";
import useRole from "../../hooks/useRole";

import type { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const auth = useContext(AuthContext);
  const location = useLocation();

  // যদি AuthContext এখনো লোড না হয়
  if (!auth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  const { user, loading } = auth;

  // user না থাকলে বা auth লোড না হলে progress দেখান
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  // role hook - email null হলে undefined পাঠানো হবে
  const [role, roleLoading] = useRole(user.email ?? undefined);

  // role লোড না হলে progress
  if (roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  // role থাকলে চাইল্ড রেন্ডার করুন
  if (role) {
    return children;
  }

  // role না থাকলে login পেইজে পাঠান
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
