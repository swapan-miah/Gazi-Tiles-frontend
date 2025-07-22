import { useState, useEffect } from "react";

const useRole = (email) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("email is", email);

  useEffect(() => {
    if (email) {
      fetch(`https://isoft4.washingmachinerepairqa.com/users/user/${email}`)
        .then((res) => res.json())
        .then((data) => {
          setRole(data?.role); // assuming the API returns { role: 'admin' or 'sels-man' }
          setLoading(false);
        });
    }
  }, [email]);

  console.log("role is", role);

  return [role, loading];
};

export default useRole;
