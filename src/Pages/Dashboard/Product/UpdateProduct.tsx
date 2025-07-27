import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Select from "react-select";

interface Company {
  _id: string;
  company: string;
}

interface Product {
  _id: string;
  product_code: string;
  height: number;
  width: number;
  per_caton_to_pcs: number;
  company: string;
}

interface Props {
  product: Product;
  refetch: () => void;
  onClose: () => void;
}

interface FormValues {
  product_code: string;
  height: number;
  width: number;
  per_caton_to_pcs: number;
}

const fetchCompanies = async (): Promise<Company[]> => {
  const res = await axios.get(
    `${import.meta.env.VITE_Basic_Api}/api/company/all`
  );
  return res.data.companies;
};

const UpdateProduct = ({ product, refetch, onClose }: Props) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
  });

  useEffect(() => {
    // Prefill form
    setValue("product_code", product.product_code);
    setValue("height", product.height);
    setValue("width", product.width);
    setValue("per_caton_to_pcs", product.per_caton_to_pcs);

    const matchedCompany = companies.find((c) => c.company === product.company);
    if (matchedCompany) {
      setSelectedCompany(matchedCompany);
    }
  }, [product, companies, setValue]);

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return axios.put(
        `${import.meta.env.VITE_Basic_Api}/api/product/update/${product._id}`,
        {
          ...data,
          company: selectedCompany?.company,
        }
      );
    },
    onSuccess: () => {
      toast.success("✅ Product updated successfully");
      reset();
      onClose();
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "❌ Failed to update");
    },
  });

  const onSubmit = (data: FormValues) => {
    if (!selectedCompany) {
      toast.error("Please select a company");
      return;
    }
    mutation.mutate(data);
  };

  const companyOptions = companies.map((company) => ({
    value: company._id,
    label: company.company,
    fullData: company,
  }));

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-4xl mx-auto px-4 py-6 border mb-5"
    >
      <h2 className="text-2xl text-center font-semibold mb-6">
        Update Product
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 font-medium">Company *</label>
          <Select
            options={companyOptions}
            value={
              selectedCompany
                ? {
                    value: selectedCompany._id,
                    label: selectedCompany.company,
                  }
                : null
            }
            onChange={(option) => {
              if (option) {
                setSelectedCompany((option as any).fullData);
              } else {
                setSelectedCompany(null);
              }
            }}
            isClearable
            isLoading={isLoading}
            placeholder="Select a company"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Product Code *</label>
          <input
            type="text"
            {...register("product_code", {
              required: "Product Code is required",
            })}
            className="border px-3 py-2 w-full rounded"
            placeholder="Enter product code"
          />
          {errors.product_code && (
            <p className="text-red-600 text-sm">
              {errors.product_code.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Height *</label>
          <input
            type="number"
            {...register("height", {
              required: "Height is required",
              valueAsNumber: true,
            })}
            onWheel={(e) => e.currentTarget.blur()}
            className="border px-3 py-2 w-full rounded"
            placeholder="Enter height"
          />
          {errors.height && (
            <p className="text-red-600 text-sm">{errors.height.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Width *</label>
          <input
            type="number"
            {...register("width", {
              required: "Width is required",
              valueAsNumber: true,
            })}
            onWheel={(e) => e.currentTarget.blur()}
            className="border px-3 py-2 w-full rounded"
            placeholder="Enter width"
          />
          {errors.width && (
            <p className="text-red-600 text-sm">{errors.width.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Per Caton To Pcs *</label>
          <input
            type="number"
            {...register("per_caton_to_pcs", {
              required: "This field is required",
              valueAsNumber: true,
            })}
            onWheel={(e) => e.currentTarget.blur()}
            className="border px-3 py-2 w-full rounded"
            placeholder="Enter Per Caton To Pcs"
          />
          {errors.per_caton_to_pcs && (
            <p className="text-red-600 text-sm">
              {errors.per_caton_to_pcs.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={mutation.status === "pending"}
        >
          {mutation.status === "pending" ? "Updating..." : "Update Product"}
        </button>
      </div>
    </form>
  );
};

export default UpdateProduct;
