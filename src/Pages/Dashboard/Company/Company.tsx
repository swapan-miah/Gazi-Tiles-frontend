import { useQuery } from "@tanstack/react-query";
import CreateCompany from "./CreateCompany";
import Comapany_List from "./Comapany_List";

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
  const {
    data: companies = [],
    isLoading,
    error,
    refetch,
  } = useQuery<ICompany[], Error>({
    queryKey: ["all"],
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

  return (
    <div className="p-4 space-y-6">
      <CreateCompany refetch={refetch} />
      <Comapany_List companies={companies} />

      {isLoading && <p className="text-blue-600">Loading companies...</p>}
      {error && <p className="text-red-600">Error: {error.message}</p>}
    </div>
  );
};

export default Company;
