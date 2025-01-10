import React from "react";

const LeaderboardSection = () => {
  const users = [
    { username: "Jamil", score: 1000, rank: 1 },
    { username: "Tom", score: 900, rank: 2 },
    { username: "Kamarul", score: 800, rank: 3 },
    { username: "Erlina", score: 700, rank: 4 },
    { username: "Luminous", score: 600, rank: 5 },
  ];

  const currentUser = { username: "you", score: 650, rank: 4 };

  return (
    <div className="w-full p-4 bg-gray-50">
      <h2 className="text-2xl font-bold text-center text-[#001646] mb-6">
        Scam Busting Hall of Fame
      </h2>

      {/* Top 3 Users */}
      <div className="flex justify-around mb-8">
        {users.slice(0, 3).map((user, idx) => (
          <div key={idx} className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#0172B1] text-white flex items-center justify-center mx-auto mb-2">
              {user.rank}
            </div>
            <p className="text-sm font-semibold">{user.username}</p>
            <p className="text-xs text-gray-500">{user.score} points</p>
          </div>
        ))}
      </div>

      {/* User Leaderboard */}
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.rank}
            className={`flex items-center justify-between p-3 rounded-md ${
              user.username === currentUser.username
                ? "bg-[#0172B1] text-white"
                : "bg-gray-200"
            }`}
          >
            <span>
              {user.rank}. {user.username}
            </span>
            <span>{user.score} points</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardSection;
