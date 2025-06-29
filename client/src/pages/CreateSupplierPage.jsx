import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { createSupplierPage } from "../api/supplier";
import { getAllEvents, getAllCategories } from "../api/client";

const CreateSupplierPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    business_name: "",
    category: "",
    custom_category: "",
    description: "",
    city: "",
    price_min: "",
    price_max: "",
    images: [],
    event_types: [],
    custom_event: "",
  });

  const [allCategories, setAllCategories] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await getAllCategories();
        const events = await getAllEvents();
        setAllCategories(categories);
        setAllEvents(events);
      } catch (err) {
        console.error("Failed to load categories/events", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, images: e.target.files });
  };

  const handleEventSelect = (e) => {
    const value = e.target.value;
    if (!value || form.event_types.includes(value)) return;
    setForm({ ...form, event_types: [...form.event_types, value] });
  };

  const handleRemoveEvent = (value) => {
    setForm({ ...form, event_types: form.event_types.filter(e => e !== value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    const categoryToSend = form.category === "__new__" ? form.custom_category : form.category;
    const eventsToSend = [...form.event_types];
    if (form.custom_event.trim()) eventsToSend.push(form.custom_event.trim());

    data.append("business_name", form.business_name);
    data.append("category", categoryToSend);
    data.append("description", form.description);
    data.append("city", form.city);
    data.append("price_min", form.price_min);
    data.append("price_max", form.price_max);
    data.append("event_types", JSON.stringify(eventsToSend));

    Array.from(form.images).forEach((file) => {
      data.append("images", file);
    });

    try {
      await createSupplierPage(data);
      alert("Page created successfully");
      navigate("/supplier-dashboard"); // ⬅️ חזרנו לניווט המקורי
    } catch (err) {
      console.error(err);
      alert("Error creating page");
    }
  };

  
  if (!user) return <Navigate to="/" />;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-pink-600 mb-4">Create Supplier Page</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="business_name"
          placeholder="Business Name"
          className="border p-2 rounded"
          onChange={handleChange}
          required
        />

        <select
          name="category"
          className="border p-2 rounded"
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {allCategories.map((cat) => (
            <option key={cat.category} value={cat.category}>
              {cat.category}
            </option>
          ))}
          <option value="__new__">Other...</option>
        </select>

        {form.category === "__new__" && (
          <input
            name="custom_category"
            placeholder="Enter new category"
            className="border p-2 rounded"
            onChange={handleChange}
            required
          />
        )}

        <input
          name="city"
          placeholder="City"
          className="border p-2 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="price_min"
          type="number"
          placeholder="Minimum Price"
          className="border p-2 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="price_max"
          type="number"
          placeholder="Maximum Price"
          className="border p-2 rounded"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          className="border p-2 rounded"
          rows={4}
          onChange={handleChange}
          required
        />

        <select onChange={handleEventSelect} className="border p-2 rounded">
          <option value="">Add Event Type</option>
          {allEvents.map((event) => (
            <option key={event} value={event}>
              {event}
            </option>
          ))}
        </select>

        {form.event_types.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.event_types.map((e) => (
              <span key={e} className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-sm">
                {e}
                <button
                  type="button"
                  onClick={() => handleRemoveEvent(e)}
                  className="ml-1 text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <input
          name="custom_event"
          placeholder="Add custom event (optional)"
          className="border p-2 rounded"
          onChange={handleChange}
        />

        <input type="file" multiple onChange={handleFileChange} />

        <button
          type="submit"
          className="bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default CreateSupplierPage;
