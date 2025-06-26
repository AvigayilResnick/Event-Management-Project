import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { requestToBecomeSupplier } from "../api/roleRequests";

const BecomeSupplierRequest = () => {
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState("");

  const handleRequest = async () => {
    try {
      await requestToBecomeSupplier();
      setStatus("Request sent to the admin.");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message || "Unknown error";
      setStatus("Error sending request: " + errorMessage);
    }
  };

  if (!user || user.role !== "client") return null;

  return (
    <div className="text-center my-8">
      <p className="mb-2">Want to offer services as a supplier?</p>
      <button onClick={handleRequest} className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">
        Request to Become a Supplier
      </button>
      {status && <p className="mt-2 text-green-600">{status}</p>}
    </div>
  );
};

export default BecomeSupplierRequest;
