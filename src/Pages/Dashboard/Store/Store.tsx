import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

interface IStore {
  _id: string;
  product_code: string;
  company: string;
  feet: number;
  height: number;
  width: number;
  per_caton_to_pcs: number;
}

interface ExtendedStore extends IStore {
  fullCartons: number;
  remainingPieces: number;
}

const Store = () => {
  const [storeData, setStoreData] = useState<ExtendedStore[]>([]);
  const [filteredData, setFilteredData] = useState<ExtendedStore[]>([]);
  const [searchCode, setSearchCode] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchStore = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_Basic_Api}/api/store/all`
        );

        if (!res.data?.data || !Array.isArray(res.data.data)) {
          throw new Error("Invalid data format received from server");
        }

        const extended: ExtendedStore[] = res.data.data.map((item: IStore) => {
          const { height, width, feet, per_caton_to_pcs } = item;

          if (!height || !width || !feet || !per_caton_to_pcs) {
            console.warn("Missing values in item:", item);
            return { ...item, fullCartons: 0, remainingPieces: 0 };
          }

          const areaPerPiece = (height * width) / 144;
          if (areaPerPiece <= 0) {
            return { ...item, fullCartons: 0, remainingPieces: 0 };
          }

          const totalPieces = feet / areaPerPiece;
          let fullCartons = Math.floor(totalPieces / per_caton_to_pcs);
          let remainingPieces = Math.round(
            totalPieces - fullCartons * per_caton_to_pcs
          );

          if (remainingPieces < 0) {
            fullCartons -= 1;
            remainingPieces = per_caton_to_pcs + remainingPieces;
          }

          if (remainingPieces == per_caton_to_pcs) {
            fullCartons += 1;
            remainingPieces = 0;
          }

          return {
            ...item,
            fullCartons: Math.max(fullCartons, 0),
            remainingPieces: Math.max(remainingPieces, 0),
          };
        });

        setStoreData(extended);
        setFilteredData(extended);
        setErrorMessage("");
      } catch (err) {
        const axiosError = err as AxiosError;
        let message = axiosError.message || "❌ Failed to fetch store data";
        const data = axiosError.response?.data;
        if (data && typeof data === "object" && "message" in data) {
          message = (data as { message: string }).message || message;
        }
        setErrorMessage(message);
        toast.error(message);
      } finally {
        setLoading(false);
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

      {loading ? (
        <p className="text-blue-600 font-semibold">Loading store data...</p>
      ) : errorMessage ? (
        <p className="text-red-600 font-semibold">{errorMessage}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400 text-sm text-left">
            <thead className="bg-gray-100">
              <tr className=" text-center">
                <th className="border border-gray-400 px-4 py-2">#</th>
                <th className="border border-gray-400 px-4 py-2">
                  Product Code
                </th>
                <th className="border border-gray-400 px-4 py-2">Company</th>
                <th className="border border-gray-400 px-4 py-2">Feet</th>
                <th className="border border-gray-400 px-4 py-2">Cartons</th>
                <th className="border border-gray-400 px-4 py-2">Pcs</th>
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
                    <td className="border border-gray-400 px-4 py-2 text-right">
                      {item.feet.toFixed(2)}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-right">
                      {item.fullCartons}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-right">
                      {item.remainingPieces}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center border border-gray-400 px-4 py-2 text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Store;
