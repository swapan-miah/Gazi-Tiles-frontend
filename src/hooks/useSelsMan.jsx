import React, { useEffect, useState } from "react";

const useSelsMan = (email) => {
  const [isSelsMan, setIsSelsMan] = useState(false);
  const [isSelsManLoading, setIsSelsManLoading] = useState(true);

  useEffect(() => {
    fetch(`https://isoft4.washingmachinerepairqa.com/users/user/${email} `)
      .then((res) => res.json())
      .then((data) => {
        setIsUser(data?.isUser);
        setIsUserLoading(false);
      });
  }, [email]);
  return [isSelsMan, isSelsManLoading];
};

export default useSelsMan;
