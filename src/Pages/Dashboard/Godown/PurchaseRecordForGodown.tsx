import { useQuery } from "@tanstack/react-query";

interface PurchaseRecord {
  product_code: string;
  company: string;
  total_caton: number;
  total_feet: number;
  invoices: string[];
  date: string;
}

const PurchaseRecordForGodown = ({ date }: { date: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["purchase-record", date],
    queryFn: async () => {
      const res = await fetch(
        `https://gazi-tiles-backend.vercel.app/api/purchase/group/custom-date?date=${date}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch purchase records");
      }
      const json = await res.json();
      return json.data as PurchaseRecord[];
    },
  });

  if (isLoading) return <p>লোড হচ্ছে...</p>;
  if (error) return <p>ডাটা আনতে সমস্যা হয়েছে</p>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">গোডাউন পারচেজ রেকর্ড</h2>
      <table className="w-full border border-gray-400">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 px-3 py-2 text-left">
              Product Code
            </th>
            <th className="border border-gray-400 px-3 py-2 text-right">
              Caton
            </th>
            <th className="border border-gray-400 px-3 py-2 text-right">
              Feet
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border border-gray-400 px-3 py-2">
                {item.product_code}
              </td>
              <td className="border border-gray-400 px-3 py-2 text-right">
                {item.total_caton}
              </td>
              <td className="border border-gray-400 px-3 py-2 text-right">
                {item.total_feet}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseRecordForGodown;
