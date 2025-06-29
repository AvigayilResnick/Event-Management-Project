import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import {
  requestToBecomeSupplier,
  getRoleRequestStatus
} from "../api/roleRequests";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const BecomeSupplierRequest = () => {
  const { user, refreshAuthToken } = useContext(AuthContext);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getRoleRequestStatus();
        setStatus(data.status);
      } catch {
        setStatus(null);
      }
    };

    if (user?.role === "client") {
      fetchStatus();
    }
  }, [user]);

  if (!user || user.role !== "client") return null;

  const handleRequest = async () => {
    try {
      setLoading(true);
      await requestToBecomeSupplier();
      setStatus("pending");
    } catch (err) {
      alert("Error sending request");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await refreshAuthToken(); // מביא טוקן חדש עם תפקיד מעודכן
  };

  const renderStatus = () => {
    switch (status) {
      case "pending":
        return (
          <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-md text-yellow-800 max-w-md mx-auto text-center">
            <Clock size={24} />
            <p className="font-bold">Your request is under review</p>
            <p className="text-sm">We’ll notify you once it's approved.</p>
            <button
              onClick={handleRefresh}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              I'm approved? Refresh access
            </button>
          </div>
        );
      case "approved":
        return (
          <div className="bg-green-100 border border-green-300 p-4 rounded-md text-green-800 max-w-md mx-auto text-center">
            <CheckCircle size={24} />
            <p className="font-bold">You're now a supplier!</p>
            <p className="text-sm">Go to your dashboard to create your profile.</p>
          </div>
        );
      case "rejected":
        return (
          <div className="bg-red-100 border border-red-300 p-4 rounded-md text-red-800 max-w-md mx-auto text-center">
            <XCircle size={24} />
            <p className="font-bold">Request Rejected</p>
            <p className="text-sm">You may try again in the future.</p>
          </div>
        );
      default:
        return (
          <>
            <p className="mb-2 text-gray-700">
              Want to offer your services as a supplier?
            </p>
            <button
              onClick={handleRequest}
              disabled={loading}
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 disabled:opacity-50"
            >
              Request to Become a Supplier
            </button>
          </>
        );
    }
  };

  return (
    <div className="text-center my-8">{renderStatus()}</div>
  );
};

export default BecomeSupplierRequest;
