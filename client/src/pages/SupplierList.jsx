import React, { useEffect, useState, useRef } from "react";
import {
  getAllSuppliers,
  getAllEvents,
  getMaxSupplierPrice,
} from "../api/client";
import SupplierCard from "../components/SupplierCard";
import PriceRangeSlider from "../components/PriceRangeSlider";
import { useSearchParams } from "react-router-dom";
import { debounce } from "lodash";

const SupplierList = ({ preSelectedEvent = "" }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [maxPriceInDB, setMaxPriceInDB] = useState(10000);
  const [searchParams, setSearchParams] = useSearchParams();
  const observer = useRef();
  const limit = 3;

  const defaultFilters = {
    eventName: preSelectedEvent || searchParams.get("eventName") || "",
    category: searchParams.get("category") || "",
    city: searchParams.get("city") || "",
    priceMin: parseInt(searchParams.get("priceMin")) || 0,
    priceMax: parseInt(searchParams.get("priceMax")) || 10000,
    search: searchParams.get("search") || "",
    sortBy: searchParams.get("sortBy") || "price_min",
    sortOrder: searchParams.get("sortOrder") || "asc",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [sliderValue, setSliderValue] = useState([
    defaultFilters.priceMin,
    defaultFilters.priceMax,
  ]);
  const [offset, setOffset] = useState(0);
  const debounceTimer = useRef(null);
  const lastElementRef = useRef();

  const debouncedSetPriceRange = useRef(
    debounce(([min, max]) => {
      setFilters((prev) => ({
        ...prev,
        priceMin: min,
        priceMax: max,
      }));
    }, 400)
  ).current;

  useEffect(() => {
    getAllEvents().then((list) => {
      const unique = [...new Set(list)];
      setEvents(unique);
    });
  }, []);

  useEffect(() => {
    getMaxSupplierPrice()
      .then((data) => {
        const max = data.maxPrice || 10000;
        setMaxPriceInDB(max);
        setSliderValue((prev) => [
          prev[0],
          prev[1] > max ? max : prev[1],
        ]);
      })
      .catch(() => setMaxPriceInDB(10000));
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
        const ids = new Set(prev.map((s) => s.id));
        const newSuppliers = data.filter((s) => !ids.has(s.id));
        return [...prev, ...newSuppliers];
      });
      setHasMore(data.length === limit);
      setLoading(false);
    });
  }, [offset, filters]);

  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset((prev) => prev + limit);
      }
    });

    if (lastElementRef.current) observer.current.observe(lastElementRef.current);
  }, [loading, hasMore]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDebouncedSearch = (e) => {
    const { name, value } = e.target;
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }, 500);
  };

  const clearFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
      <aside className="bg-white p-6 rounded-xl shadow sticky top-4 overflow-visible">
        <h3 className="text-lg font-semibold mb-4 text-pink-600">Filter Suppliers</h3>
        <form className="flex flex-col gap-4">
          <select
            name="eventName"
            value={filters.eventName}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="">All Event Types</option>
            {events.map((ev, idx) => (
              <option key={idx} value={ev}>
                {ev}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="category"
            value={filters.category}
            onChange={handleChange}
            placeholder="Category"
            className="p-2 border rounded"
          />

          <input
            type="text"
            name="city"
            value={filters.city}
            onChange={handleChange}
            placeholder="City"
            className="p-2 border rounded"
          />

          <PriceRangeSlider
            min={0}
            max={maxPriceInDB}
            value={sliderValue}
            onChange={(newValue) => {
              setSliderValue(newValue);
              debouncedSetPriceRange(newValue);
            }}
          />

          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleDebouncedSearch}
            placeholder="Search..."
            className="p-2 border rounded"
          />

          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="price_min">Min Price</option>
            <option value="price_max">Max Price</option>
            <option value="business_name">Business Name</option>
            <option value="city">City</option>
            <option value="average_price">Average Price</option>
          </select>

          <select
            name="sortOrder"
            value={filters.sortOrder}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </form>
      </aside>

      <section className="lg:col-span-3">
        <h2 className="text-2xl font-bold text-pink-700 mb-4">
          {filters.eventName
            ? `Suppliers for: ${filters.eventName}`
            : filters.category
            ? `Suppliers in category: ${filters.category}`
            : "All Suppliers"}
        </h2>

        {Object.entries(filters).filter(([k, v]) => v).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(filters).map(([key, value]) =>
              value ? (
                <div
                  key={key}
                  className="bg-pink-100 text-pink-800 px-4 py-2 rounded-full shadow text-sm flex items-center gap-2"
                >
                  <span>{key}: {value}</span>
                  <button
                    onClick={() => clearFilter(key)}
                    className="text-pink-600 hover:text-pink-900 font-bold"
                  >
                    ×
                  </button>
                </div>
              ) : null
            )}
           <button
  onClick={() => {
    setFilters({
      eventName: "",
      category: "",
      city: "",
      priceMin: 0,
      priceMax: maxPriceInDB,
      search: "",
      sortBy: "price_min",
      sortOrder: "asc",
    });
    setSliderValue([0, maxPriceInDB]); // ✅ מאפס את הסליידר
    setSearchParams({}); // ✅ מוחק query מה-URL
  }}
  className="ml-4 text-sm text-gray-600 hover:underline"
>
  Clear All Filters
</button>

          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {suppliers.map((supplier, index) => (
            <SupplierCard key={`${supplier.id}-${index}`} supplier={supplier} />
          ))}
        </div>

        {!loading && suppliers.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No matching suppliers found.
          </p>
        )}

        <div ref={lastElementRef} />
        {loading && (
          <div className="text-center py-4 text-gray-500 animate-pulse">
            Loading more suppliers...
          </div>
        )}
      </section>
    </div>
  );
};

export default SupplierList;
