import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { LucideAlertCircle } from "lucide-react"; // Importing an icon for the error message

// Purchase data interface
interface PurchaseData {
  _id: string;
  product_code: string;
  company: string;
  height: number;
  width: number;
  per_caton_to_pcs: number;
  caton: number;
  pcs: number;
  date: string;
}

// Product data interface from API
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

  const purchaseData = location.state?.purchase as PurchaseData;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm<PurchaseData>();

  const [products, setProducts] = useState<ProductData[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load product list from API
  useEffect(() => {
    setLoadingProducts(true);
    axios
      .get(`${import.meta.env.VITE_Basic_Api}/api/product/all`)
      .then((res) => {
        setProducts(res.data?.products || []);
      })
      .catch(() => {
        toast.error("Failed to load products.");
      })
      .finally(() => {
        setLoadingProducts(false);
      });
  }, []);

  // Set default form values from purchase data
  useEffect(() => {
    if (purchaseData && products.length > 0 && !loadingProducts) {
      const formattedDate = purchaseData.date
        ? new Date(purchaseData.date).toISOString().split("T")[0]
        : "";

      reset({
        ...purchaseData,
        date: formattedDate,
      });
    }
  }, [purchaseData, products, reset, loadingProducts]);

  // Handle product selection from dropdown
  const handleProductSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProductCode = event.target.value;
    const selected = products.find(
      (p) => p.product_code === selectedProductCode
    );

    if (selected) {
      setValue("product_code", selected.product_code);
      setValue("company", selected.company);
      setValue("height", selected.height);
      setValue("width", selected.width);
      setValue("per_caton_to_pcs", selected.per_caton_to_pcs);
    } else {
      setValue("product_code", "");
      setValue("company", "");
      setValue("height", 0);
      setValue("width", 0);
      setValue("per_caton_to_pcs", 0);
    }
  };

  // Form submission handler
  const onSubmit = async (data: PurchaseData) => {
    setIsSubmitting(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_Basic_Api}/api/purchase/update/${
          purchaseData._id
        }`,
        data
      );
      toast.success("Purchase updated successfully!");
      navigate("/dashboard/purchase-form");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to update the purchase."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle missing purchase data (redirected without state)
  if (!purchaseData) {
    return (
      <div className="text-center p-4 max-w-2xl mx-auto border rounded-md shadow-md bg-white">
        <Toaster />
        <p className="text-lg font-semibold text-red-600 mb-4">
          No purchase data found.
        </p>
        <p className="text-gray-700 mb-6">
          Please navigate from the purchase history page to update an item.
        </p>
        <button
          onClick={() => navigate("/dashboard/purchase-history")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition duration-200"
        >
          Go to Purchase History
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 border rounded-md shadow-md bg-white font-sans antialiased">
      <Toaster />
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Update Purchase
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Company, Height, Width, Per Caton to Pcs (Read-only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="product_code"
              className="block mb-1 font-medium text-gray-700"
            >
              Product Code
            </label>
            <select
              id="product_code"
              {...register("product_code")}
              onChange={handleProductSelect}
              disabled={loadingProducts || isSubmitting}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a product code...</option>
              {products.map((product) => (
                <option key={product._id} value={product.product_code}>
                  {product.product_code}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="company"
              className="block mb-1 font-medium text-gray-700"
            >
              Company
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
              Height
            </label>
            <input
              id="height"
              type="number"
              {...register("height", { valueAsNumber: true })}
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-100 focus:outline-none"
              readOnly
            />
          </div>
          <div>
            <label
              htmlFor="width"
              className="block mb-1 font-medium text-gray-700"
            >
              Width
            </label>
            <input
              id="width"
              type="number"
              {...register("width", { valueAsNumber: true })}
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-100 focus:outline-none"
              readOnly
            />
          </div>
          <div>
            <label
              htmlFor="per_caton_to_pcs"
              className="block mb-1 font-medium text-gray-700"
            >
              Per Carton to Pcs
            </label>
            <input
              id="per_caton_to_pcs"
              type="number"
              {...register("per_caton_to_pcs", { valueAsNumber: true })}
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-100 focus:outline-none"
              readOnly
            />
          </div>
          <div>
            <label
              htmlFor="caton"
              className="block mb-1 font-medium text-gray-700"
            >
              Carton
            </label>
            <input
              id="caton"
              type="number"
              {...register("caton", { valueAsNumber: true })}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label
              htmlFor="pcs"
              className="block mb-1 font-medium text-gray-700"
            >
              Pcs
            </label>
            <input
              id="pcs"
              type="number"
              // Add validation to ensure pcs is less than per_caton_to_pcs
              {...register("pcs", {
                valueAsNumber: true,
                validate: (value) =>
                  value < getValues("per_caton_to_pcs") ||
                  "Pcs must be less than the 'Per Carton to Pcs' value.",
              })}
              // Set a max value for the input for better user experience
              max={getValues("per_caton_to_pcs") - 1}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
            {errors.pcs && (
              <p className="flex items-center mt-2 text-sm text-red-600">
                <LucideAlertCircle className="w-4 h-4 mr-1" />
                {errors.pcs.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="date"
              className="block mb-1 font-medium text-gray-700"
            >
              Date
            </label>
            <input
              id="date"
              type="date"
              {...register("date")}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md font-semibold text-lg mt-6 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Purchase"}
        </button>
      </form>
    </div>
  );
};

export default UpdatePurchase;
