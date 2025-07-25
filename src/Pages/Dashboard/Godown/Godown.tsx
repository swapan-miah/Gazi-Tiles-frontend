import { useState } from "react";
import PurchaseRecordForGodown from "./PurchaseRecordForGodown";
import SalesRecordForGodown from "./SalesRecordForGodown";

// আজকের তারিখ YYYY-MM-DD ফরম্যাটে বের করা
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Godown = () => {
  const [date, setDate] = useState<string>(getTodayDate());

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label htmlFor="purchase-date" className="block mb-2 font-medium">
          তারিখ নির্বাচন করুন:
        </label>
        <input
          type="date"
          id="purchase-date"
          value={date}
          onChange={handleDateChange}
          className="border px-3 py-2 rounded-md"
        />
      </div>

      <div className="flex gap-4 flex-wrap">
        {date && <PurchaseRecordForGodown date={date} />}
        {date && <SalesRecordForGodown date={date} />}
      </div>
    </div>
  );
};

export default Godown;
