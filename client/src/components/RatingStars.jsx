import React, { useState, useEffect } from "react";
import { addRating, getSupplierRating } from "../api/ratings";

const RatingStars = ({ supplierId }) => {
  const [rating, setRating] = useState(0);        // מה שהמשתמש דירג
  const [hover, setHover] = useState(0);          // כשהעכבר עובר
  const [hasRated, setHasRated] = useState(false);
  const [average, setAverage] = useState(0);      // ממוצע כולל
  const [total, setTotal] = useState(0);          // מספר מדרגים

  // עם טעינת הקומפוננטה: שלוף ממוצע
  useEffect(() => {
    fetchStats();
  }, [supplierId]);

  const fetchStats = async () => {
    try {
      const data = await getSupplierRating(supplierId);
      setAverage(data.average);
      setTotal(data.total);
    } catch (err) {
      console.error("❌ Failed to fetch rating stats:", err.message);
    }
  };

  const handleRate = async (value) => {
    try {
      await addRating({ supplierId, rating: value });
      setRating(value);
      setHasRated(true);
      await fetchStats(); // ⬅️ מעדכן את הממוצע מיד
    } catch (err) {
      alert("You already rated this supplier.");
    }
  };

  return (
    <div className="mt-6">
      <p className="text-gray-800 font-medium mb-1">
        {hasRated ? "You rated this supplier:" : "Rate this supplier:"}
      </p>

      <div className="flex text-3xl text-yellow-500 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => !hasRated && handleRate(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="focus:outline-none"
          >
            {star <= (hover || rating) ? "★" : "☆"}
          </button>
        ))}
      </div>

      <div className="text-gray-600 text-sm">
       ⭐ {Number(average).toFixed(2)} / 5({total} {total === 1 ? "rating" : "ratings"})
      </div>
    </div>
  );
};

export default RatingStars;
// Usage example in SupplierPage.jsx
// <RatingStars supplierId={supplier.id} userId={user.id} />