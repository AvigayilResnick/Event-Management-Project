import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";

const EditUserProfile = () => {
  const { user, login } = useContext(AuthContext);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get(`/users/myInfo`);
        setForm(res.data);
      } catch (err) {
        alert("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/users/myInfo`, form);
      alert("Profile updated");
      login({ ...user, ...form }, localStorage.getItem("token"));
      navigate("/profile");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        alert("Error updating profile");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4 text-pink-600 font-bold">Edit Profile</h2>
      {error && <div className="text-red-500 text-sm text-center mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="full_name" value={form.full_name} onChange={handleChange} className="border p-2 rounded" placeholder="Full Name" required />
        <input name="email" type="email" value={form.email} onChange={handleChange} className="border p-2 rounded" placeholder="Email" required />
        <input name="phone" value={form.phone || ""} onChange={handleChange} className="border p-2 rounded" placeholder="Phone" />
        <button type="submit" className="bg-pink-500 text-white py-2 rounded hover:bg-pink-600">Save</button>
      </form>
      <button
  onClick={() => navigate("/change-password")}
  type="button"
  className="text-sm text-pink-600 underline mt-2"
>
  Change Password
</button>

    </div>
  );
};

export default EditUserProfile;
