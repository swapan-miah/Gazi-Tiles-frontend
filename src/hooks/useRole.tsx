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
    fetch(`https://isoft4.washingmachinerepairqa.com/users/user/${email}`)
      .then((res) => res.json())
      .then((data) => {
        setRole(data.role);
        setLoading(false);
      })
      .catch(() => {
        setRole(null);
        setLoading(false);
      });
  }, [email]);

  return [role, loading];
}

export default useRole;
