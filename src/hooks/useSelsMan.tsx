import React, { useEffect, useState } from "react";

interface SalesMan {
  id: string;
  name: string;
  // Add other fields as needed
}

function useSelsMan(): [SalesMan[], boolean] {
  const [salesMen, setSalesMen] = useState<SalesMan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Replace with your actual API call or logic
    fetch(`https://isoft4.washingmachinerepairqa.com/users/user/${email}`)
      .then((res) => res.json())
      .then((data) => {
        setSalesMen(data);
        setLoading(false);
      })
      .catch(() => {
        setSalesMen([]);
        setLoading(false);
      });
  }, []);

  return [salesMen, loading];
}

export default useSelsMan;
