import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { requestToBecomeSupplier } from "../api/client";

const BecomeSupplierRequest = () => {
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState("");

  const handleRequest = async () => {
    try {
      await requestToBecomeSupplier();
      setStatus("נשלח למנהל");
    } catch (err) {
      setStatus("שגיאה בשליחה");
    }
  };

  if (!user || user.role !== "client") return null;

  return (
    <div className="text-center my-8">
      <p className="mb-2">רוצה להציע שירותים כספק?</p>
      <button onClick={handleRequest} className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">
        בקש להיות ספק
      </button>
      {status && <p className="mt-2 text-green-600">{status}</p>}
    </div>
  );
};

export default BecomeSupplierRequest;
// This component allows clients to request to become suppliers.
// It checks if the user is a client and provides a button to send the request.