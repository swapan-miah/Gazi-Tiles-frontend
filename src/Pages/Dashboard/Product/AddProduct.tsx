import { useState } from "react";
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

const fetchCompanies = async (): Promise<Company[]> => {
  const res = await axios.get(
    "https://gazi-tiles-backend.vercel.app/api/company/all"
  );
  return res.data.companies;
};

const AddProduct = ({ refetch }: Props) => {
  const [productCode, setProductCode] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      return axios.post(
        "https://gazi-tiles-backend.vercel.app/api/product/create",
        {
          company: selectedCompany?.company,
          product_code: productCode,
        }
      );
    },
    onSuccess: () => {
      toast.success("✅ Product added successfully");
      setProductCode("");
      setSelectedCompany(null);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "❌ Failed to add product");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany || !productCode.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    mutation.mutate();
  };

  const companyOptions = companies.map((company) => ({
    value: company._id,
    label: company.company,
    fullData: company,
  }));

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4 max-w-md mx-auto">
      <div>
        <label className="block mb-1 font-medium">Company *</label>
        <Select
          options={companyOptions}
          value={
            selectedCompany
              ? { value: selectedCompany._id, label: selectedCompany.company }
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

      <div>
        <label className="block mb-1 font-medium">Product Code *</label>
        <input
          value={productCode}
          onChange={(e) => setProductCode(e.target.value)}
          className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter product code"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        disabled={mutation.status === "pending"}
      >
        {mutation.status === "pending" ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
};

export default AddProduct;
