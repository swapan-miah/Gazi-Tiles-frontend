import React, { useState } from "react";
import toast from "react-hot-toast"; // ✅ Toast import করুন

interface CreateCompanyProps {
  refetch: () => void;
}

const CreateCompany: React.FC<CreateCompanyProps> = ({ refetch }) => {
  const [company, setCompany] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_Basic_Api}/api/company/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ company }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || "Company created successfully ✅");
        setCompany("");
        refetch();
      } else {
        toast.error(data.message || "Something went wrong ❌");
      }
    } catch (err) {
      toast.error("Network error or server is down 🔌");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-semibold mb-4">Add New Company</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="company" className="block mb-1 font-medium">
            Company Name
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Company
        </button>
      </form>
    </div>
  );
};

export default CreateCompany;
