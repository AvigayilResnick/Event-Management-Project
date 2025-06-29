import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import AuthModal from "./components/AuthModal";
import Home from "./pages/Home";
import SupplierPage from "./pages/SupplierPage";
import CreateSupplierPage from "./pages/CreateSupplierPage";
import EditUserProfile from "./pages/EditUserProfile";
import EditSupplierPage from "./pages/EditSupplierPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import BecomeSupplierRequest from "./components/BecomeSupplierRequest";
import SupplierList from "./pages/SupplierList";
import SupplierDashboard from "./pages/SupplierDashboard";
import MyProfile from "./pages/MyProfile";
import ChangePassword from "./pages/ChangePassword";
import RoleRequestsPage from "./pages/RoleRequestsPage";

function App() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(!user);

  // 🔒 חוסם BACK אם המשתמש לא מחובר
  useEffect(() => {
    if (!user) {
      console.log("🔒 Blocking back navigation because user is not logged in");
      window.history.pushState(null, "", window.location.href);
      window.history.pushState(null, "", window.location.href);
      const handleBack = () => {
        console.log("🔙 BACK detected → redirecting to home");
        navigate("/", { replace: true });
      };
      window.onpopstate = handleBack;

      return () => {
        window.onpopstate = null;
      };
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleOpenAuthModal = () => setShowModal(true);
    window.addEventListener("open-auth-modal", handleOpenAuthModal);
    return () => {
      window.removeEventListener("open-auth-modal", handleOpenAuthModal);
    };
  }, []);

  useEffect(() => {
    setShowModal(!user);
  }, [user]);

  return (
    <>
      <Navbar />
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/suppliers" element={<SupplierList />} />
        <Route
          path="/suppliers/:id"
          element={
            <ProtectedRoute>
              <SupplierPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-supplier"
          element={
            <ProtectedRoute>
              {user?.role === "supplier" ? <CreateSupplierPage /> : <Navigate to="/" />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-supplier-page/:id"
          element={
            <ProtectedRoute>
              {user?.role === "supplier" ? <EditSupplierPage /> : <Navigate to="/" />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier-dashboard"
          element={
            <ProtectedRoute>
              {user?.role === "supplier" ? <SupplierDashboard /> : <Navigate to="/" />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-user"
          element={
            <ProtectedRoute>
              <EditUserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/become-supplier"
          element={
            <ProtectedRoute>
              <BecomeSupplierRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/requests"
          element={
            <ProtectedRoute>
              {user?.role === "admin" ? <RoleRequestsPage /> : <Navigate to="/" />}
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;