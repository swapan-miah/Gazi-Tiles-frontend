import { useState, useEffect } from "react";

function useRole(email: string | undefined): [string | null, boolean] {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!email) {
      setRole(null);
      setLoading(false);
      return;
    }
    // Replace with your actual API call or logic
    fetch(`${import.meta.env.VITE_Basic_Api}/api/users/email/${email}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched user data:", data);
        setRole(data.user?.role || null);
        setLoading(false);
      })
      .catch(() => {
        setRole(null);
        setLoading(false);
      });
  }, [email]);

  console.log(role, loading);

  return [role, loading];
}

export default useRole;
