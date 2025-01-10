import React, { useState } from "react";

const ChallengeSection = () => {
  const totalPoints = 1000; // Total points required
  const [userPoints] = useState(450); // Example user points

  const completionPercentage = Math.min((userPoints / totalPoints) * 100, 100);
  const pointsRemaining = 248;

  const rewards = [
    { task: "Report 25 scam groups", reward: "bronze badge" },
    { task: "Identify 50 new scam types", reward: "silver badge" },
    { task: "Report 100 verified scam groups", reward: "gold badge" },
  ];

  return (
    <div className="w-full h-full bg-[#FFFFFF] rounded-lg shadow-lg p-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-[#001646] text-center mb-6">
        TeleSpectrom Mission 🏆
      </h2>

      {/* Rewards Pool */}
      <div className="border-2 border-[#0172B1] bg-[#001646] text-[#FFFFFF] p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-center mb-2">
          Rewards Pool - 3 badges
        </h3>
        <div className="text-center">
          <button className="px-4 py-1 bg-[#0172B1] text-white text-sm font-semibold rounded-full shadow-md">
            {userPoints} Points
          </button>
        </div>
      </div>

      {/* Rewards List */}
      <div className="mt-6 space-y-4">
        {rewards.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-[#F9F9F9] border border-[#888888] rounded-lg p-4 shadow hover:shadow-lg transition-all"
          >
            <div className="text-[#2F2F2F] text-sm font-medium">
              {item.task}
              <br />
              <span className="text-[#0172B1] font-semibold">
                {item.reward}
              </span>
            </div>
            <button className="bg-[#0172B1] text-white text-xs px-4 py-1 rounded-full shadow-md hover:bg-[#001646] transition-all">
              Claim
            </button>
          </div>
        ))}
      </div>

      {/* Progress Section */}
      <div className="mt-8">
        <h3 className="text-sm font-medium text-[#2F2F2F] mb-1">
          Challenge Progress
        </h3>
        <div className="w-full bg-[#E0E0E0] rounded-full">
          <div
            className="bg-[#0172B1] text-xs font-medium text-center leading-none rounded-full text-white transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          >
            {completionPercentage.toFixed(0)}%
          </div>
        </div>
        <p className="mt-2 text-sm text-[#2F2F2F] text-center">
          Earn{" "}
          <span className="text-[#0172B1] font-semibold">
            {pointsRemaining} more points
          </span>{" "}
          to complete the mission!!
        </p>
      </div>
    </div>
  );
};

export default ChallengeSection;
