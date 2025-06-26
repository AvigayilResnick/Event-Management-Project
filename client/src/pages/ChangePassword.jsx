import React, { useState } from "react";
import { changeUserPassword } from "../api/user";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await changeUserPassword(form);
      setSuccess("Password updated successfully");
      setForm({ currentPassword: "", newPassword: "" });
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-6">
      <h2 className="text-2xl font-bold text-pink-600 mb-4">Change Password</h2>
      {error && <div className="text-red-500 text-sm mb-2 text-center">{error}</div>}
      {success && <div className="text-green-600 text-sm mb-2 text-center">{success}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="Current Password"
          required
        />
        <input
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="New Password"
          required
        />
        <button type="submit" className="bg-pink-500 text-white py-2 rounded hover:bg-pink-600">
          Save
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
// This component allows users to change their password.
// It includes form validation and error handling, and redirects to the profile page upon success.