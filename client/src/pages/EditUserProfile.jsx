import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";

const EditUserProfile = () => {
  const { user, login } = useContext(AuthContext);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get(`/users/${user.id}`);
        setForm(res.data);
      } catch (err) {
        alert("שגיאה בטעינת הנתונים");
      }
    };
    fetchProfile();
  }, [user.id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/users/${user.id}`, form);
      alert("הפרופיל עודכן");
      login({ ...user, ...form }, localStorage.getItem("token")); // לעדכן ב-context
      navigate("/");
    } catch {
      alert("שגיאה בעדכון הפרופיל");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4 text-pink-600 font-bold">עריכת פרופיל</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="full_name" value={form.full_name} onChange={handleChange} className="border p-2 rounded" placeholder="שם מלא" />
        <input name="email" value={form.email} onChange={handleChange} className="border p-2 rounded" placeholder="אימייל" />
        <input name="phone" value={form.phone || ""} onChange={handleChange} className="border p-2 rounded" placeholder="טלפון" />
        <button type="submit" className="bg-pink-500 text-white py-2 rounded hover:bg-pink-600">שמור</button>
      </form>
    </div>
  );
};

export default EditUserProfile;
