import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Select from "react-select";

interface Product {
  _id: string;
  product_code: string;
  company: string;
  height: number;
  width: number;
  per_caton_to_pcs: number;
}

interface OptionType {
  label: string;
  value: string;
  company: string;
  height: number;
  width: number;
  per_caton_to_pcs: number;
}

interface FormValues {
  product_code: string;
  company: string;
  caton: number;
  height: number;
  width: number;
  per_caton_to_pcs: number;
  date: string;
}

interface AddPurchaseProps {
  onAdded: () => void;
}

const AddPurchase = ({ onAdded }: AddPurchaseProps) => {
  const { register, handleSubmit, reset, setValue } = useForm<FormValues>();

  // ✅ Product fetch
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["product"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_Basic_Api}/api/product/all`
        );
        return res.data.products;
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load products");
        return [];
      }
    },
  });

  const options: OptionType[] = products.map((item) => ({
    label: item.product_code,
    value: item.product_code,
    company: item.company,
    height: item.height,
    width: item.width,
    per_caton_to_pcs: item.per_caton_to_pcs,
  }));

  // ✅ Submit mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_Basic_Api}/api/purchase/create`,
          data
        );
        return res.data;
      } catch (err: any) {
        // re-throw so onError gets triggered
        throw err;
      }
    },
    onSuccess: (res) => {
      toast.success(res.message || "✅ Purchase added!");
      reset();
      onAdded();
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "❌ Something went wrong";
      toast.error(message);
    },
  });

  const onSubmit = (data: FormValues) => {
    if (!data.product_code || !data.company) {
      toast.error("⚠️ Please select a valid product first");
      return;
    }

    mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Purchase</h2>

      {/* 🔽 Select Product Dropdown */}
      <div className="mb-6">
        <label className="block font-semibold mb-1">Select Product</label>
        <Select
          options={options}
          isLoading={isLoading}
          onChange={(selected) => {
            if (selected) {
              setValue("product_code", selected.value);
              setValue("company", selected.company);
              setValue("height", selected.height);
              setValue("width", selected.width);
              setValue("per_caton_to_pcs", selected.per_caton_to_pcs);
            }
          }}
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Product Code */}
        <div>
          <label className="block font-semibold mb-1">Product Code</label>
          <input
            type="text"
            {...register("product_code")}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block font-semibold mb-1">Company</label>
          <input
            type="text"
            {...register("company")}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        {/* Caton */}
        <div>
          <label className="block font-semibold mb-1">Caton</label>
          <input
            type="number"
            {...register("caton", {
              required: true,
              min: 1,
              valueAsNumber: true,
            })}
            onWheel={(e) => e.currentTarget.blur()}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Height */}
        <div>
          <label className="block font-semibold mb-1">Height</label>
          <input
            type="number"
            {...register("height", {
              required: true,
              min: 1,
              valueAsNumber: true,
            })}
            readOnly
            onWheel={(e) => e.currentTarget.blur()}
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Width */}
        <div>
          <label className="block font-semibold mb-1">Width</label>
          <input
            type="number"
            {...register("width", {
              required: true,
              min: 1,
              valueAsNumber: true,
            })}
            readOnly
            onWheel={(e) => e.currentTarget.blur()}
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Per Caton To Pcs */}
        <div>
          <label className="block font-semibold mb-1">Per Caton To Pcs</label>
          <input
            type="number"
            {...register("per_caton_to_pcs", {
              required: true,
              min: 1,
              valueAsNumber: true,
            })}
            readOnly
            onWheel={(e) => e.currentTarget.blur()}
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Date */}
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">Date</label>
          <input
            type="date"
            {...register("date", { required: true })}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            {isPending ? "Saving..." : "Submit Purchase"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPurchase;
