import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      localStorage.setItem("redirectAfterLogin", location.pathname);
      window.dispatchEvent(new Event("open-auth-modal"));
    }
  }, [user, location]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50">
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-pink-600 mb-4">
            You must be logged in
          </h2>
          <p className="text-gray-600 mb-6">
            This page is available only to registered users.
            Please log in or sign up to continue.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
// This component checks if the user is logged in before rendering the children components.
// If not logged in, it redirects to the login modal and shows a message.