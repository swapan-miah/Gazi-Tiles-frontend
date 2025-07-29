import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

// ডেটা টাইপের সংজ্ঞা
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
  store_feet: number; // এই সেলের জন্য ইনিশিয়াল স্টোর ফিট
  height: number;
  width: number;
  per_caton_to_pcs: number;
  original_sell_feet?: number; // এই সেলে পূর্বে বিক্রি হওয়া ফিট
}

interface ISale {
  _id?: string; // আপডেটের জন্য _id প্রয়োজন
  invoice_number: number;
  date: string;
  products: ISaleProduct[];
}

const SaleUpdate: React.FC = () => {
  const navigate = useNavigate();
  const { saleId } = useParams<{ saleId: string }>(); // URL থেকে saleId নেওয়া হচ্ছে

  const [allProducts, setAllProducts] = useState<StoreProduct[]>([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [sellCtn, setSellCtn] = useState(0);
  const [sellPcs, setSellPcs] = useState(0);
  const [invoiceNumber, setInvoiceNumber] = useState<number | null>(null);
  const [products, setProducts] = useState<ISaleProduct[]>([]); // বিক্রয়ের জন্য নির্বাচিত পণ্য
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingSaleData, setLoadingSaleData] = useState(true);

  // কম্পোনেন্ট লোড হওয়ার সাথে সাথে ডেটা লোড করা
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // সকল পণ্য লোড করা
        const productsRes = await axios.get(
          `${import.meta.env.VITE_Basic_Api}/api/store/all`
        );
        setAllProducts(productsRes.data.data);

        // নির্দিষ্ট বিক্রয় ডেটা লোড করা
        if (saleId) {
          const saleRes = await axios.get(
            `${import.meta.env.VITE_Basic_Api}/api/sale/${saleId}`
          );
          const saleData: ISale = saleRes.data;

          setInvoiceNumber(saleData.invoice_number);

          // বিদ্যমান বিক্রয়ের পণ্যগুলো সেট করা
          const updatedProducts: ISaleProduct[] = saleData.products.map(
            (saleProduct) => {
              const matchingStoreProduct = productsRes.data.data.find(
                (p: StoreProduct) => p.product_code === saleProduct.product_code
              );

              // যদি পণ্যটি বর্তমানে স্টকে থাকে এবং এই বিক্রয়ের অংশ হয়,
              // তাহলে store_feet এর সাথে পূর্বে বিক্রি হওয়া feet যোগ করা হবে।
              // অন্যথায়, বর্তমান store_feet ব্যবহার করা হবে।
              const adjustedStoreFeet =
                matchingStoreProduct &&
                matchingStoreProduct.product_code === saleProduct.product_code
                  ? matchingStoreProduct.feet + saleProduct.sell_feet
                  : saleProduct.store_feet; // যদি স্টকে না থাকে বা নতুন হয়

              return {
                ...saleProduct,
                store_feet: adjustedStoreFeet,
                original_sell_feet: saleProduct.sell_feet, // পূর্বে বিক্রি হওয়া ফিট সংরক্ষণ করা
              };
            }
          );
          setProducts(updatedProducts);
        }
      } catch (error) {
        toast.error("Failed to load initial data.");
        console.error("Error fetching data:", error);
      } finally {
        setLoadingSaleData(false);
      }
    };

    fetchInitialData();
  }, [saleId]); // saleId পরিবর্তন হলে আবার ডেটা লোড হবে

  // পণ্য যোগ বা আপডেট করার ফাংশন
  const handleAddProduct = () => {
    const product = allProducts.find((p) => p.product_code === selectedCode);
    if (!product) return toast.error("Invalid product selection");

    const { height, width, feet, per_caton_to_pcs, product_code } = product;
    const areaPerPiece = (height * width) / 144;

    // বিদ্যমান পণ্য খুঁজে বের করা
    const existingProductIndex = products.findIndex(
      (p) => p.product_code === product_code
    );

    let currentStoreFeet = feet;
    let originalSoldFeetForThisProduct = 0;

    if (existingProductIndex !== -1) {
      // যদি পণ্যটি এই বিক্রয়ের অংশ হয়, তবে তার পূর্বে বিক্রি হওয়া ফিট স্টকের সাথে যোগ করা হবে।
      originalSoldFeetForThisProduct =
        products[existingProductIndex].original_sell_feet || 0;
      currentStoreFeet = feet + originalSoldFeetForThisProduct;
    }

    const totalPiecesInStock = currentStoreFeet / areaPerPiece;

    let fullCartonsInStock = Math.floor(totalPiecesInStock / per_caton_to_pcs);
    let remainingPiecesInStock = Math.round(
      totalPiecesInStock - fullCartonsInStock * per_caton_to_pcs
    );

    // ঋণাত্মক বা অতিরিক্ত টুকরো সামলানো
    if (remainingPiecesInStock < 0) {
      fullCartonsInStock -= 1;
      remainingPiecesInStock = per_caton_to_pcs + remainingPiecesInStock;
    }
    if (remainingPiecesInStock === per_caton_to_pcs) {
      fullCartonsInStock += 1;
      remainingPiecesInStock = 0;
    }

    // ইনপুট ভ্যালিডেশন
    if (sellCtn <= 0 && sellPcs <= 0) {
      return toast.error("বিক্রয় কার্টন অথবা পিস অন্তত একটি ০ এর বেশি হতে হবে");
    }

    if (!Number.isInteger(sellCtn) || !Number.isInteger(sellPcs)) {
      return toast.error("Sell caton এবং sell pcs অবশ্যই পূর্ণ সংখ্যা হতে হবে");
    }

    if (sellPcs >= per_caton_to_pcs) {
      return toast.error(
        `বিক্রয় পিস ${per_caton_to_pcs} এর কম হতে হবে, কারণ এটি ১ কার্টনের সমান বা বেশি হয়ে যাচ্ছে।`
      );
    }

    // মোট বিক্রি হওয়া পিস
    const totalSellPieces = sellCtn * per_caton_to_pcs + sellPcs;

    // বিক্রয় স্টক থেকে বেশি কিনা তা যাচাই করা
    if (totalSellPieces > totalPiecesInStock) {
      return toast.error("স্টকের থেকে বেশি পণ্য বিক্রি করা যাবে না।");
    }

    const sellFeet = areaPerPiece * totalSellPieces;

    const newProduct: ISaleProduct = {
      product_code,
      sell_caton: sellCtn,
      sell_pcs: sellPcs,
      sell_feet: sellFeet,
      store_feet: currentStoreFeet, // এখানে সামঞ্জস্যপূর্ণ স্টোর ফিট ব্যবহার করা হচ্ছে
      height,
      width,
      per_caton_to_pcs,
      original_sell_feet: originalSoldFeetForThisProduct, // পূর্বের বিক্রি হওয়া ফিট সংরক্ষণ করা
    };

    setProducts((prev) => {
      if (existingProductIndex !== -1) {
        // যদি পণ্যটি ইতিমধ্যেই যোগ করা থাকে, তাহলে আপডেট করুন
        const updated = [...prev];
        updated[existingProductIndex] = newProduct;
        return updated;
      } else {
        // নতুন পণ্য যোগ করুন
        return [...prev, newProduct];
      }
    });

    // ফর্ম রিসেট করা
    setSelectedCode("");
    setSellCtn(0);
    setSellPcs(0);
  };

  // পণ্য মুছে ফেলার ফাংশন
  const handleRemoveProduct = (code: string) => {
    setProducts((prev) => prev.filter((p) => p.product_code !== code));
  };

  // ফর্ম জমা দেওয়ার ফাংশন
  const handleSubmit = async () => {
    if (products.length === 0) return toast.error("অন্তত একটি পণ্য যোগ করুন");
    if (!invoiceNumber) return toast.error("ইনভয়েস নম্বর অনুপস্থিত");

    // সার্ভারে পাঠানোর জন্য payload তৈরি করা
    const payload: ISale = {
      invoice_number: invoiceNumber,
      date: new Date().toISOString().slice(0, 10), // বর্তমান তারিখ
      products: products.map((p) => ({
        product_code: p.product_code,
        sell_caton: p.sell_caton,
        sell_pcs: p.sell_pcs,
        sell_feet: p.sell_feet,
        store_feet: p.store_feet, // আপডেটেড স্টোর ফিট
        height: p.height,
        width: p.width,
        per_caton_to_pcs: p.per_caton_to_pcs,
      })),
    };

    console.log("Payload for update:", payload);

    try {
      setIsSubmitting(true);
      const promise = axios.put(
        `${import.meta.env.VITE_Basic_Api}/api/sale/update/${saleId}`, // PUT রিকোয়েস্ট
        payload
      );
      toast.promise(promise, {
        loading: "বিক্রয় আপডেট করা হচ্ছে...",
        success: "বিক্রয় সফলভাবে আপডেট হয়েছে!",
        error: "বিক্রয় আপডেট ব্যর্থ হয়েছে!",
      });

      await promise;
      // সফল হলে ড্যাশবোর্ডে নেভিগেট করা
      navigate("/dashboard/sales-history");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "সার্ভার ত্রুটি");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentProduct = allProducts.find(
    (p) => p.product_code === selectedCode
  );

  if (loadingSaleData) {
    return (
      <div className="text-center p-6 text-lg font-semibold">
        বিক্রয়ের ডেটা লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded space-y-6">
      <h2 className="text-2xl font-semibold text-center">🧾 বিক্রয় আপডেট</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block font-medium mb-1">ইনভয়েস নম্বর</label>
          <input
            type="number"
            value={invoiceNumber ?? ""}
            readOnly
            className="border px-3 py-2 rounded w-full bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="p-4 border rounded space-y-4">
        <h3 className="text-lg font-medium">পণ্য যোগ বা আপডেট করুন</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block mb-1 font-medium">পণ্য কোড</label>
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
              placeholder="🔍 পণ্য কোড খুঁজুন ও নির্বাচন করুন"
              className="w-full"
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">বিক্রয় কার্টন</label>
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
            <label className="block mb-1 font-medium">বিক্রয় পিস</label>
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
              🧱 আকার: {currentProduct.height}" x {currentProduct.width}" |
              প্রতি কার্টন: {currentProduct.per_caton_to_pcs} পিস
            </p>
            {(() => {
              const existingProduct = products.find(
                (p) => p.product_code === currentProduct.product_code
              );
              const originalSoldFeet = existingProduct?.original_sell_feet || 0;
              const adjustedFeetInStock =
                currentProduct.feet + originalSoldFeet;

              const areaPerPiece =
                (currentProduct.height * currentProduct.width) / 144;
              const totalPiecesInStock = adjustedFeetInStock / areaPerPiece;
              let fullCartonsInStock = Math.floor(
                totalPiecesInStock / currentProduct.per_caton_to_pcs
              );
              let remainingPiecesInStock = Math.round(
                totalPiecesInStock -
                  fullCartonsInStock * currentProduct.per_caton_to_pcs
              );

              if (remainingPiecesInStock < 0) {
                fullCartonsInStock -= 1;
                remainingPiecesInStock =
                  currentProduct.per_caton_to_pcs + remainingPiecesInStock;
              }
              if (remainingPiecesInStock === currentProduct.per_caton_to_pcs) {
                fullCartonsInStock += 1;
                remainingPiecesInStock = 0;
              }

              return (
                <>
                  <p>📦 বর্তমান স্টক: {currentProduct.feet.toFixed(2)} ফিট</p>
                  <p>
                    {existingProduct
                      ? `(এই সেলে পূর্বে বিক্রি হওয়া ফিট: ${originalSoldFeet.toFixed(
                          2
                        )})`
                      : ""}
                  </p>
                  <p>
                    🧮 মোট উপলব্ধ স্টক: {adjustedFeetInStock.toFixed(2)} ফিট (
                    {fullCartonsInStock} কার্টন & {remainingPiecesInStock} পিস)
                  </p>
                </>
              );
            })()}
          </div>
        )}

        <button
          onClick={handleAddProduct}
          disabled={isSubmitting || !selectedCode}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ➕ পণ্য যোগ/আপডেট করুন
        </button>
      </div>

      {products.length > 0 && (
        <div className="overflow-x-auto border rounded">
          <table className="w-full border-collapse text-sm text-center mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">পণ্য কোড</th>
                <th className="px-4 py-2 border">স্টোর ফিট (এই সেলের জন্য)</th>
                <th className="px-4 py-2 border">আকার</th>
                <th className="px-4 py-2 border">বিক্রয় কার্টন</th>
                <th className="px-4 py-2 border">বিক্রয় পিস</th>
                <th className="px-4 py-2 border">বিক্রয় ফিট</th>
                <th className="px-4 py-2 border">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.product_code}>
                  <td className="px-4 py-2 border">{i + 1}</td>
                  <td className="px-4 py-2 border">{p.product_code}</td>
                  <td className="px-4 py-2 border">
                    {p.store_feet.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border">
                    {p.height}" x {p.width}"
                  </td>
                  <td className="px-4 py-2 border">{p.sell_caton}</td>
                  <td className="px-4 py-2 border">{p.sell_pcs}</td>
                  <td className="px-4 py-2 border">{p.sell_feet.toFixed(2)}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleRemoveProduct(p.product_code)}
                      className="text-red-600 hover:underline px-2 py-1 rounded"
                    >
                      ❌ সরান
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
          disabled={isSubmitting || products.length === 0}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "আপডেট করা হচ্ছে..." : "বিক্রয় আপডেট করুন"}
        </button>
      </div>
    </div>
  );
};

export default SaleUpdate;
