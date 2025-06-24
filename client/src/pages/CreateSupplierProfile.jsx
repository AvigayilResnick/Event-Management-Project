import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

const CreateSupplierProfile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    business_name: "",
    category: "",
    description: "",
    city: "",
    price_min: "",
    price_max: "",
    images: [],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in form) {
      if (key === "images") {
        Array.from(form.images).forEach((file) => data.append("images", file));
      } else {
        data.append(key, form[key]);
      }
    }

    try {
      await apiClient.post("/suppliers/supplier-profile", data);
      alert("פרופיל ספק נוצר בהצלחה");
      navigate("/");
    } catch (err) {
      alert("שגיאה ביצירת פרופיל ספק");
    }
  };

  if (!user || user.role !== "supplier") return <div>אין לך גישה לדף זה</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-pink-600 mb-4">צור פרופיל ספק</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="business_name" placeholder="שם העסק" className="border p-2 rounded" onChange={handleChange} required />
        <input name="category" placeholder="קטגוריה" className="border p-2 rounded" onChange={handleChange} required />
        <input name="city" placeholder="עיר" className="border p-2 rounded" onChange={handleChange} required />
        <input name="price_min" type="number" placeholder="מחיר מינימלי" className="border p-2 rounded" onChange={handleChange} required />
        <input name="price_max" type="number" placeholder="מחיר מקסימלי" className="border p-2 rounded" onChange={handleChange} required />
        <textarea name="description" placeholder="תיאור" className="border p-2 rounded" rows={4} onChange={handleChange} required />
        <input type="file" multiple onChange={handleFileChange} />
        <button type="submit" className="bg-pink-500 text-white py-2 rounded hover:bg-pink-600">שמור</button>
      </form>
    </div>
  );
};

export default CreateSupplierProfile;
// This component allows suppliers to create their profile with necessary details.
// It includes fields for business name, category, city, price range, description, and image uploads.