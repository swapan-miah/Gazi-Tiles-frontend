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
    const invalid = products.find(
      (p) => p.sell_caton > p.store_caton || p.sell_feet > p.store_feet
    );
    if (invalid) return toast.error("Sell amount exceeds stock");

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
        loading: "Processing...",
        success: "Sale successful!",
        error: "Failed to save sale",
      });

      await promise;
      setProducts([]);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-semibold">Sale Form</h2>

      {/* Customer Info */}
      <input
        type="text"
        placeholder="Customer Name"
        value={customer.name}
        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
        className="border px-2 py-1 w-full"
      />
      <input
        type="text"
        placeholder="Address"
        value={customer.address}
        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
        className="border px-2 py-1 w-full"
      />
      <input
        type="text"
        placeholder="Mobile"
        value={customer.mobile}
        onChange={(e) => setCustomer({ ...customer, mobile: e.target.value })}
        className="border px-2 py-1 w-full"
      />

      {/* Product Select */}
      <div className="flex gap-2">
        <select
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.target.value)}
          className="border px-2 py-1 flex-1"
        >
          <option value="">Select Product</option>
          {allProducts.map((p) => (
            <option key={p.product_code} value={p.product_code}>
              {p.product_code}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddProduct}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Add
        </button>
      </div>

      {/* Product Table */}
      <table className="w-full border mt-4">
        <thead>
          <tr>
            <th className="border px-2">SL</th>
            <th className="border px-2">Product Code</th>
            <th className="border px-2">Store Caton</th>
            <th className="border px-2">Store Feet</th>
            <th className="border px-2">Sell Caton</th>
            <th className="border px-2">Sell Feet</th>
            <th className="border px-2">Remove</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={p.product_code}>
              <td className="border px-2">{i + 1}</td>
              <td className="border px-2">{p.product_code}</td>
              <td className="border px-2">{p.store_caton}</td>
              <td className="border px-2">{p.store_feet}</td>
              <td className="border px-2">
                <input
                  type="number"
                  value={p.sell_caton}
                  min={0}
                  max={p.store_caton}
                  onChange={(e) =>
                    setProducts((prev) =>
                      prev.map((item) =>
                        item.product_code === p.product_code
                          ? { ...item, sell_caton: +e.target.value }
                          : item
                      )
                    )
                  }
                  className="w-16 border"
                />
              </td>
              <td className="border px-2">
                <input
                  type="number"
                  value={p.sell_feet}
                  min={0}
                  max={p.store_feet}
                  onChange={(e) =>
                    setProducts((prev) =>
                      prev.map((item) =>
                        item.product_code === p.product_code
                          ? { ...item, sell_feet: +e.target.value }
                          : item
                      )
                    )
                  }
                  className="w-16 border"
                />
              </td>
              <td className="border px-2">
                <button
                  onClick={() =>
                    setProducts((prev) =>
                      prev.filter((x) => x.product_code !== p.product_code)
                    )
                  }
                  className="text-red-600"
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded mt-4"
      >
        Submit
      </button>
    </div>
  );
};

export default SaleForm;
