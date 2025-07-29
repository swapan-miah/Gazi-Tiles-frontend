import type { ICompany } from "./Company";

interface CompanyListProps {
  companies: ICompany[];
  onDelete: (companyName: string) => void; // নতুন প্রপ: ডিলিট ফাংশন
}

const Comapany_List: React.FC<CompanyListProps> = ({ companies, onDelete }) => {
  return (
    <ul className="space-y-2">
      {companies.map((company) => (
        <li
          key={company._id}
          className="border p-2 rounded shadow flex justify-between items-center"
        >
          <span>{company.company}</span>
          <button
            onClick={() => onDelete(company.company)} // ডিলিট বাটন
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default Comapany_List;
