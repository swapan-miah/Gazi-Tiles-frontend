import React from "react";

const PaymentNotice: React.FC = () => {
  return (
    <div className="flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-sm w-full border border-gray-200">
        <h2 className="text-xl font-bold text-center text-red-600 mb-4">
          🔔 পেমেন্ট নোটিশ
        </h2>

        <p className="text-gray-800 font-medium">
          বিষয়: <span className="font-semibold">মাসিক বিল</span>
        </p>
        <p className="text-gray-800 font-medium mt-2">
          মাস: <span className="font-semibold">সেপ্টেম্বর</span>
        </p>
        <p className="text-gray-800 font-medium mt-2">
          বিলের পরিমাণ:{" "}
          <span className="font-semibold text-blue-600">৫০০ টাকা</span>
        </p>
        <p className="text-gray-800 font-medium mt-2">
          পরিশোধের শেষ সময়:{" "}
          <span className="font-semibold text-red-500">12/09/2025</span>
        </p>
        <p className="text-gray-800 font-medium mt-2">
          বিকাশ নাম্বার:{" "}
          <span className="font-semibold text-green-600">01982526202</span>
        </p>

        <div className="mt-6 flex flex-col gap-3 text-center">
          {/* সাধারণ যোগাযোগ */}
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition">
            যোগাযোগ: 01332331964
          </button>

          {/* WhatsApp যোগাযোগ */}
          <a
            href="https://wa.me/8801332331964"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20b857] text-white px-4 py-2 rounded-lg shadow-md transition inline-block"
          >
            📱 WhatsApp: 01332331964
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentNotice;
