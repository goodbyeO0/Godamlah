import React from "react";
import { useNavigate } from "react-router-dom";

const BottomNavigator = () => {
  const navigate = useNavigate();

  const navigationItems = [
    { icon: "👤", label: "User", path: "/" },
    { icon: "🏆", label: "Challenge", path: "/challenge" },
    { icon: "📊", label: "Leaderboard", path: "/leaderboard" },
    { icon: "📈", label: "Analysis", path: "/analysis" },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[500px] bg-white shadow-md rounded-t-lg">
      <div className="flex justify-around py-3 text-gray-600">
        {navigationItems.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center cursor-pointer hover:text-blue-600 transition"
            onClick={() => navigate(item.path)}
          >
            <span className="text-2xl">{item.icon}</span>
            <p className="text-xs">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigator;
