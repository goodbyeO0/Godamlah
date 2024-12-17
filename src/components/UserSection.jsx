import React, { useState, useEffect } from "react";
import usernamesData from "../data/usernames.json";
import reportedLinksData from "../data/reportedLinks.json"; // Simulated JSON file for reports

const UserSection = () => {
  const [username, setUsername] = useState("");
  const [buttonState, setButtonState] = useState("generate");
  const [lastGenerated, setLastGenerated] = useState(
    localStorage.getItem("lastGenerated") || null
  );
  const [groupLink, setGroupLink] = useState(""); // Report group link
  const [reportedLinks, setReportedLinks] = useState(reportedLinksData || []); // Reported links data

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedTime = localStorage.getItem("lastGenerated");

    if (savedUsername && savedTime) {
      const now = new Date();
      const lastTime = new Date(savedTime);
      if (now - lastTime < 1 * 60 * 1000) {
        setUsername(savedUsername);
        setButtonState("generated");
      }
    }
  }, []);

  const generateUsername = () => {
    const now = new Date();
    if (!lastGenerated || now - new Date(lastGenerated) >= 1 * 60 * 1000) {
      const randomIndex = Math.floor(Math.random() * usernamesData.length);
      const newUsername = usernamesData[randomIndex];

      setUsername(newUsername);
      setButtonState("generated");

      localStorage.setItem("username", newUsername);
      localStorage.setItem("lastGenerated", now);
      setLastGenerated(now);
    } else {
      alert("You can only generate a new username once every 12 hours.");
    }
  };

  const handleReportSubmit = () => {
    if (groupLink.trim()) {
      const updatedReports = [...reportedLinks, groupLink];
      setReportedLinks(updatedReports);
      setGroupLink("");

      console.log("Reported Links:", updatedReports); // Simulating JSON save
      alert("Report has been sent successfully!");
    } else {
      alert("Please enter a valid group link.");
    }
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col items-center p-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-semibold">Hi, User 👋</h1>
          <p className="text-gray-500 text-sm">Secure your chats</p>
        </div>
        <img
          src="src/assets/davina.jpg"
          alt="Profile"
          className="w-24 h-20 rounded-full"
        />
      </div>

      {/* Report Section */}
      <div className="w-full mt-6 p-4 bg-gray-100 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">
          Report Telegram Scams Instantly
        </h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Enter Group Link"
            value={groupLink}
            onChange={(e) => setGroupLink(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={handleReportSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Username Generator */}
      <div className="mt-6 w-full">
        <button
          onClick={generateUsername}
          className={`w-full flex items-center justify-center py-2 px-4 rounded-lg shadow transition ${
            buttonState === "generate"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
          disabled={buttonState === "generated"}
        >
          {buttonState === "generate" ? (
            <>
              Generate Telegram Username <span className="ml-2">⚡</span>
            </>
          ) : (
            <>
              Generated Username <span className="ml-2">✅</span>
            </>
          )}
        </button>

        {/* Display Generated Username */}
        {username && (
          <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow">
            <p className="text-xs text-gray-500">GENERATED ACCOUNT</p>
            <div className="text-gray-800 font-mono text-lg">{username}</div>
          </div>
        )}
      </div>

      {/* Recent Activities */}
      <div className="mt-8 w-full">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Recent Activities Status</h2>
        </div>

        {/* Article Section */}
        <div
          className="relative rounded-lg shadow-lg cursor-pointer overflow-hidden hover:opacity-90 transition"
          onClick={() => alert("Navigating to article page")}
        >
          <img
            src="src/assets/ai.webp"
            alt="Article"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 p-4 bg-black bg-opacity-50 text-white w-full flex flex-col rounded-b-lg">
            <span className="text-sm font-medium mb-1">
              Telegram Agrees to Share User Data With Authorities
            </span>
            <div className="text-xs flex justify-between items-center">
              <span>5 min</span>
              <div className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">
                News
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 w-full bg-white shadow-md">
        <div className="flex justify-around py-3 text-gray-600">
          {[
            { icon: "👤", label: "User" },
            { icon: "🏆", label: "Challenge" },
            { icon: "📊", label: "Leaderboard" },
            { icon: "📄", label: "Report" },
            { icon: "📈", label: "Analysis" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center cursor-pointer hover:text-blue-600 transition"
            >
              <span className="text-2xl">{item.icon}</span>
              <p className="text-xs">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSection;
