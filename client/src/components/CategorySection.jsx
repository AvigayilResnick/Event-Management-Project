import React from "react";
import SupplierCard from "./SupplierCard";
import { useNavigate } from "react-router-dom";

const CategorySection = ({ category, suppliers, eventName }) => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    const params = new URLSearchParams();
    params.set("category", category);
    if (eventName) params.set("eventName", eventName);
    navigate(`/suppliers?${params.toString()}`);
  };

  return (
    <div className="mb-10">
      <h3 className="text-xl font-bold text-pink-700 mb-4">{category}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>

      {suppliers.length > 0 && (
        <div className="mt-2 text-right">
          <button
            onClick={handleViewAll}
            className="text-blue-600 text-sm hover:underline"
          >
            View All →
          </button>
        </div>
      )}
    </div>
  );
};

export default CategorySection;