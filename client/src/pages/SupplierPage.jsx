import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { getSupplierProfile } from "../api/supplier";
import { sendMessage } from "../api/message";
import AuthModal from "../components/AuthModal";

const SupplierPage = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(!user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSupplierProfile(id);
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
      alert("הודעה נשלחה לספק");
      setMessage("");
    } catch (err) {
      alert("שגיאה בשליחת ההודעה");
    }
  };

  if (!user) return <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />;
  if (!supplier) return <div className="p-6">טוען פרטי ספק...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-pink-600 mb-4">{supplier.business_name}</h1>
      <p className="text-gray-700 mb-2">קטגוריה: {supplier.category}</p>
      <p className="text-gray-700 mb-2">עיר: {supplier.city}</p>
      <p className="text-gray-700 mb-4">מחירים: {supplier.price_min} - {supplier.price_max} ₪</p>
      <p className="mb-6 text-gray-800">{supplier.description}</p>

      <h2 className="text-xl font-semibold mb-2">צור קשר עם הספק:</h2>
      <textarea
        className="border rounded w-full p-2 mb-2"
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="כתוב הודעה..."
      />
      <button
        onClick={handleSendMessage}
        className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
      >
        שלח הודעה
      </button>
    </div>
  );
};

export default SupplierPage;
