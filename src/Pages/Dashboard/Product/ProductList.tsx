import { useState } from "react";
import type { IProduct } from "./Product";
import Modal from "../../../Components/Modal";
import UpdateProduct from "./UpdateProduct";
import Swal from "sweetalert2";
import axios from "axios";

interface Props {
  products: IProduct[];
  refetch: () => void;
}

const ProductList = ({ products, refetch }: Props) => {
  const [companyFilter, setCompanyFilter] = useState("");
  const [productCodeFilter, setProductCodeFilter] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  // ✅ Filtered Data
  const filteredProducts = products.filter((product) => {
    const companyMatch = product.company
      .toLowerCase()
      .includes(companyFilter.toLowerCase());
    const codeMatch = product.product_code
      .toLowerCase()
      .includes(productCodeFilter.toLowerCase());
    return companyMatch && codeMatch;
  });

  // ✅ Handle Delete with SweetAlert2
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
          `${import.meta.env.VITE_Basic_Api}/api/product/${id}`
        );
        Swal.fire("Deleted!", res.data.message, "success");
        refetch();
      } catch (err: any) {
        Swal.fire(
          "Error!",
          err?.response?.data?.message || "Failed to delete",
          "error"
        );
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Product List</h2>

      {/* ✅ Filter Inputs */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by company"
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="border px-3 py-2 w-1/2"
        />
        <input
          type="text"
          placeholder="Search by product code"
          value={productCodeFilter}
          onChange={(e) => setProductCodeFilter(e.target.value)}
          className="border px-3 py-2 w-1/2"
        />
      </div>

      {/* ✅ Filtered Table */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Company</th>
            <th className="border p-2">Product Code</th>
            <th className="border p-2">Size</th>
            <th className="border p-2">Per Caton To Pcs</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, index) => (
            <tr key={product._id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{product.company}</td>
              <td className="border p-2">{product.product_code}</td>
              <td className="border p-2">
                {product.height} × {product.width}
              </td>
              <td className="border p-2">{product.per_caton_to_pcs}</td>
              <td className="p-2 border text-center space-x-2">
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Update Modal */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      >
        {selectedProduct && (
          <UpdateProduct
            product={selectedProduct}
            refetch={refetch}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default ProductList;
