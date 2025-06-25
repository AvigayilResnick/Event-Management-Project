import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import AuthModal from "./AuthModal"; // ודא שזה הנתיב הנכון

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false); // ניהול מצב התחברות

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-pink-600 font-bold text-xl">Event Suppliers</Link>
      <div className="flex gap-4 items-center">
        <Link to="/about" className="text-gray-600 hover:text-pink-600">About</Link>

        {user && user.role === "supplier" && (
          <Link to="/edit-supplier" className="text-gray-600 hover:text-pink-600">Edit Profile</Link>
        )}

        {user && user.role === "client" && (
          <Link to="/create-supplier" className="text-gray-600 hover:text-pink-600">Become a Supplier</Link>
        )}

        {user ? (
          <>
            <span className="text-gray-600">{user.full_name}</span>
            <button onClick={logout} className="text-red-500 hover:underline">Logout</button>
          </>
        ) : (
          <>
            <button
              onClick={() => setModalOpen(true)}
              className="text-pink-600 hover:underline"
            >
              Login / Register
            </button>
            <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
