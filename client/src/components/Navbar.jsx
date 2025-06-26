import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
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

        {user && user.role === "supplier" && (
          <>
            <Link to="/supplier-dashboard" className="text-gray-600 hover:text-pink-600">
              Dashboard
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-700">Hello, {user.full_name}</span>
            <button
              onClick={logout}
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
