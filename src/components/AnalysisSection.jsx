import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import scamCategories from "../data/scamCategories.json";
import scamReports from "../data/scamReports.json";
import "chart.js/auto";

const AnalysisSection = () => {
  const pieData = {
    labels: scamCategories.map((item) => item.category),
    datasets: [
      {
        data: scamCategories.map((item) => item.percentage),
        backgroundColor: ["#0172B1", "#001646", "#888888"],
        hoverOffset: 4,
      },
    ],
  };

  const barData = {
    labels: ["01", "02", "03", "04", "05", "06", "07"],
    datasets: [
      {
        label: "Last Week",
        data: scamReports.lastWeek,
        backgroundColor: "#888888",
      },
      {
        label: "This Week",
        data: scamReports.thisWeek,
        backgroundColor: "#0172B1",
      },
    ],
  };

  return (
    <div className="w-full p-4 bg-gray-50">
      <h2 className="text-2xl font-bold text-center text-[#001646] mb-4">
        TeleSpectrom Analytics Dashboard
      </h2>

      {/* Scam Category - Pie Chart */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-sm font-semibold text-gray-700">Scam Category</h3>
        <p className="text-xs text-gray-500">From 1-6 Dec, 2024</p>
        <Pie data={pieData} />
      </div>

      {/* Scam Reports - Bar Chart */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Scam Reports</h3>
        <p className="text-lg font-bold text-gray-800">
          12,475 Telegram Groups Detected as Scams
          <span className="text-green-500 text-sm ml-2">▲ 3.4% vs last week</span>
        </p>
        <p className="text-xs text-gray-500 mb-4">
          Scams Detected from 1-12 Dec, 2024
        </p>
        <Bar data={barData} />
      </div>
    </div>
  );
};

export default AnalysisSection;
