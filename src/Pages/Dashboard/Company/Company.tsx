import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CreateCompany from "./CreateCompany";
import Comapany_List from "./Comapany_List";
import { toast } from "react-hot-toast"; // toast নোটিফিকেশনের জন্য
import PaymentNotice from "../../../Components/PaymentNotice/PaymentNotice";

// ✅ Define company type
export interface ICompany {
  _id: string;
  company: string;
}

// ✅ Define full response type
interface CompanyResponse {
  success: boolean;
  message: string;
  companies: ICompany[];
}

const Company = () => {
  const queryClient = useQueryClient(); // useQueryClient hook ব্যবহার করা হয়েছে

  const {
    data: companies = [],
    isLoading,
    error,
    refetch, // refetch ফাংশন এখনো ব্যবহার করা হবে
  } = useQuery<ICompany[], Error>({
    queryKey: ["allCompanies"], // queryKey পরিবর্তন করা হয়েছে যাতে আরও সুনির্দিষ্ট হয়
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_Basic_Api}/api/company/all`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_Front_Backend_Key}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data: CompanyResponse = await res.json();
      return data.companies; // ✅ return only the companies array
    },
  });

  // useMutation hook ব্যবহার করে কোম্পানি ডিলিট করার ফাংশন তৈরি করা হয়েছে
  const deleteCompany = useMutation<any, Error, string>({
    mutationFn: async (companyName: string) => {
      const res = await fetch(
        `${import.meta.env.VITE_Basic_Api}/api/company/delete/${companyName}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_Front_Backend_Key}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete company");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Company deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["allCompanies"] }); // ডিলিট সফল হলে query invalidate করে refetch করা হবে
    },
    onError: (err) => {
      toast.error(`Error deleting company: ${err.message}`);
    },
  });

  return (
    <div className="p-4 space-y-6">
      <PaymentNotice></PaymentNotice>
      <CreateCompany refetch={refetch} />{" "}
      {/* CreateCompany এখনো refetch ব্যবহার করবে */}
      <Comapany_List
        companies={companies}
        onDelete={deleteCompany.mutate}
      />{" "}
      {/* onDelete প্রপ পাস করা হয়েছে */}
      {isLoading && <p className="text-blue-600">Loading companies...</p>}
      {error && <p className="text-red-600">Error: {error.message}</p>}
      {deleteCompany.isPending && (
        <p className="text-yellow-600">Deleting company...</p>
      )}{" "}
      {/* ডিলিট লোডিং স্টেট */}
    </div>
  );
};

export default Company;
