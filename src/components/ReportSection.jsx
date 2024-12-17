import React, { useState } from "react";

const ReportSection = () => {
  const [groupLink, setGroupLink] = useState("");

  const handleSubmit = () => {
    if (groupLink) {
      alert("Report has been sent successfully!");
      setGroupLink("");
    } else {
      alert("Please enter a group link.");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
      <h2 className="text-xl font-bold text-[#001646] mb-6">
        Report Telegram Scams Instantly
      </h2>

      <div className="flex items-center w-full max-w-md border border-gray-400 rounded-lg p-2">
        <input
          type="text"
          placeholder="Group Link"
          value={groupLink}
          onChange={(e) => setGroupLink(e.target.value)}
          className="w-full outline-none text-gray-600"
        />
        <button
          onClick={handleSubmit}
          className="bg-[#0172B1] text-white px-4 py-2 rounded-lg shadow hover:bg-[#001646] transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ReportSection;
