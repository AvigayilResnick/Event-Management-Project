import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

const SupplierDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchPages = async () => {
    try {
      const res = await apiClient.get("/suppliers/supplier-profile");
      setPages(res.data);
    } catch (err) {
      console.error("Failed to load supplier pages", err);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "supplier") {
      navigate("/");
    } else {
      fetchPages();
    }
  }, [user, navigate]);

  const handleOpenDeleteModal = (id) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/suppliers/supplier-profile/${selectedId}`);
      setModalOpen(false);
      setSelectedId(null);
      fetchPages();
    } catch (err) {
      alert("Error deleting page");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">Supplier Dashboard</h1>
      <div className="mb-6">
        <button
          onClick={() => navigate("/create-supplier")}
          className="bg-pink-500 text-white py-3 px-6 rounded-xl shadow hover:bg-pink-600"
        >
          ➕ Create New Page
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pages.length > 0 ? (
          pages.map((page) => (
            <div key={page.id} className="border rounded-lg p-4 shadow bg-white">
              <h3 className="text-lg font-bold text-pink-700 mb-2">{page.business_name}</h3>
              <p className="text-gray-600 mb-2">{page.description}</p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate(`/edit-supplier-page/${page.id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleOpenDeleteModal(page.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No pages found.</p>
        )}
      </div>

      {/* 🟥 Modal למחיקה */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this page? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierDashboard;
// This component is the Supplier Dashboard where suppliers can manage their pages.
// It allows them to create, edit, and delete their supplier pages.