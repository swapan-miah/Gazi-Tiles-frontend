import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Product {
  product_code: string;
  sell_caton: number;
  sell_pcs: number;
  sell_feet: number;
}

interface Sale {
  _id: string;
  products: Product[];
  date: string;
  invoice_number: number;
}

export default function SalesList() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [gotoPage, setGotoPage] = useState("");

  const navigate = useNavigate();

  const fetchSales = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_Basic_Api
        }/api/sale?page=${page}&limit=${perPage}`
      );
      setSales(res.data.sales);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch sales:", err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [page, perPage]);

  const handleGoToPage = () => {
    const pageNum = parseInt(gotoPage);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setPage(pageNum);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        📋 Sales List
      </h1>

      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <div>
          <label className="mr-2 font-medium">Items per page:</label>
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="border rounded px-3 py-1"
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Go to page"
            className="border px-3 py-1 rounded w-28"
            value={gotoPage}
            onChange={(e) => setGotoPage(e.target.value)}
          />
          <button
            onClick={handleGoToPage}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Go
          </button>
        </div>
      </div>

      {/* Flat Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border text-center">Invoice</th>
              <th className="p-2 border text-center">Date</th>
              <th className="p-2 border text-center">Product</th>
              <th className="p-2 border text-center">Caton</th>
              <th className="p-2 border text-center">Pcs</th>
              <th className="p-2 border text-center">Feet</th>
              <th className="p-2 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) =>
              sale.products.map((product, idx) => (
                <tr
                  key={`${sale._id}-${idx}`}
                  className="hover:bg-gray-50 text-center"
                >
                  {idx === 0 && (
                    <>
                      <td
                        rowSpan={sale.products.length}
                        className="p-2 border align-middle"
                      >
                        {sale.invoice_number}
                      </td>
                      <td
                        rowSpan={sale.products.length}
                        className="p-2 border align-middle"
                      >
                        {sale.date}
                      </td>
                    </>
                  )}
                  <td className="p-2 border">{product.product_code}</td>
                  <td className="p-2 border">{product.sell_caton}</td>
                  <td className="p-2 border">{product.sell_pcs}</td>
                  <td className="p-2 border">{product.sell_feet.toFixed(2)}</td>
                  {idx === 0 && (
                    <td
                      rowSpan={sale.products.length}
                      className="p-2 border align-middle"
                    >
                      <button
                        onClick={() =>
                          navigate(`/dashboard/sale/update/${sale._id}`)
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                      >
                        ✏️ Update
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => page > 1 && setPage(page - 1)}
          disabled={page === 1}
          className="px-5 py-1 border rounded disabled:opacity-40 bg-gray-100 hover:bg-gray-200"
        >
          ⬅️ Prev
        </button>

        <span className="font-semibold text-gray-700">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => page < totalPages && setPage(page + 1)}
          disabled={page === totalPages}
          className="px-5 py-1 border rounded disabled:opacity-40 bg-gray-100 hover:bg-gray-200"
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
}
