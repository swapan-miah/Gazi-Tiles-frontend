import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider";
import useRole from "../../hooks/useRole";

import type { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
  timeoutDuration?: number; // লোডিং স্পিনার দেখানোর সময়সীমা (মিলি সেকেন্ডে), এর পরে user না পেলে লগইন পেজে যাবে।
}

const PrivateRoute = ({
  children,
  timeoutDuration = 5000,
}: PrivateRouteProps) => {
  const auth = useContext(AuthContext);
  const location = useLocation();
  const [showLoginAfterTimeout, setShowLoginAfterTimeout] = useState(false);

  // একটি নির্দিষ্ট সময় পর `showLoginAfterTimeout` স্টেটকে `true` করে।
  // এটি নিশ্চিত করে যে অন্তত `timeoutDuration` সময় পর্যন্ত স্পিনার দেখানো হবে।
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoginAfterTimeout(true);
    }, timeoutDuration);

    // কম্পোনেন্ট আনমাউন্ট হলে টাইমারটি পরিষ্কার করা হয়
    return () => clearTimeout(timer);
  }, [timeoutDuration]); // timeoutDuration পরিবর্তন হলে টাইমার রিসেট হবে

  // যদি AuthContext এখনো লোড না হয় (খুব বিরল ক্ষেত্রে)
  if (!auth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  const { user, loading: authLoading } = auth; // AuthContext থেকে user এবং loading স্টেট নেওয়া হচ্ছে
  // useRole hook ব্যবহার করে user এর ভূমিকা (role) এবং তার লোডিং স্টেট নেওয়া হচ্ছে
  const [role, roleLoading] = useRole(user?.email ?? undefined);

  // সামগ্রিক লোডিং স্টেট নির্ধারণ করা হচ্ছে
  // AuthContext লোড হচ্ছে অথবা useRole লোড হচ্ছে
  const isLoading = authLoading || roleLoading;

  // যদি এখনো লোডিং হয় অথবা user/role না পাওয়া যায় এবং timeout এখনো শেষ না হয়
  // তাহলে লোডিং স্পিনার দেখান
  if (
    isLoading || // যদি AuthContext বা useRole লোড হয়
    (!user && !showLoginAfterTimeout) || // যদি user না থাকে এবং timeout শেষ না হয়
    (user && !role && !showLoginAfterTimeout) // যদি user থাকে কিন্তু role না থাকে এবং timeout শেষ না হয়
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  // যদি user এবং role উভয়ই বিদ্যমান থাকে (এবং লোডিং শেষ হয়)
  // তাহলে সুরক্ষিত রুট এর চাইল্ড কম্পোনেন্ট রেন্ডার করুন
  if (user && role) {
    return children;
  }

  // যদি user বা role না থাকে এবং timeout শেষ হয়ে যায় (বা লোডিং শেষ হয়ে যায়)
  // তাহলে ব্যবহারকারীকে লগইন পৃষ্ঠায় রিডাইরেক্ট করুন
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
