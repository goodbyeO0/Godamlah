import React from "react";
import ChallengeSection from "../components/ChallengeSection";
import BottomNavigator from "../components/BottomNavigator";

const ChallengePage = () => {
  return (
    <div className="h-screen w-full bg-gray-100 p-4">
      <ChallengeSection />
      <BottomNavigator />
    </div>
  );
};

export default ChallengePage;
