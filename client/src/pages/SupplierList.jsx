import React, { useEffect, useState, useRef, useMemo } from "react";
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
  const abortControllerRef = useRef(null);
  const initialLoadRef = useRef(true); // ✅ למניעת קריאה כפולה
  const limit = 6;

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
  const [debouncedFilters, setDebouncedFilters] = useState(defaultFilters);
  const [sliderValue, setSliderValue] = useState([
    defaultFilters.priceMin,
    defaultFilters.priceMax,
  ]);
  const [offset, setOffset] = useState(0);
  const lastElementRef = useRef();

  const debouncedUpdateFilters = useMemo(
    () =>
      debounce((newFilters) => {
        setDebouncedFilters((prev) => ({
          ...prev,
          ...newFilters,
        }));
      }, 400),
    []
  );

  const debouncedSetPriceRange = useRef(
    debounce(([min, max]) => {
      setFilters((prev) => ({
        ...prev,
        priceMin: min,
        priceMax: max,
      }));
      debouncedUpdateFilters({ priceMin: min, priceMax: max });
    }, 400)
  ).current;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    debouncedUpdateFilters({ [name]: value });
  };

  const handleDebouncedSearch = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    debouncedUpdateFilters({ [name]: value.trim().toLowerCase() });
  };

  const clearFilter = (key) => {
    const cleared = { ...filters, [key]: "" };
    setFilters(cleared);
    debouncedUpdateFilters({ [key]: "" });
  };

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
    initialLoadRef.current = true; // ✅ מאפשר ריסט חדש בעת שינוי פילטר
  }, [debouncedFilters]);

  useEffect(() => {
    if (!hasMore) return;

    // ✅ מניעת כפילות בטעינה הראשונה
    if (offset === 0 && initialLoadRef.current) {
      initialLoadRef.current = false;
    } else if (offset === 0) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    console.log("📤 Fetch suppliers", { debouncedFilters, offset });

    getAllSuppliers({ ...debouncedFilters, limit, offset }, controller.signal)
      .then((data) => {
        setSuppliers((prev) => {
          const ids = new Set(prev.map((s) => s.id));
          const newSuppliers = data.filter((s) => !ids.has(s.id));
          return [...prev, ...newSuppliers];
        });
        setHasMore(data.length === limit);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("❌ Fetch error:", err);
          setLoading(false);
        }
      });
  }, [offset, debouncedFilters]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    if (loading || suppliers.length < limit) return;

    const pageIsScrollable =
      document.documentElement.scrollHeight > window.innerHeight;
    if (!pageIsScrollable) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setOffset((prev) => prev + limit);
        }
      },
      { threshold: 1.0 }
    );

    if (lastElementRef.current) {
      observer.current.observe(lastElementRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, hasMore, suppliers.length]);

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
      <aside className="bg-white p-6 rounded-xl shadow sticky top-4 overflow-visible">
        <h3 className="text-lg font-semibold mb-4 text-pink-600">Filter Suppliers</h3>
        <form className="flex flex-col gap-4">
          <select name="eventName" value={filters.eventName} onChange={handleChange} className="p-2 border rounded">
            <option value="">All Event Types</option>
            {events.map((ev, idx) => (
              <option key={idx} value={ev}>{ev}</option>
            ))}
          </select>

          <input name="category" value={filters.category} onChange={handleChange} placeholder="Category" className="p-2 border rounded" />
          <input name="city" value={filters.city} onChange={handleChange} placeholder="City" className="p-2 border rounded" />

          <PriceRangeSlider
            min={0}
            max={maxPriceInDB}
            value={sliderValue}
            onChange={(newValue) => {
              setSliderValue(newValue);
              debouncedSetPriceRange(newValue);
            }}
          />

          <input name="search" value={filters.search} onChange={handleDebouncedSearch} placeholder="Search..." className="p-2 border rounded" />

          <select name="sortBy" value={filters.sortBy} onChange={handleChange} className="p-2 border rounded">
            <option value="price_min">Min Price</option>
            <option value="price_max">Max Price</option>
            <option value="business_name">Business Name</option>
            <option value="city">City</option>
            <option value="average_price">Average Price</option>
          </select>

          <select name="sortOrder" value={filters.sortOrder} onChange={handleChange} className="p-2 border rounded">
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
                <div key={key} className="bg-pink-100 text-pink-800 px-4 py-2 rounded-full shadow text-sm flex items-center gap-2">
                  <span>{key}: {value}</span>
                  <button onClick={() => clearFilter(key)} className="text-pink-600 hover:text-pink-900 font-bold">
                    ×
                  </button>
                </div>
              ) : null
            )}
            <button
              onClick={() => {
                const reset = {
                  eventName: "",
                  category: "",
                  city: "",
                  priceMin: 0,
                  priceMax: maxPriceInDB,
                  search: "",
                  sortBy: "price_min",
                  sortOrder: "asc",
                };
                setFilters(reset);
                setSliderValue([0, maxPriceInDB]);
                debouncedUpdateFilters(reset);
                setSearchParams({});
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
          <p className="text-center text-gray-500 mt-8">No matching suppliers found.</p>
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
