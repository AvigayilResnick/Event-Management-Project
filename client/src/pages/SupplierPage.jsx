// SupplierPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { getSupplierFullDetails } from "../api/client"; // 🟢 שימוש בפונקציה הנכונה
import { sendMessage } from "../api/message";
import AuthModal from "../components/AuthModal";

const SupplierPage = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams(); // 🟢 מקבל את מזהה הספק מהכתובת
  const [supplier, setSupplier] = useState(null);
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(!user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSupplierFullDetails(id); // 🟢 קריאה לפונקציה שמביאה את פרטי הספק
        setSupplier(data);
      } catch (err) {
        console.error("Failed to load supplier", err);
      }
    };

    if (user) {
      fetchData();
    }
  }, [id, user]);

  const handleSendMessage = async () => {
    try {
      await sendMessage({
        fromUserId: user.id,
        toUserId: supplier.user_id,
        messageText: message,
      });
      alert("Message sent to supplier");
      setMessage("");
    } catch (err) {
      alert("Failed to send message");
    }
  };

  if (!user)
    return <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />;
  if (!supplier) return <div className="p-6">Loading supplier details...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-pink-600 mb-4">
        {supplier.business_name}
      </h1>
      <p className="text-gray-700 mb-2">Category: {supplier.category}</p>
      <p className="text-gray-700 mb-2">City: {supplier.city}</p>
      <p className="text-gray-700 mb-4">
        Price Range: {supplier.price_min} - {supplier.price_max} ₪
      </p>
      <p className="mb-6 text-gray-800">{supplier.description}</p>

      {supplier.images?.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {supplier.images.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Image ${i}`}
              className="rounded-xl w-full object-cover"
            />
          ))}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2">Contact the supplier:</h2>
      <textarea
        className="border rounded w-full p-2 mb-2"
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a message..."
      />
      <button
        onClick={handleSendMessage}
        className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
      >
        Send Message
      </button>
    </div>
  );
};

export default SupplierPage;
// This component displays detailed information about a specific supplier
// and allows users to send messages to the supplier if they are logged in.