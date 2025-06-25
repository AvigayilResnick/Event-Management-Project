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

// נוספו
import About from "./pages/About";
import BecomeSupplierRequest from "./components/BecomeSupplierRequest";
import SupplierList from "./pages/SupplierList";
import SupplierDashboard from "./pages/SupplierDashboard";

function App() {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(!user);

  // ✅ פותח את ה-AuthModal מכל מקום (למשל מתוך ה-Navbar)
  useEffect(() => {
    const handleOpenAuthModal = () => setShowModal(true);
    window.addEventListener("open-auth-modal", handleOpenAuthModal);
    return () => {
      window.removeEventListener("open-auth-modal", handleOpenAuthModal);
    };
  }, []);

  // עוקב אחרי התחברות/ניתוק ומסתיר את המודל בהתאם
  useEffect(() => {
    setShowModal(!user);
  }, [user]);

  return (
    <Router>
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

        {/* דפים שמיועדים לספקים בלבד */}
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

        {/* דפים כלליים */}
        <Route
          path="/edit-user"
          element={
            <ProtectedRoute>
              <EditUserProfile />
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
      </Routes>
    </Router>
  );
}

export default App;
