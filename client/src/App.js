import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import AuthModal from "./components/AuthModal";
import Home from "./pages/Home";
import SupplierPage from "./pages/SupplierPage";
import CreateSupplierProfile from "./pages/CreateSupplierProfile";
import EditUserProfile from "./pages/EditUserProfile";
import EditSupplierProfile from "./pages/EditSupplierProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(!user);

  useEffect(() => {
    setShowModal(!user);
  }, [user]);

  return (
    <Router>
      <Navbar />
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <Routes>
        <Route path="/" element={<Home />} />
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
              <CreateSupplierProfile />
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
          path="/edit-supplier"
          element={
            <ProtectedRoute>
              <EditSupplierProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
