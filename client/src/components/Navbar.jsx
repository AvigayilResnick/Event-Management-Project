import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { logout as logoutApi } from "../api/auth";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutApi();
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow mb-6 p-4 flex justify-between items-center">
      <Link to="/" className="text-pink-600 text-2xl font-bold">
        ספקים לאירועים
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-700">שלום, {user.full_name}</span>
            <Link to="/edit-user" className="text-blue-600 underline">ערוך פרופיל</Link>
            {user.role === "supplier" && (
              <Link to="/edit-supplier" className="text-blue-600 underline">ערוך דף ספק</Link>
            )}
            <button onClick={handleLogout} className="text-red-500 hover:underline">
              התנתק
            </button>
          </>
        ) : (
          <span className="text-gray-600">ברוך הבא</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
// This Navbar component displays the site title and user information.
// It includes links to edit the user profile and supplier profile if the user is logged in.