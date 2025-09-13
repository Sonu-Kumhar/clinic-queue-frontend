import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import UserView from "./components/UserView";
import AdminView from "./components/AdminView";
import Login from "./components/Login";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // ✅ Load login state from localStorage on first render
  useEffect(() => {
    const storedAdmin = localStorage.getItem("isAdmin");
    if (storedAdmin === "true") {
      setIsAdmin(true);
    }
  }, []);

  const handleLogin = (email, password) => {
    if (email === "admin@clinic.com" && password === "admin123") {
      setIsAdmin(true);
      localStorage.setItem("isAdmin", "true"); // ✅ persist login
      navigate("/admin");
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin"); // ✅ clear login on logout
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 tracking-wide">
            🏥 Clinic Queue
          </h1>
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              User
            </Link>
            {!isAdmin && (
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Admin Login
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Admin
              </Link>
            )}
            {isAdmin && (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        <Routes>
          <Route path="/" element={<UserView />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/admin"
            element={isAdmin ? <AdminView /> : <Login onLogin={handleLogin} />}
          />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Clinic Queue System. All rights reserved.
      </footer>
    </div>
  );
}
