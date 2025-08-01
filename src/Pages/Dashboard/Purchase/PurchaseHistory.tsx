import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const PurchaseHistory = ({ refresh }: { refresh: boolean }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const [goPage, setGoPage] = useState("");
  const [total, setTotal] = useState(0);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_Basic_Api
        }/api/purchase/history?page=${page}&limit=${limit}`
      );
      setData(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      toast.error("Failed to load purchase history");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, limit, refresh]);

  const totalPages = Math.ceil(total / limit);

  const handleGoToPage = () => {
    const num = parseInt(goPage);
    if (!num || num < 1 || num > totalPages) {
      toast.error(`Invalid page number (1 - ${totalPages})`);
      return;
    }
    setPage(num);
    setGoPage("");
  };

  // ✅ Delete with SweetAlert2
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(
          `${import.meta.env.VITE_Basic_Api}/api/purchase/${id}`
        );
        toast.success(res.data.message || "🗑️ Deleted successfully");
        fetchHistory();
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "❌ Failed to delete");
      }
    } else {
      toast("Deletion cancelled");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 text-sm">
      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-2">
        <div>
          <label className="mr-2">Show:</label>
          <select
            value={limit}
            onChange={(e) => {
              setPage(1);
              setLimit(Number(e.target.value));
            }}
            className="border rounded px-2 py-1"
          >
            {[20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            ⬅ Prev
          </button>
          <span>
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            Next ➡
          </button>
        </div>

        {/* Go To Page */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={goPage}
            onChange={(e) => setGoPage(e.target.value)}
            className="border rounded px-2 py-1 w-20"
            placeholder="Page"
            min={1}
            max={totalPages}
            onKeyDown={(e) => e.key === "Enter" && handleGoToPage()}
          />
          <button
            onClick={handleGoToPage}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Sl</th>
            <th className="border p-2">Product Code</th>
            <th className="border p-2">Company</th>
            <th className="border p-2">Caton</th>
            <th className="border p-2">Pcs</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Edit</th>
            <th className="border p-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: any, idx: number) => (
            <tr key={item._id}>
              <td className="border p-2">{(page - 1) * limit + idx + 1}</td>
              <td className="border p-2">{item.product_code}</td>
              <td className="border p-2">{item.company}</td>
              <td className="border p-2 text-right">{item.caton}</td>
              <td className="border p-2 text-right">{item.pcs}</td>
              <td className="border p-2 text-right">{item.date}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() =>
                    navigate("/dashboard/purchase-update", {
                      state: { purchase: item },
                    })
                  }
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
              </td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseHistory;
