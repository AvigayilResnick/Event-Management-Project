import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";

const EditSupplierProfile = () => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get(`/supplier/profile/${user.id}`);
        setForm(res.data);
      } catch (err) {
        alert("שגיאה בטעינת פרופיל ספק");
      }
    };

    if (user.role === "supplier") {
      fetchData();
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/supplier/profile`, form);
      alert("פרופיל ספק עודכן");
      navigate("/");
    } catch (err) {
      alert("שגיאה בעדכון");
    }
  };

  if (!form) return <div>טוען...</div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4 text-pink-600 font-bold">עריכת פרופיל ספק</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="business_name" value={form.business_name} onChange={handleChange} className="border p-2 rounded" placeholder="שם עסק" />
        <input name="category" value={form.category} onChange={handleChange} className="border p-2 rounded" placeholder="קטגוריה" />
        <input name="city" value={form.city} onChange={handleChange} className="border p-2 rounded" placeholder="עיר" />
        <input name="price_min" value={form.price_min} onChange={handleChange} className="border p-2 rounded" placeholder="מחיר מינימלי" />
        <input name="price_max" value={form.price_max} onChange={handleChange} className="border p-2 rounded" placeholder="מחיר מקסימלי" />
        <textarea name="description" value={form.description} onChange={handleChange} className="border p-2 rounded" rows={4} placeholder="תיאור" />
        <button type="submit" className="bg-pink-500 text-white py-2 rounded hover:bg-pink-600">שמור</button>
      </form>
    </div>
  );
};

export default EditSupplierProfile;
//     </form>
//   );