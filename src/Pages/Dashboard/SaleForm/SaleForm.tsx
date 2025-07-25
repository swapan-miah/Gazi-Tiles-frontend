import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Product {
  product_code: string;
  caton: number;
  feet: number;
}

interface ProductEntry {
  product_code: string;
  store_caton: number;
  store_feet: number;
  sell_caton: number;
  sell_feet: number;
}

const SaleForm: React.FC = () => {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    mobile: "",
  });

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [products, setProducts] = useState<ProductEntry[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios
      .get("https://gazi-tiles-backend.vercel.app/api/store/all")
      .then((res) => setAllProducts(res.data.data))
      .catch(() => toast.error("Failed to load product list"));

    axios
      .get("https://gazi-tiles-backend.vercel.app/api/invoice/next-invoice")
      .then((res) => {
        setInvoiceNumber(res.data.invoice_number ?? 1);
      })
      .catch(() => toast.error("Failed to fetch invoice number"));
  }, []);

  const handleAddProduct = () => {
    if (!selectedCode) {
      toast.error("Please select a product");
      return;
    }

    if (products.find((p) => p.product_code === selectedCode)) {
      toast.error("Product already added");
      return;
    }

    const productInfo = allProducts.find(
      (p) => p.product_code === selectedCode
    );
    if (!productInfo) {
      toast.error("Invalid product code");
      return;
    }

    setProducts((prev) => [
      ...prev,
      {
        product_code: productInfo.product_code,
        store_caton: productInfo.caton,
        store_feet: productInfo.feet,
        sell_caton: 0,
        sell_feet: 0,
      },
    ]);
    setSelectedCode("");
  };

  const handleRemoveProduct = (code: string) => {
    setProducts((prev) => prev.filter((p) => p.product_code !== code));
  };

  const handleChangeSellQty = (
    code: string,
    field: "sell_caton" | "sell_feet",
    value: number
  ) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.product_code === code
          ? {
              ...p,
              [field]: Math.max(
                0,
                Math.min(
                  value,
                  field === "sell_caton" ? p.store_caton : p.store_feet
                )
              ),
            }
          : p
      )
    );
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    // Validate customer info
    if (!customer.name || !customer.address || !customer.mobile) {
      toast.error("Please fill all customer details");
      return;
    }

    if (products.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    for (const p of products) {
      if (p.sell_caton <= 0 && p.sell_feet <= 0) {
        toast.error("Sell quantity must be > 0 for all products");
        return;
      }
      if (p.sell_caton > p.store_caton || p.sell_feet > p.store_feet) {
        toast.error(
          `Sell quantity exceeds available stock for ${p.product_code}`
        );
        return;
      }
    }

    const payload = {
      customer,
      products: products.map(
        ({ product_code, sell_caton, sell_feet, store_caton, store_feet }) => ({
          product_code,
          sell_caton,
          sell_feet,
          store_caton,
          store_feet,
        })
      ),
      date: new Date().toISOString().slice(0, 10),
      invoice_number: invoiceNumber,
    };

    setIsSubmitting(true);

    try {
      const promise = axios.post(
        "https://gazi-tiles-backend.vercel.app/api/sale/create",
        payload
      );

      toast.promise(promise, {
        loading: "Processing sale...",
        success: "Sale successful!",
        error: "Sale failed!",
      });

      await promise;

      // Reset form
      setCustomer({ name: "", address: "", mobile: "" });
      setProducts([]);
      setInvoiceNumber((prev) => (prev ?? 0) + 1);

      // Redirect success page
      navigate("/dashboard/sales-history");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-semibold text-center mb-6">
        🧾 Sales Entry Form
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {["name", "address", "mobile"].map((field) => (
          <div key={field}>
            <label className="block mb-1 font-medium capitalize">{`Customer ${field}`}</label>
            <input
              type="text"
              value={(customer as any)[field]}
              onChange={(e) =>
                setCustomer((prev) => ({ ...prev, [field]: e.target.value }))
              }
              className="border px-3 py-2 rounded w-full"
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 font-medium">Invoice Number</label>
          <input
            type="number"
            value={invoiceNumber ?? ""}
            readOnly
            className="border px-3 py-2 rounded w-full bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <select
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.target.value)}
          className="border px-3 py-2 rounded flex-grow"
          disabled={isSubmitting}
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
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Product
        </button>
      </div>

      {products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border border-collapse text-sm text-center">
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
                <tr key={p.product_code}>
                  <td className="border px-2 py-1">{i + 1}</td>
                  <td className="border px-2 py-1">{p.product_code}</td>
                  <td className="border px-2 py-1">{p.store_caton}</td>
                  <td className="border px-2 py-1">{p.store_feet}</td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      min={0}
                      max={p.store_caton}
                      value={p.sell_caton}
                      onChange={(e) =>
                        handleChangeSellQty(
                          p.product_code,
                          "sell_caton",
                          Number(e.target.value)
                        )
                      }
                      className="w-20 px-1 py-1 border rounded text-right"
                      onWheel={(e) => e.currentTarget.blur()}
                      disabled={isSubmitting}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      min={0}
                      max={p.store_feet}
                      value={p.sell_feet}
                      onChange={(e) =>
                        handleChangeSellQty(
                          p.product_code,
                          "sell_feet",
                          Number(e.target.value)
                        )
                      }
                      className="w-20 px-1 py-1 border rounded text-right"
                      onWheel={(e) => e.currentTarget.blur()}
                      disabled={isSubmitting}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <button
                      onClick={() => handleRemoveProduct(p.product_code)}
                      disabled={isSubmitting}
                      className="text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
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

      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Sale"}
        </button>
      </div>
    </div>
  );
};

export default SaleForm;
