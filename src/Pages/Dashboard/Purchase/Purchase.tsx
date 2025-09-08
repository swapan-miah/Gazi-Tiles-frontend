import { useState } from "react";
import AddPurchase from "./AddPurchase";
import PurchaseHistory from "./PurchaseHistory";
import PaymentNotice from "../../../Components/PaymentNotice/PaymentNotice";

const Purchase = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="p-4">
      <PaymentNotice></PaymentNotice>
      <h2 className="text-2xl font-bold mb-6 text-center">Purchase Section</h2>
      <AddPurchase onAdded={() => setRefresh(!refresh)} />
      <PurchaseHistory refresh={refresh} />
    </div>
  );
};

export default Purchase;
