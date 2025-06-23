import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(!user);

  if (!user) {
    return <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />;
  }

  return children;
};

export default ProtectedRoute;
// This component checks if the user is authenticated.
// If not, it shows the authentication modal. Otherwise, it renders the children components.