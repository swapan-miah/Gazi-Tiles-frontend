// src/components/Store.tsx
import { useEffect, useState } from "react";
import axios from "axios";

interface IStore {
  _id: string;
  product_code: string;
  company: string;
  caton: number;
  feet: number;
}

const Store = () => {
  const [storeData, setStoreData] = useState<IStore[]>([]);
  const [filteredData, setFilteredData] = useState<IStore[]>([]);
  const [searchCode, setSearchCode] = useState("");
  const [searchCompany, setSearchCompany] = useState("");

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_Basic_Api}/api/store/all`
        );
        setStoreData(res.data.data);
        setFilteredData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch store data", err);
      }
    };
    fetchStore();
  }, []);

  useEffect(() => {
    const filtered = storeData.filter((item) => {
      const codeMatch = item.product_code
        .toLowerCase()
        .includes(searchCode.toLowerCase());
      const companyMatch = item.company
        .toLowerCase()
        .includes(searchCompany.toLowerCase());
      return codeMatch && companyMatch;
    });
    setFilteredData(filtered);
  }, [searchCode, searchCompany, storeData]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📦 Store Inventory</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Search by Product Code"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-full md:w-1/2"
        />
        <input
          type="text"
          placeholder="🏭 Search by Company"
          value={searchCompany}
          onChange={(e) => setSearchCompany(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-full md:w-1/2"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-400 text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-400 px-4 py-2">#</th>
              <th className="border border-gray-400 px-4 py-2">Product Code</th>
              <th className="border border-gray-400 px-4 py-2">Company</th>
              <th className="border border-gray-400 px-4 py-2">Caton</th>
              <th className="border border-gray-400 px-4 py-2">Feet</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="border border-gray-400 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {item.product_code}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {item.company}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {item.caton}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {item.feet}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center border border-gray-400 px-4 py-2 text-gray-500"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Store;
