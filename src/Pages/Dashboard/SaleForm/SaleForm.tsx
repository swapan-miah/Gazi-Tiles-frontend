import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface Product {
  product_code: string;
  caton: number;
  feet: number;
}

interface ProductItem {
  product_code: string;
  store_caton: number;
  store_feet: number;
  sell_caton: number;
  sell_feet: number;
}

const SaleForm: React.FC = () => {
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    mobile: "",
  });
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [products, setProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/store/all")
      .then((res) => setAllProducts(res.data.data))
      .catch(() => toast.error("Failed to load product list"));
  }, []);

  const handleAddProduct = () => {
    if (!selectedCode) return toast.error("Please select a product");

    const found = allProducts.find((p) => p.product_code === selectedCode);
    if (!found) return toast.error("Invalid product");

    const already = products.find((p) => p.product_code === selectedCode);
    if (already) return toast.error("Already added");

    setProducts((prev) => [
      ...prev,
      {
        product_code: found.product_code,
        store_caton: found.caton,
        store_feet: found.feet,
        sell_caton: 0,
        sell_feet: 0,
      },
    ]);
  };

  const handleSubmit = async () => {
    if (!customer.name || !customer.address || !customer.mobile) {
      return toast.error("Please fill in all customer fields");
    }

    if (products.length === 0)
      return toast.error("Please add at least one product");

    const invalid = products.find(
      (p) => p.sell_caton > p.store_caton || p.sell_feet > p.store_feet
    );
    if (invalid) return toast.error("Sell quantity exceeds available stock");

    // ✅ নতুন validation: sell_caton বা sell_feet এর যেকোনো একটি > 0 হতে হবে
    const allZero = products.some((p) => p.sell_caton <= 0 && p.sell_feet <= 0);
    if (allZero)
      return toast.error(
        "Each product must have sell caton or sell feet greater than 0"
      );

    try {
      const saleData = {
        customer,
        date: new Date().toISOString().split("T")[0],
        products: products.map(({ product_code, sell_caton, sell_feet }) => ({
          product_code,
          sell_caton,
          sell_feet,
        })),
      };

      const promise = axios.post(
        "http://localhost:5000/api/sale/create",
        saleData
      );
      toast.promise(promise, {
        loading: "Processing sale...",
        success: "Sale successful!",
        error: "Sale failed!",
      });

      await promise;
      setProducts([]);
      setCustomer({ name: "", address: "", mobile: "" });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-center">
        🧾 Sales Entry Form
      </h2>

      {/* Customer Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="customer-name"
            className="block mb-1 font-medium text-gray-700"
          >
            Customer Name
          </label>
          <input
            id="customer-name"
            type="text"
            placeholder="Enter name"
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        <div>
          <label
            htmlFor="customer-address"
            className="block mb-1 font-medium text-gray-700"
          >
            Customer Address
          </label>
          <input
            id="customer-address"
            type="text"
            placeholder="Enter address"
            value={customer.address}
            onChange={(e) =>
              setCustomer({ ...customer, address: e.target.value })
            }
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        <div>
          <label
            htmlFor="customer-mobile"
            className="block mb-1 font-medium text-gray-700"
          >
            Customer Mobile
          </label>
          <input
            id="customer-mobile"
            type="text"
            placeholder="Enter mobile"
            value={customer.mobile}
            onChange={(e) =>
              setCustomer({ ...customer, mobile: e.target.value })
            }
            className="border px-3 py-2 rounded w-full"
          />
        </div>
      </div>

      {/* Product Select */}
      <div>
        <label
          htmlFor="product-code"
          className="block mb-1 font-medium text-gray-700"
        >
          Select Product
        </label>
        <div className="flex items-center gap-4">
          <select
            id="product-code"
            value={selectedCode}
            onChange={(e) => setSelectedCode(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="">-- Select Product Code --</option>
            {allProducts.map((p) => (
              <option key={p.product_code} value={p.product_code}>
                {p.product_code}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddProduct}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Product Table */}
      {products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">#</th>
                <th className="border px-3 py-2">Product Code</th>
                <th className="border px-3 py-2">Available Caton</th>
                <th className="border px-3 py-2">Available Feet</th>
                <th className="border px-3 py-2">Sell Caton</th>
                <th className="border px-3 py-2">Sell Feet</th>
                <th className="border px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.product_code} className="text-center">
                  <td className="border px-2">{i + 1}</td>
                  <td className="border px-2">{p.product_code}</td>
                  <td className="border px-2">{p.store_caton}</td>
                  <td className="border px-2">{p.store_feet}</td>
                  <td className="border px-2">
                    <label className="sr-only" htmlFor={`sell-caton-${i}`}>
                      Sell Caton
                    </label>
                    <input
                      id={`sell-caton-${i}`}
                      type="number"
                      value={p.sell_caton}
                      min={0}
                      max={p.store_caton}
                      onWheel={(e) => e.currentTarget.blur()}
                      onChange={(e) =>
                        setProducts((prev) =>
                          prev.map((item) =>
                            item.product_code === p.product_code
                              ? { ...item, sell_caton: +e.target.value }
                              : item
                          )
                        )
                      }
                      className="w-20 text-right border px-1 py-1"
                    />
                  </td>
                  <td className="border px-2">
                    <label className="sr-only" htmlFor={`sell-feet-${i}`}>
                      Sell Feet
                    </label>
                    <input
                      id={`sell-feet-${i}`}
                      type="number"
                      value={p.sell_feet}
                      min={0}
                      max={p.store_feet}
                      onWheel={(e) => e.currentTarget.blur()}
                      onChange={(e) =>
                        setProducts((prev) =>
                          prev.map((item) =>
                            item.product_code === p.product_code
                              ? { ...item, sell_feet: +e.target.value }
                              : item
                          )
                        )
                      }
                      className="w-20 text-right border px-1 py-1"
                    />
                  </td>
                  <td className="border px-2">
                    <button
                      onClick={() =>
                        setProducts((prev) =>
                          prev.filter((x) => x.product_code !== p.product_code)
                        )
                      }
                      className="text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Submit Sale
        </button>
      </div>
    </div>
  );
};

export default SaleForm;
