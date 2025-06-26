import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import RoleRequestsPage from "./pages/RoleRequestsPage"; // ✅ חדש

function App() {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(!user);

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
    <Router>
      <Navbar />
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <Routes>
        {/* ציבורי */}
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

        {/* ספקים בלבד */}
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

        {/* פרופיל משתמש (רגיל או ספק) */}
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

        {/* בקשת מעבר לספק */}
        <Route
          path="/become-supplier"
          element={
            <ProtectedRoute>
              <BecomeSupplierRequest />
            </ProtectedRoute>
          }
        />

        {/* מנהלים בלבד */}
        <Route
          path="/admin/requests"
          element={
            <ProtectedRoute>
              {user?.role === "admin" ? <RoleRequestsPage /> : <Navigate to="/" />}
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
