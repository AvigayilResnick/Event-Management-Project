import React, { useEffect, useState } from 'react';
import RoleRequestCard from '../components/RoleRequestCard';
import {
  getAllRoleRequests,
  respondToRoleRequest
} from '../api/roleRequests'; // ✅ שימוש בקובץ API מוסדר

const RoleRequestsPage = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getAllRoleRequests();
        setRequests(data);
      } catch (error) {
        console.error('Failed to fetch role requests', error);
      }
    };

    fetchRequests();
  }, []);

  const handleDecision = async (id, status) => {
     console.log("STATUS SENT:", status);
    try {
      await respondToRoleRequest(id, status);
      // הסרה מהמסך אחרי אישור/דחייה
     

      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Failed to update request status', error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Supplier Role Requests</h1>
      {requests.length === 0 ? (
        <p className="text-gray-600">No pending requests.</p>
      ) : (
        requests.map((req) => (
          <RoleRequestCard
            key={req.id}
            request={req}
            onDecision={handleDecision}
          />
        ))
      )}
    </div>
  );
};

export default RoleRequestsPage;
