import React from "react";
import UserSection from "../components/UserSection";
import BottomNavigator from "../components/BottomNavigator";

const UserPage = () => {
  return (
    <div className="h-screen w-full bg-gray-100 p-4">
      <UserSection />
      <BottomNavigator />
    </div>
  );
};

export default UserPage;
