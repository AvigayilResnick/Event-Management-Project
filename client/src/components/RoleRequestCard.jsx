// src/components/RoleRequestCard.jsx
import React from 'react';

const RoleRequestCard = ({ request, onDecision }) => {
  return (
    <div className="border p-4 rounded shadow-sm mb-4">
      <p><strong>Name:</strong> {request.full_name}</p>
      <p><strong>Email:</strong> {request.email}</p>
      <p><strong>Phone:</strong> {request.phone}</p>
      <div className="mt-3 flex gap-3">
        <button
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          onClick={() => onDecision(request.id, 'approved')}
        >
          Approve
        </button>
        <button
          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
          onClick={() => onDecision(request.id, 'rejected')}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default RoleRequestCard;
