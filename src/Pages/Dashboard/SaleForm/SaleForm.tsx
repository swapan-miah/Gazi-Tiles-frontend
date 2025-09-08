import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import PaymentNotice from "../../../Components/PaymentNotice/PaymentNotice";

interface StoreProduct {
  _id: string;
  product_code: string;
  company: string;
  feet: number;
  height: number;
  width: number;
  per_caton_to_pcs: number;
}

interface ISaleProduct {
  product_code: string;
  sell_caton: number;
  sell_pcs: number;
  sell_feet: number;
  store_feet: number;
  height: number;
  width: number;
  per_caton_to_pcs: number;
}

interface ISale {
  invoice_number: number;
  date: string;
  products: ISaleProduct[];
}

const SaleForm: React.FC = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState<StoreProduct[]>([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [sellCtn, setSellCtn] = useState(0);
  const [sellPcs, setSellPcs] = useState(0);
  const [invoiceNumber, setInvoiceNumber] = useState<number | null>(null);
  const [products, setProducts] = useState<ISaleProduct[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Add a state to handle the loading of the invoice number
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(true);

  useEffect(() => {
    // Fetch all products
    axios
      .get(`${import.meta.env.VITE_Basic_Api}/api/store/in-stock/all`)
      .then((res) => setAllProducts(res.data.data))
      .catch(() => toast.error("Failed to load product list"));

    // Fetch the next invoice number
    const fetchNextInvoiceNumber = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_Basic_Api}/api/invoice/next-invoice`
        );
        if (res.data.success) {
          setInvoiceNumber(res.data.invoice_number);
        } else {
          toast.error(res.data.message || "Failed to fetch invoice number");
        }
      } catch (err) {
        toast.error("Failed to fetch invoice number from server");
      } finally {
        setIsLoadingInvoice(false);
      }
    };

    fetchNextInvoiceNumber();
  }, []);

  const handleAddProduct = () => {
    const product = allProducts.find((p) => p.product_code === selectedCode);
    if (!product) return toast.error("Invalid product selection");

    const { height, width, feet, per_caton_to_pcs, product_code } = product;

    const areaPerPiece = (height * width) / 144;
    const totalPieces = feet / areaPerPiece;

    let fullCartons = Math.floor(totalPieces / per_caton_to_pcs);
    let remainingPieces = Math.round(
      totalPieces - fullCartons * per_caton_to_pcs
    );

    if (remainingPieces < 0) {
      fullCartons -= 1;
      remainingPieces = per_caton_to_pcs + remainingPieces;
    }
    if (remainingPieces === per_caton_to_pcs) {
      fullCartons += 1;
      remainingPieces = 0;
    }

    if (sellCtn <= 0 && sellPcs <= 0) {
      return toast.error(
        "Sell caton অথবা sell pcs অন্তত একটি ০ এর বেশি হতে হবে"
      );
    }

    if (!Number.isInteger(sellCtn) || !Number.isInteger(sellPcs)) {
      return toast.error("Sell caton এবং sell pcs অবশ্যই পূর্ণ সংখ্যা হতে হবে");
    }

    if (sellPcs >= per_caton_to_pcs) {
      return toast.error(`Sell pcs must be less than ${per_caton_to_pcs}`);
    }

    if (sellCtn > fullCartons) {
      return toast.error(`Sell caton must be less than equal ${fullCartons}`);
    }

    if (sellCtn === fullCartons && sellPcs > remainingPieces) {
      return toast.error(
        `Only ${remainingPieces} pcs allowed when cartons full`
      );
    }

    const sellFeet = areaPerPiece * (sellCtn * per_caton_to_pcs + sellPcs);

    if (products.find((p) => p.product_code === product_code)) {
      return toast.error("Product already added");
    }

    setProducts((prev) => [
      ...prev,
      {
        product_code,
        sell_caton: sellCtn,
        sell_pcs: sellPcs,
        sell_feet: sellFeet,
        store_feet: feet,
        height,
        width,
        per_caton_to_pcs,
      },
    ]);

    setSelectedCode("");
    setSellCtn(0);
    setSellPcs(0);
  };

  const handleRemoveProduct = (code: string) => {
    setProducts((prev) => prev.filter((p) => p.product_code !== code));
  };

  const handleSubmit = async () => {
    if (products.length === 0) return toast.error("Add at least one product");
    if (invoiceNumber === null || invoiceNumber <= 0)
      return toast.error(
        "Failed to get a valid Invoice Number. Please refresh."
      );

    const payload: ISale = {
      invoice_number: invoiceNumber,
      date: new Date().toISOString().slice(0, 10),
      products,
    };

    try {
      setIsSubmitting(true);
      const promise = axios.post(
        `${import.meta.env.VITE_Basic_Api}/api/sale/create`,
        payload
      );
      toast.promise(promise, {
        loading: "Processing sale...",
        success: "Sale completed",
        error: "Sale failed",
      });

      await promise;
      setProducts([]);
      setInvoiceNumber(null);
      navigate("/dashboard/sales-history");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentProduct = allProducts.find(
    (p) => p.product_code === selectedCode
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded space-y-6">
      <PaymentNotice></PaymentNotice>
      <h2 className="text-2xl font-semibold text-center">🧾 Sale Entry</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block font-medium mb-1">Invoice Number</label>
          <input
            type="number"
            value={isLoadingInvoice ? "Loading..." : invoiceNumber ?? ""}
            readOnly // Make the input read-only
            disabled // Disable the input to prevent user changes
            className="border px-3 py-2 rounded w-full bg-gray-100 cursor-not-allowed"
            placeholder="Fetching Invoice Number..."
          />
        </div>
      </div>

      <div className="p-4 border rounded space-y-4">
        <h3 className="text-lg font-medium">Add Product</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block mb-1 font-medium">Product Code</label>
            <Select
              value={
                selectedCode
                  ? {
                      value: selectedCode,
                      label: selectedCode,
                    }
                  : null
              }
              onChange={(option) => setSelectedCode(option?.value || "")}
              options={allProducts.map((p) => ({
                value: p.product_code,
                label: `${p.product_code} (${p.company})`,
              }))}
              isDisabled={isSubmitting}
              placeholder="🔍 Search & select product code"
              className="w-full"
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Sell Caton</label>
            <input
              type="number"
              value={sellCtn}
              onChange={(e) => setSellCtn(Number(e.target.value))}
              className="border px-3 py-2 rounded w-full"
              min={0}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Sell Pcs</label>
            <input
              type="number"
              value={sellPcs}
              onChange={(e) => setSellPcs(Number(e.target.value))}
              className="border px-3 py-2 rounded w-full"
              min={0}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
        </div>

        {currentProduct && (
          <div className="text-sm text-gray-600 mt-2">
            <p>
              🧱 Size: {currentProduct.height}" x {currentProduct.width}" | Per
              Caton: {currentProduct.per_caton_to_pcs} pcs
            </p>
            <p>📦 Stock: {currentProduct.feet.toFixed(2)} feet</p>
            {(() => {
              const areaPerPiece =
                (currentProduct.height * currentProduct.width) / 144;
              const totalPieces = currentProduct.feet / areaPerPiece;
              let fullCartons = Math.floor(
                totalPieces / currentProduct.per_caton_to_pcs
              );
              let remainingPieces = Math.round(
                totalPieces - fullCartons * currentProduct.per_caton_to_pcs
              );
              if (remainingPieces < 0) {
                fullCartons -= 1;
                remainingPieces =
                  currentProduct.per_caton_to_pcs + remainingPieces;
              }
              if (remainingPieces === currentProduct.per_caton_to_pcs) {
                fullCartons += 1;
                remainingPieces = 0;
              }
              return (
                <p>
                  🧮 Stock Breakdown: {fullCartons} caton & {remainingPieces}{" "}
                  pcs
                </p>
              );
            })()}
          </div>
        )}

        <button
          onClick={handleAddProduct}
          disabled={isSubmitting}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ➕ Add Product
        </button>
      </div>

      {products.length > 0 && (
        <div className="overflow-x-auto border rounded">
          <table className="w-full border-collapse text-sm text-center mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th>#</th>
                <th>Product Code</th>
                <th>Store Feet</th>
                <th>Size</th>
                <th>Sell Caton</th>
                <th>Sell Pcs</th>
                <th>Sell Feet</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.product_code}>
                  <td>{i + 1}</td>
                  <td>{p.product_code}</td>
                  <td>{p.store_feet.toFixed(2)}</td>
                  <td>
                    {p.height}" x {p.width}"
                  </td>
                  <td>{p.sell_caton}</td>
                  <td>{p.sell_pcs}</td>
                  <td>{p.sell_feet.toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => handleRemoveProduct(p.product_code)}
                      className="text-red-600 hover:underline"
                    >
                      ❌ Remove
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
