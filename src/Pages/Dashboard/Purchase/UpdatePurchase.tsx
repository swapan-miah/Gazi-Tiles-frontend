import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
// import Select from "react-select"; // react-select লাইব্রেরিটি সরিয়ে দেওয়া হয়েছে

// পারচেজ আপডেটের সময় প্রাপ্ত ডেটার ইন্টারফেস
interface PurchaseData {
  _id: string;
  product_code: string;
  company: string;
  height: number;
  width: number;
  per_caton_to_pcs: number;
  caton: number;
  date: string; // তারিখের স্ট্রিং প্রাথমিকভাবে ISO ফরম্যাটে থাকবে
}

// API থেকে আনা পণ্যের ডেটার ইন্টারফেস
interface ProductData {
  _id: string;
  product_code: string;
  company: string;
  height: number;
  width: number;
  per_caton_to_pcs: number;
}

const UpdatePurchase = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // navigation state থেকে purchaseData নিরাপদে নেওয়া হয়েছে। এটি সম্ভবত 'purchase' কী-এর অধীনে নেস্টেড আছে।
  const purchaseData = location.state?.purchase as PurchaseData;

  const { register, handleSubmit, setValue, reset, watch } =
    useForm<PurchaseData>();

  const [products, setProducts] = useState<ProductData[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true); // পণ্য লোডিং স্ট্যাটাস নিয়ন্ত্রণের জন্য স্টেট
  const [isSubmitting, setIsSubmitting] = useState(false); // বাটন লোডিং-এর জন্য নতুন স্টেট

  // --- পণ্যের তালিকা লোড করা ---
  // এই useEffect আপনার API থেকে সমস্ত পণ্য আনে।
  useEffect(() => {
    setLoadingProducts(true); // লোডিং শুরু হলে loading কে true সেট করা হয়েছে
    axios
      .get(`${import.meta.env.VITE_Basic_Api}/api/product/all`)
      .then((res) => {
        setProducts(res.data?.products || []);
      })
      .catch(() => {
        toast.error("পণ্য লোড করতে ব্যর্থ হয়েছে।"); // ব্যবহারকারী-বান্ধব ত্রুটি বার্তা
      })
      .finally(() => {
        setLoadingProducts(false); // লোডিং শেষ হলে loading কে false সেট করা হয়েছে
      });
  }, []); // খালি ডিপেন্ডেন্সি অ্যারে মানে এটি কম্পোনেন্ট মাউন্ট হওয়ার সময় একবার চলে

  // --- ফর্মের ডিফল্ট মান সেট করা ---
  // এই useEffect, navigation state এর মাধ্যমে পাস করা 'purchaseData' ব্যবহার করে ফর্মের ফিল্ডগুলো পূরণ করে।
  // এটি 'purchaseData' উপলব্ধ হওয়া এবং 'products' লোড হওয়া পর্যন্ত অপেক্ষা করে।
  useEffect(() => {
    if (purchaseData && products.length > 0 && !loadingProducts) {
      // 1. HTML তারিখ ইনপুটের জন্য তারিখ ফরম্যাট করা (YYYY-MM-DD)
      const formattedDate = purchaseData.date
        ? new Date(purchaseData.date).toISOString().split("T")[0]
        : "";

      // 2. পারচেজ ডেটা দিয়ে ফর্ম রিসেট করা
      reset({
        ...purchaseData,
        date: formattedDate, // ফরম্যাট করা তারিখ ব্যবহার করা হয়েছে
      });
    }
  }, [purchaseData, products, reset, loadingProducts]); // ডিপেন্ডেন্সি: এর যেকোনোটি পরিবর্তন হলে পুনরায় চলে

  // --- ড্রপডাউন থেকে পণ্য নির্বাচন হ্যান্ডেল করা ---
  const handleProductSelect = (
    event: React.ChangeEvent<HTMLSelectElement> // ইভেন্ট টাইপ পরিবর্তন করা হয়েছে
  ) => {
    const selectedProductCode = event.target.value; // সিলেক্ট করা পণ্যের কোড নেওয়া হয়েছে

    // লোড করা পণ্যের তালিকা থেকে নির্বাচিত পণ্য খুঁজে বের করা
    const selected = products.find(
      (p) => p.product_code === selectedProductCode
    );

    // যদি একটি পণ্য পাওয়া যায়, তাহলে সেই অনুযায়ী ফর্মের ফিল্ডগুলো আপডেট করা
    if (selected) {
      setValue("product_code", selected.product_code);
      setValue("company", selected.company);
      setValue("height", selected.height);
      setValue("width", selected.width);
      setValue("per_caton_to_pcs", selected.per_caton_to_pcs);
    } else {
      // যদি কোনো পণ্য নির্বাচিত না হয় বা পাওয়া না যায়, তাহলে product_code ছাড়া বাকি ফিল্ডগুলো রিসেট করা
      setValue("product_code", ""); // product_code খালি করা হয়েছে
      setValue("company", "");
      setValue("height", 0);
      setValue("width", 0);
      setValue("per_caton_to_pcs", 0);
    }
  };

  // --- React-Select এর জন্য অপশন প্রস্তুত করা ---
  // এখন এটি নেটিভ <select> এর জন্য ব্যবহার করা হবে
  const productOptions = products.map((product) => ({
    label: product.product_code,
    value: product.product_code,
  }));

  // --- ফর্ম সাবমিশন হ্যান্ডলার ---
  const onSubmit = async (data: PurchaseData) => {
    setIsSubmitting(true); // সাবমিশন শুরু হলে লোডিং true সেট করা হয়েছে
    try {
      await axios.patch(
        `${import.meta.env.VITE_Basic_Api}/api/purchase/update/${
          purchaseData._id
        }`,
        data
      );
      toast.success("পারচেজ সফলভাবে আপডেট হয়েছে!");
      navigate("/dashboard/purchase-form"); // সফল আপডেটের পর রিডাইরেক্ট করা হয়েছে
    } catch (err: any) {
      // সার্ভার থেকে ত্রুটি বার্তা বা একটি জেনেরিক বার্তা দেখানো হয়েছে
      toast.error(
        err?.response?.data?.message || "পারচেজ আপডেট করতে ব্যর্থ হয়েছে।"
      );
    } finally {
      setIsSubmitting(false); // সাবমিশন শেষ হলে (সফল বা ত্রুটি) লোডিং false সেট করা হয়েছে
    }
  };

  // --- অনুপস্থিত পারচেজ ডেটা হ্যান্ডেল করা ---
  // যদি navigation state এর মাধ্যমে কোনো পারচেজ ডেটা পাস না হয়, তাহলে একটি বার্তা দেখানো হয়েছে এবং ফিরে যাওয়ার একটি উপায় দেওয়া হয়েছে।
  if (!purchaseData) {
    return (
      <div className="text-center p-4 max-w-2xl mx-auto border rounded-md shadow-md bg-white">
        <p className="text-lg font-semibold text-red-600 mb-4">
          কোনো পারচেজ ডেটা পাওয়া যায়নি।
        </p>
        <p className="text-gray-700 mb-6">
          একটি আইটেম আপডেট করতে অনুগ্রহ করে পারচেজ হিস্টরি থেকে এই পৃষ্ঠায় যান।
        </p>
        <button
          onClick={() => navigate("/dashboard/purchase-history")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition duration-200 ease-in-out"
        >
          পারচেজ হিস্টরিতে যান
        </button>
      </div>
    );
  }

  // --- কম্পোনেন্ট রেন্ডার ---
  return (
    <div className="max-w-2xl mx-auto p-4 border rounded-md shadow-md bg-white">
      <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
        পারচেজ আপডেট করুন
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Product Code Select Field */}
        <div>
          <label
            htmlFor="product_code"
            className="block mb-1 font-medium text-gray-700"
          >
            পণ্যের কোড
          </label>
          <select
            id="product_code"
            {...register("product_code")} // react-hook-form এর সাথে রেজিস্টার করা হয়েছে
            onChange={handleProductSelect} // onChange হ্যান্ডলার
            disabled={loadingProducts || isSubmitting} // লোডিং বা সাবমিট করার সময় অক্ষম করা হয়েছে
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">একটি পণ্যের কোড নির্বাচন করুন...</option>{" "}
            {/* ডিফল্ট অপশন */}
            {productOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Company, Height, Width, Per Caton to Pcs (Read-only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="company"
              className="block mb-1 font-medium text-gray-700"
            >
              কোম্পানি
            </label>
            <input
              id="company"
              {...register("company")}
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-100 focus:outline-none"
              readOnly
            />
          </div>
          <div>
            <label
              htmlFor="height"
              className="block mb-1 font-medium text-gray-700"
            >
              উচ্চতা
            </label>
            <input
              id="height"
              type="number"
              {...register("height", { valueAsNumber: true })} // মানকে সংখ্যা হিসেবে নিশ্চিত করা হয়েছে
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-100 focus:outline-none"
              readOnly
            />
          </div>
          <div>
            <label
              htmlFor="width"
              className="block mb-1 font-medium text-gray-700"
            >
              প্রস্থ
            </label>
            <input
              id="width"
              type="number"
              {...register("width", { valueAsNumber: true })} // মানকে সংখ্যা হিসেবে নিশ্চিত করা হয়েছে
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-100 focus:outline-none"
              readOnly
            />
          </div>
          <div>
            <label
              htmlFor="per_caton_to_pcs"
              className="block mb-1 font-medium text-gray-700"
            >
              প্রতি কার্টনে পিস
            </label>
            <input
              id="per_caton_to_pcs"
              type="number"
              {...register("per_caton_to_pcs", { valueAsNumber: true })} // মানকে সংখ্যা হিসেবে নিশ্চিত করা হয়েছে
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-100 focus:outline-none"
              readOnly
            />
          </div>
        </div>

        {/* Caton and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="caton"
              className="block mb-1 font-medium text-gray-700"
            >
              কার্টন
            </label>
            <input
              id="caton"
              type="number"
              {...register("caton", { valueAsNumber: true })} // মানকে সংখ্যা হিসেবে নিশ্চিত করা হয়েছে
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting} // সাবমিট করার সময় অক্ষম করা হয়েছে
            />
          </div>

          <div>
            <label
              htmlFor="date"
              className="block mb-1 font-medium text-gray-700"
            >
              তারিখ
            </label>
            <input
              id="date"
              type="date"
              {...register("date")}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting} // সাবমিট করার সময় অক্ষম করা হয়েছে
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md font-semibold text-lg mt-6 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting} // সাবমিট করার সময় বাটন অক্ষম করা হয়েছে
        >
          {isSubmitting ? "আপডেট হচ্ছে..." : "পারচেজ আপডেট করুন"}{" "}
          {/* বাটন টেক্সট পরিবর্তন করা হয়েছে */}
        </button>
      </form>
    </div>
  );
};

export default UpdatePurchase;
