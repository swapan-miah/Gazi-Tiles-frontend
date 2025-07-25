import { useForm } from "react-hook-form";
import Select from "react-select";
import axios from "axios";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface ProductOption {
  _id: string;
  company: string;
  product_code: string;
}

interface FormValues {
  product_code: string;
  company: string;
  caton: number;
  feet: number;
  invoice_number: string;
  date: string;
}

const AddPurchase = ({ onAdded }: { onAdded: () => void }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const [selectedOption, setSelectedOption] = useState<any>(null);
  const queryClient = useQueryClient();

  const {
    data: productOptionsData,
    isLoading,
    error,
  } = useQuery<ProductOption[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/api/product/all");
      return res.data.products;
    },
  });

  const productOptions =
    productOptionsData?.map((product) => ({
      label: product.product_code,
      value: product.product_code,
      company: product.company,
    })) || [];

  const { mutate: addPurchase, isPending } = useMutation({
    mutationFn: async (newPurchase: FormValues) => {
      const res = await axios.post(
        "http://localhost:5000/api/purchase/create",
        newPurchase
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("✅ Purchase Added!");
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      onAdded();
      reset();
      setSelectedOption(null);
    },
    onError: (err: any) => {
      console.error(err);
      if (err.response?.status === 409) {
        toast.error("❌ This product with this invoice already exists.");
      } else {
        toast.error("❌ Something went wrong!");
      }
    },
  });

  const onSubmit = (data: FormValues) => {
    addPurchase(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-md shadow bg-white max-w-5xl mx-auto text-sm"
    >
      {/* ✅ Invoice First */}
      <div className="col-span-1">
        <label className="block font-semibold mb-1">Invoice Number</label>
        <input
          {...register("invoice_number", { required: true })}
          className="w-full p-2 border rounded"
          placeholder="Enter invoice number"
        />
        {errors.invoice_number && (
          <p className="text-red-500 text-xs">Invoice is required</p>
        )}
      </div>

      {/* ✅ Product Code */}
      <div className="col-span-1">
        <label className="block font-semibold mb-1">Product Code</label>
        <Select
          value={selectedOption}
          onChange={(selected: any) => {
            setSelectedOption(selected);
            setValue("product_code", selected.value);
            setValue("company", selected.company);
          }}
          options={productOptions}
          placeholder="Select product"
          isDisabled={isLoading}
        />
        {errors.product_code && (
          <p className="text-red-500 text-xs">Product code is required</p>
        )}
      </div>

      {/* ✅ Company (Auto-filled) */}
      <div className="col-span-1">
        <label className="block font-semibold mb-1">Company</label>
        <input
          {...register("company", { required: true })}
          readOnly
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>

      {/* ✅ Caton */}
      <div>
        <label className="block font-semibold mb-1">Caton</label>
        <input
          type="number"
          {...register("caton", {
            required: true,
            min: 1,
            valueAsNumber: true,
          })}
          className="w-full p-2 border rounded"
          onWheel={(e) => e.currentTarget.blur()}
        />
      </div>

      {/* ✅ Feet */}
      <div>
        <label className="block font-semibold mb-1">Feet</label>
        <input
          type="number"
          {...register("feet", { required: true, min: 1, valueAsNumber: true })}
          className="w-full p-2 border rounded"
          onWheel={(e) => e.currentTarget.blur()}
        />
      </div>

      {/* ✅ Date */}
      <div>
        <label className="block font-semibold mb-1">Date</label>
        <input
          type="date"
          {...register("date", { required: true })}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* ✅ Submit */}
      <div className="md:col-span-3">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
          disabled={isPending || isLoading}
        >
          {isPending ? "Adding..." : "Add Purchase"}
        </button>
      </div>
    </form>
  );
};

export default AddPurchase;
