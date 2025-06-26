import React from "react";
import { useNavigate } from "react-router-dom";

const SupplierCard = ({ supplier }) => {
  const { business_name, short_description, id } = supplier;
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/suppliers/${id}`);
  };

  return (
    <div
      className="flex flex-col justify-between bg-white bg-opacity-90 rounded-3xl shadow-lg p-4 sm:p-6 hover:shadow-2xl transition-shadow cursor-pointer font-serifRomantic
      min-h-[280px] sm:min-h-[320px] lg:min-h-[360px]"
    >
      <div>
        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-softPink mb-2">
          {business_name}
        </h3>
        <p className="text-gray-600 mb-4 italic line-clamp-3 text-sm sm:text-base">
          {short_description?.trim() ? short_description : "No description available."}
        </p>
      </div>

      <button
        onClick={handleViewDetails}
        className="bg-pink-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-pink-600 text-sm sm:text-base"
      >
        View Details
      </button>
    </div>
  );
};

export default SupplierCard;
