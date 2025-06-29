import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../api/apiClient";
import { useNavigate, useParams } from "react-router-dom";

const EditSupplierPage = () => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDeleteImage = async (imageId) => {
    const confirmed = window.confirm("Are you sure you want to delete this image?");
    if (!confirmed) return;
    try {
      await apiClient.delete(`/suppliers/images/${imageId}`);
      setForm((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.id !== imageId),
      }));
    } catch (err) {
      alert("Failed to delete image");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get(`/suppliers/supplier-profile/${id}`);
        setForm({ ...res.data, newImages: [] });
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
      const formData = new FormData();
      formData.append("business_name", form.business_name);
      formData.append("category", form.category);
      formData.append("city", form.city);
      formData.append("price_min", form.price_min);
      formData.append("price_max", form.price_max);
      formData.append("description", form.description);

      // הוספת תמונות חדשות אם קיימות
      if (form.newImages && form.newImages.length > 0) {
        Array.from(form.newImages).forEach((file) => {
          formData.append("images", file);
        });
      }

      await apiClient.put(`/suppliers/supplier-profile/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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

        <div className="grid grid-cols-2 gap-4">
          {form.images?.map((img) => (
            <div key={img.id} className="relative">
              <img
                src={`http://localhost:5000/uploads/${img.url}`}
                alt="Supplier"
                className="rounded-xl w-full object-cover h-32"
              />
              <button
                type="button"
                onClick={() => handleDeleteImage(img.id)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                title="Delete image"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setForm({ ...form, newImages: e.target.files })}
          className="border p-2 rounded"
        />

        <button type="submit" className="bg-pink-500 text-white py-2 rounded hover:bg-pink-600">Save</button>
      </form>
    </div>
  );
};

export default EditSupplierPage;