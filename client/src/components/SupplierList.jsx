import React, { useEffect, useState, useRef } from "react";
import { getAllSuppliers, getAllEvents } from "../api/client";
import SupplierCard from "./SupplierCard";
import { useSearchParams } from "react-router-dom";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const observer = useRef();
  const limit = 12;

  const defaultFilters = {
    eventName: searchParams.get("eventName") || "",
    city: searchParams.get("city") || "",
    priceMin: searchParams.get("priceMin") || "",
    priceMax: searchParams.get("priceMax") || "",
    search: searchParams.get("search") || "",
    sortBy: searchParams.get("sortBy") || "price_min",
    sortOrder: searchParams.get("sortOrder") || "asc",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [offset, setOffset] = useState(0);
  const debounceTimer = useRef(null);
  const lastElementRef = useRef();

  useEffect(() => {
    getAllEvents().then((list) => {
      const unique = [...new Set(list)];
      setEvents(unique);
    });
  }, []);

  useEffect(() => {
    setSearchParams(filters);
  }, [filters, setSearchParams]);

  useEffect(() => {
    setSuppliers([]);
    setOffset(0);
    setHasMore(true);
  }, [filters]);

  useEffect(() => {
    if (!hasMore) return;
    setLoading(true);
    getAllSuppliers({ ...filters, limit, offset }).then((data) => {
      setSuppliers((prev) => {
        const ids = new Set(prev.map(s => s.id));
        const newSuppliers = data.filter(s => !ids.has(s.id));
        return [...prev, ...newSuppliers];
      });
      setHasMore(data.length === limit);
      setLoading(false);
    });
  }, [offset, filters]);

  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset(prev => prev + limit);
      }
    });

    if (lastElementRef.current) observer.current.observe(lastElementRef.current);
  }, [loading, hasMore]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDebouncedSearch = (e) => {
    const { name, value } = e.target;
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, [name]: value }));
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 bg-gray-100 p-4 rounded-xl">
        <select name="eventName" value={filters.eventName} onChange={handleChange} className="p-2 border rounded">
          <option value="">All Events</option>
          {events.map((ev, idx) => (
            <option key={idx} value={ev}>{ev}</option>
          ))}
        </select>

        <input
          type="text"
          name="city"
          value={filters.city}
          onChange={handleChange}
          placeholder="City"
          className="p-2 border rounded"
        />

        <input
          type="number"
          name="priceMin"
          value={filters.priceMin}
          onChange={handleChange}
          placeholder="Min Price"
          className="p-2 border rounded"
        />

        <input
          type="number"
          name="priceMax"
          value={filters.priceMax}
          onChange={handleChange}
          placeholder="Max Price"
          className="p-2 border rounded"
        />

        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleDebouncedSearch}
          placeholder="Search..."
          className="p-2 border rounded"
        />

        <select name="sortBy" value={filters.sortBy} onChange={handleChange} className="p-2 border rounded">
          <option value="price_min">Price Min</option>
          <option value="price_max">Price Max</option>
          <option value="business_name">Business Name</option>
          <option value="city">City</option>
          <option value="average_price">Average Price</option>
        </select>

        <select name="sortOrder" value={filters.sortOrder} onChange={handleChange} className="p-2 border rounded">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier, index) => (
          <SupplierCard key={`${supplier.id}-${index}`} supplier={supplier} />
        ))}
      </div>

      {!loading && suppliers.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No suppliers found.</p>
      )}

      <div ref={lastElementRef} />
      {loading && <p className="text-center py-4">Loading...</p>}
    </div>
  );
};

export default SupplierList;
