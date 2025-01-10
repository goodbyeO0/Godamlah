import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CoverSection from "./components/CoverSection";
import LoginSection from "./components/LoginSection";
import RegisterSection from "./components/RegisterSection";
import UserPage from "./pages/UserPage";
import ChallengePage from "./pages/ChallengePage";
import AnalysisSection from "./components/AnalysisSection";
import LeaderboardSection from "./components/LeaderboardSection";
import BottomNavigator from "./components/BottomNavigator";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(
    JSON.parse(localStorage.getItem("isRegistered")) || false
  );

  const [isLoggedIn, setIsLoggedIn] = useState(
    JSON.parse(localStorage.getItem("isLoggedIn")) || false
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000); // Simulate loading screen
    return () => clearTimeout(timer);
  }, []);

  // Save registration and login state to localStorage
  useEffect(() => {
    localStorage.setItem("isRegistered", JSON.stringify(isRegistered));
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isRegistered, isLoggedIn]);

  return (
    <AuthProvider>
      <Router>
        <div className="flex items-center justify-center h-screen bg-gray-200">
          <div className="w-[375px] md:w-[500px] h-screen bg-white shadow-lg overflow-hidden rounded-lg relative">
            {isLoading ? (
              <CoverSection />
            ) : (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto">
                  <Routes>
                    {/* Register Page (First Page) */}
                    <Route
                      path="/"
                      element={
                        <RegisterSection setIsRegistered={setIsRegistered} />
                      }
                    />

                    {/* Login Page */}
                    <Route
                      path="/login"
                      element={<LoginSection setIsLoggedIn={setIsLoggedIn} />}
                    />

                    {/* User Page */}
                    <Route path="/user" element={<UserPage />} />

                    {/* Other Pages */}
                    <Route path="/challenge" element={<ChallengePage />} />
                    <Route path="/analysis" element={<AnalysisSection />} />
                    <Route
                      path="/leaderboard"
                      element={<LeaderboardSection />}
                    />
                  </Routes>
                </div>

                {/* Bottom Navigator (Hidden on Register and Login Pages) */}
                {!(
                  window.location.pathname === "/" ||
                  window.location.pathname === "/login"
                ) && <BottomNavigator />}
              </div>
            )}
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
