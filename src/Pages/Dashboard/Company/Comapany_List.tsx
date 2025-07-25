import type { ICompany } from "./Company";

interface CompanyListProps {
  companies: ICompany[];
}

const Comapany_List: React.FC<CompanyListProps> = ({ companies }) => {
  return (
    <ul className="space-y-2">
      {companies.map((company) => (
        <li key={company._id} className="border p-2 rounded shadow">
          {company.company}
        </li>
      ))}
    </ul>
  );
};

export default Comapany_List;
