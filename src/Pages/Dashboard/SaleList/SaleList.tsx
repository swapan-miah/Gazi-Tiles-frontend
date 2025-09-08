import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import toast from "react-hot-toast"; // Import React Hot Toast
import PaymentNotice from "../../../Components/PaymentNotice/PaymentNotice";

// Define the interfaces for product and sale data
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

  // Function to fetch sales data from the API
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
      toast.error("Failed to fetch sales data!"); // Show Hot Toast on error
    }
  };

  // Function to handle deleting a sale
  const handleDeleteSale = async (saleId: string) => {
    // Show a confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this sale? This will affect stock quantities and this action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      try {
        // Make a DELETE request to the new API endpoint
        await axios.delete(
          `${import.meta.env.VITE_Basic_Api}/api/sale/delete/${saleId}`
        );
        // Show success message using SweetAlert2 and React Hot Toast
        Swal.fire(
          "Deleted!",
          "The sale has been successfully deleted.",
          "success"
        );
        toast.success("Sale successfully deleted!");
        // Fetch the updated sales list after successful deletion
        fetchSales();
      } catch (err) {
        console.error("Failed to delete sale:", err);
        // Show error message using SweetAlert2 and React Hot Toast
        Swal.fire("Failed!", "Failed to delete the sale.", "error");
        toast.error("Failed to delete the sale!");
      }
    }
  };

  // Effect hook to fetch data whenever page or perPage changes
  useEffect(() => {
    fetchSales();
  }, [page, perPage]);

  // Handle "Go to Page" input and button
  const handleGoToPage = () => {
    const pageNum = parseInt(gotoPage);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setPage(pageNum);
    } else {
      toast.error("Please enter a valid page number!"); // Hot Toast for invalid page number
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <PaymentNotice></PaymentNotice>
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
                      className="p-2 border align-middle flex flex-col space-y-2 justify-center items-center"
                    >
                      <button
                        onClick={() =>
                          navigate(`/dashboard/sale/update/${sale._id}`)
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm w-full"
                      >
                        ✏️ Update
                      </button>
                      <button
                        onClick={() => handleDeleteSale(sale._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm w-full"
                      >
                        🗑️ Delete
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
