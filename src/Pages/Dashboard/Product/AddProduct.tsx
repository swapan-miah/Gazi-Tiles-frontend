import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Select from "react-select";

interface Company {
  _id: string;
  company: string;
}

interface Props {
  refetch: () => void;
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

const AddProduct = ({ refetch }: Props) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return axios.post(
        `${import.meta.env.VITE_Basic_Api}/api/product/create`,
        {
          ...data,
          company: selectedCompany?.company,
        }
      );
    },
    onSuccess: () => {
      toast.success("✅ Product added successfully");
      reset();
      setSelectedCompany(null);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "❌ Failed to add product");
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
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-4xl mx-auto px-4 py-6 border mb-5"
      >
        <h2 className="text-2xl text-center font-semibold mb-6">
          Add Product Form
        </h2>

        {/* Responsive Grid for Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium">Company *</label>
            <Select
              className="border  w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              placeholder="Select a company"
              isLoading={isLoading}
            />
          </div>
          {/* Product Code */}
          <div>
            <label className="block mb-1 font-medium">Product Code *</label>
            <input
              type="text"
              {...register("product_code", {
                required: "Product Code is required",
              })}
              className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product code"
            />
            {errors.product_code && (
              <p className="text-red-600 text-sm">
                {errors.product_code.message}
              </p>
            )}
          </div>

          {/* Height */}
          <div>
            <label className="block mb-1 font-medium">Height *</label>
            <input
              type="number"
              {...register("height", {
                required: "Height is required",
                valueAsNumber: true,
              })}
              onWheel={(e) => e.currentTarget.blur()}
              className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter height"
            />
            {errors.height && (
              <p className="text-red-600 text-sm">{errors.height.message}</p>
            )}
          </div>

          {/* Width */}
          <div>
            <label className="block mb-1 font-medium">Width *</label>
            <input
              type="number"
              {...register("width", {
                required: "Width is required",
                valueAsNumber: true,
              })}
              onWheel={(e) => e.currentTarget.blur()}
              className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter width"
            />
            {errors.width && (
              <p className="text-red-600 text-sm">{errors.width.message}</p>
            )}
          </div>

          {/* Per Caton To Pcs */}
          <div>
            <label className="block mb-1 font-medium">Per Caton To Pcs *</label>
            <input
              type="number"
              {...register("per_caton_to_pcs", {
                required: "This field is required",
                valueAsNumber: true,
              })}
              onWheel={(e) => e.currentTarget.blur()}
              className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Per Caton To Pcs"
            />
            {errors.per_caton_to_pcs && (
              <p className="text-red-600 text-sm">
                {errors.per_caton_to_pcs.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full md:w-1/2 mx-auto block mt-4"
          disabled={mutation.status === "pending"}
        >
          {mutation.status === "pending" ? "Adding..." : "Add Product"}
        </button>
      </form>
    </>
  );
};

export default AddProduct;
