import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold text-pink-600">
          Home
        </Link>
        <Link to="/suppliers" className="text-gray-600 hover:text-pink-600">
          Find Suppliers
        </Link>
        <Link to="/about" className="text-gray-600 hover:text-pink-600">
          About
        </Link>

        {user && (
          <Link to="/profile" className="text-gray-600 hover:text-pink-600">
            My Profile
          </Link>
        )}

        {user?.role === "supplier" && (
          <Link to="/supplier-dashboard" className="text-gray-600 hover:text-pink-600">
            Dashboard
          </Link>
        )}

        {user?.role === "admin" && (
          <Link to="/admin/requests" className="text-gray-600 hover:text-pink-600">
            Role Requests
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-700">Hello, {user.full_name}</span>
            <button
              onClick={() => {
                logout();
                navigate("/", { replace: true });
              }}
              className="text-sm text-pink-600 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => window.dispatchEvent(new Event("open-auth-modal"))}
            className="text-sm text-pink-600 hover:underline"
          >
            Login / Sign Up
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
// This component renders the navigation bar with links to different pages.
// It also conditionally displays user information and login/logout options based on the authentication state.