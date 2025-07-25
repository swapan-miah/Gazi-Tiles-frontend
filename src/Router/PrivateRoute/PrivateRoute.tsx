import React, { useContext } from "react";
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

  if (!auth) {
    return <progress className="progress w-56"></progress>;
  }

  const { user, loading } = auth;

  const [role, roleLoading] = useRole(user?.email ?? undefined);

  // role fetch হচ্ছে, তখনো progress দেখান
  if (loading || roleLoading) {
    return <progress className="progress w-56"></progress>;
  }

  // user ও role থাকলে children render করুন
  if (role) {
    return children;
  }

  // user আছে, role নাই, তখন login-এ পাঠান
  return <Navigate to="/login" state={{ from: location }} />;
};

export default PrivateRoute;
