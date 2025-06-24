import React from "react";
import { useNavigate } from "react-router-dom";

const SupplierCard = ({ supplier }) => {
  const { business_name, short_description, id } = supplier;
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/suppliers/${id}`);
  };

  return (
    <div className="bg-white bg-opacity-90 rounded-3xl shadow-lg p-6 mb-8 max-w-md mx-auto hover:shadow-2xl transition-shadow cursor-pointer font-serifRomantic">
      <h3 className="text-2xl font-semibold text-softPink mb-2">{business_name}</h3>
      <p className="text-gray-600 mb-4 italic line-clamp-3">
        {short_description?.trim() ? short_description : "אין תיאור זמין."}
      </p>

      <button
        onClick={handleViewDetails}
        className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
      >
        לצפייה בפרטים
      </button>
    </div>
  );
};

export default SupplierCard;
