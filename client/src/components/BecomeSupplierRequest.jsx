import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import {
  requestToBecomeSupplier,
  getMyRoleRequest
} from "../api/roleRequests";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const BecomeSupplierRequest = () => {
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState(null); // 'pending' | 'approved' | 'rejected' | null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequestStatus = async () => {
      try {
        const data = await getMyRoleRequest();
        setStatus(data.status);
      } catch (err) {
        setStatus(null); // אין בקשה קיימת
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "client") {
      fetchRequestStatus();
    } else {
      setLoading(false); // אם זה ספק, אין טעם לבדוק
    }
  }, [user]);

  const handleRequest = async () => {
    try {
      await requestToBecomeSupplier();
      setStatus("pending");
    } catch (err) {
      alert("Error sending request");
    }
  };

  if (!user || user.role !== "client") return null;

  const renderStatus = () => {
  switch (status) {
    case "pending":
      return (
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg bg-yellow-50 text-yellow-900 border border-yellow-200 max-w-md mx-auto">
          <Clock size={24} />
          <p className="font-semibold">Your request is under review</p>
          <p className="text-sm text-center">
            Thank you! Your request to become a supplier has been received. We’ll notify you once it’s reviewed.
          </p>
        </div>
      );

    case "approved":
      return (
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-50 text-green-900 border border-green-200 max-w-md mx-auto">
          <CheckCircle size={24} />
          <p className="font-semibold">Congratulations!</p>
          <p className="text-sm text-center">
            Your supplier request has been approved. You can now publish your services on the platform.
          </p>
        </div>
      );

    case "rejected":
      return (
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-900 border border-red-200 max-w-md mx-auto">
          <XCircle size={24} />
          <p className="font-semibold">Request not approved</p>
          <p className="text-sm text-center">
            Unfortunately, your request to become a supplier was not approved. You're welcome to try again in the future.
          </p>
        </div>
      );

    default:
      return (
        <>
          <p className="mb-2 text-gray-700">Want to offer your services as a supplier?</p>
          <button
            onClick={handleRequest}
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
          >
            Request to Become a Supplier
          </button>
        </>
      );
  }
};

  return (
    <div className="text-center my-8">
      {loading ? <p>Loading...</p> : renderStatus()}
    </div>
  );
};

export default BecomeSupplierRequest;
