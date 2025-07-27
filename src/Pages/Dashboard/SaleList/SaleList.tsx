import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";

interface Product {
  product_code: string;
  sell_caton: number;
  sell_feet: number;
}

interface Sale {
  _id: string;
  customer: {
    name: string;
    address: string;
    mobile: string;
  };
  products: Product[];
  date: string;
}

export default function SalesList() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [gotoPage, setGotoPage] = useState("");

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

  const handleView = (sale: Sale) => {
    setSelectedSale(sale);
    setIsOpen(true);
  };

  const handleGoToPage = () => {
    const pageNum = parseInt(gotoPage);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setPage(pageNum);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sales List</h1>

      <div className="flex items-center justify-between mb-2">
        <div>
          <label className="mr-2 font-medium">Items per page:</label>
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="border rounded px-2 py-1"
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
            className="border px-2 py-1 rounded w-24"
            value={gotoPage}
            onChange={(e) => setGotoPage(e.target.value)}
          />
          <button
            onClick={handleGoToPage}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Go
          </button>
        </div>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">SI</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Address</th>
            <th className="p-2 border">Mobile</th>
            <th className="p-2 border">View</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale, index) => (
            <tr key={sale._id} className="hover:bg-gray-50">
              <td className="p-2 border">{(page - 1) * perPage + index + 1}</td>
              <td className="p-2 border">{sale.customer.name}</td>
              <td className="p-2 border">{sale.customer.address}</td>
              <td className="p-2 border">{sale.customer.mobile}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleView(sale)}
                  className="text-blue-500 underline"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => page > 1 && setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="font-semibold">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => page < totalPages && setPage(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white rounded shadow-lg p-6 w-[500px]">
            <Dialog.Title className="text-lg font-bold mb-2">
              Sale Details
            </Dialog.Title>
            {selectedSale && (
              <div className="text-sm">
                <p>
                  <strong>Name:</strong> {selectedSale.customer.name}
                </p>
                <p>
                  <strong>Address:</strong> {selectedSale.customer.address}
                </p>
                <p>
                  <strong>Mobile:</strong> {selectedSale.customer.mobile}
                </p>
                <p>
                  <strong>Date:</strong> {selectedSale.date}
                </p>

                <div className="mt-2">
                  <h4 className="font-medium underline mb-1">Products:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedSale.products.map((p, idx) => (
                      <li key={idx}>
                        <span className="font-semibold">{p.product_code}</span>{" "}
                        — {p.sell_caton} caton, {p.sell_feet} feet
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
