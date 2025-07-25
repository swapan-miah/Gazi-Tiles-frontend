import { useState } from "react";
import AddPurchase from "./AddPurchase";
import PurchaseHistory from "./PurchaseHistory";

const Purchase = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Purchase Section</h2>
      <AddPurchase onAdded={() => setRefresh(!refresh)} />
      <PurchaseHistory refresh={refresh} />
    </div>
  );
};

export default Purchase;
