import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../api/apiClient";
import { useNavigate, useParams } from "react-router-dom";

const EditSupplierPage = () => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get(`/suppliers/supplier-profile/${id}`);
        setForm(res.data);
      } catch (err) {
        alert("Error loading page");
      }
    };

    if (user.role === "supplier") {
      fetchData();
    }
  }, [user, id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/suppliers/supplier-profile/${id}`, form);
      alert("Page updated successfully");
      navigate("/supplier-dashboard");
    } catch (err) {
      alert("Error updating page");
    }
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4 text-pink-600 font-bold">Edit Supplier Page</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="business_name" value={form.business_name} onChange={handleChange} className="border p-2 rounded" placeholder="Business Name" />
        <input name="category" value={form.category} onChange={handleChange} className="border p-2 rounded" placeholder="Category" />
        <input name="city" value={form.city} onChange={handleChange} className="border p-2 rounded" placeholder="City" />
        <input name="price_min" value={form.price_min} onChange={handleChange} className="border p-2 rounded" placeholder="Minimum Price" />
        <input name="price_max" value={form.price_max} onChange={handleChange} className="border p-2 rounded" placeholder="Maximum Price" />
        <textarea name="description" value={form.description} onChange={handleChange} className="border p-2 rounded" rows={4} placeholder="Description" />
        <button type="submit" className="bg-pink-500 text-white py-2 rounded hover:bg-pink-600">Save</button>
      </form>
    </div>
  );
};

export default EditSupplierPage;
//       <ProtectedRoute>
//               <EditSupplierPage />