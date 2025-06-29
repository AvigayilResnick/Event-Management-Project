// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import BecomeSupplierRequest from "../components/BecomeSupplierRequest";
// import CategorySection from "../components/CategorySection"; // ✅ קומפוננטה חדשה
// import { getAllEvents, getAllCategories, getSuppliersForHome } from "../api/client";

// const Home = () => {
//   const [eventName, setEventName] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [groupedSuppliers, setGroupedSuppliers] = useState({});
//   const navigate = useNavigate();

//   // טען קטגוריות ואירועים
//   useEffect(() => {
//     getAllCategories().then((list) => {
//       const uniqueCategories = list.map((item) => item.category);
//       setCategories(uniqueCategories);
//     });
//     getAllEvents().then(setEvents);
//   }, []);

//   // שלוף 3–4 ספקים לכל קטגוריה
//   useEffect(() => {
//     if (!categories.length) return;

//     const loadInitialSuppliers = async () => {
//       const grouped = {};
//       for (const cat of categories) {
//         const suppliers = await getSuppliersForHome({
//           category: cat,
//           eventName: eventName || null,
//           limit: 4,
//           offset: 0,
//         });
//         grouped[cat] = suppliers;
//       }
//       setGroupedSuppliers(grouped);
//     };

//     loadInitialSuppliers();
//   }, [categories, eventName]);

//   const handleSearch = () => {
//     const params = new URLSearchParams();
//     if (eventName) params.set("eventName", eventName);
//     navigate(`/suppliers?${params.toString()}`);
//   };

//   const handleCategoryClick = (cat) => {
//     const params = new URLSearchParams();
//     if (eventName) params.set("eventName", eventName);
//     params.set("category", cat);
//     navigate(`/suppliers?${params.toString()}`);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-pink-50">
//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-pink-100 to-white py-16 px-4 text-center shadow-inner">
//         <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
//           Find the Perfect Vendor for Your Event
//         </h1>
//         <p className="text-lg text-gray-600 mb-6">
//           Select your event type and explore top-rated vendors.
//         </p>

//         <div className="flex flex-col items-center gap-4">
//           {!eventName && (
//             <select
//               value={eventName}
//               onChange={(e) => setEventName(e.target.value)}
//               className="p-4 border rounded-xl shadow-sm text-gray-700 w-full max-w-sm"
//             >
//               <option value="">Select event type</option>
//               {events.map((ev, idx) => (
//                 <option key={idx} value={ev}>{ev}</option>
//               ))}
//             </select>
//           )}

//           {eventName && (
//             <div className="flex items-center gap-4">
//               <div
//                 className="bg-pink-100 text-pink-800 px-4 py-2 rounded-full font-medium shadow cursor-pointer hover:bg-pink-200 transition"
//                 onClick={() => setEventName("")}
//               >
//                 {eventName} ✕
//               </div>
//             </div>
//           )}

//           <button
//             onClick={handleSearch}
//             className="bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl px-6 py-3 transition mt-2"
//             disabled={!eventName}
//           >
//             Search Vendors
//           </button>
//         </div>
//       </section>

//       {/* Category Sections */}
//       <section className="py-12 px-4 bg-white">
//         <div className="max-w-6xl mx-auto text-center mb-10">
//           <h2 className="text-2xl font-bold text-gray-800">
//             Browse Categories
//           </h2>
//           <p className="text-gray-600 mt-2">
//             Discover popular vendor categories that match your event type
//           </p>
//         </div>

//         <div className="max-w-6xl mx-auto">
//           {Object.entries(groupedSuppliers).map(([cat, suppliers]) => (
//             <CategorySection
//               key={cat}
//               category={cat}
//               suppliers={suppliers}
//               eventName={eventName}
//             />
//           ))}
//         </div>
//       </section>

//       {/* View All Vendors */}
//       <section className="text-center py-6">
//         <button
//           onClick={() => navigate("/suppliers")}
//           className="text-pink-600 hover:underline text-base"
//         >
//           ← View all vendors
//         </button>
//       </section>

//       {/* Become Supplier CTA */}
//       <section className="py-10 px-4">
//         <BecomeSupplierRequest />
//       </section>
//     </div>
//   );
// };

// export default Home;



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BecomeSupplierRequest from "../components/BecomeSupplierRequest";
import { getAllEvents, getAllCategories } from "../api/client";

const Home = () => {
  const [eventName, setEventName] = useState("");
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllCategories().then((list) => {
      setCategories(list.map((item) => item.category));
    });
    getAllEvents().then(setEvents);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (eventName) params.set("eventName", eventName);
    navigate(`/suppliers?${params.toString()}`);
  };

  const handleCategoryClick = (cat) => {
    const params = new URLSearchParams();
    if (eventName) params.set("eventName", eventName);
    params.set("category", cat);
    navigate(`/suppliers?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-100 to-white py-16 px-4 text-center shadow-inner">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
          Find the Perfect Vendor for Your Event
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Select your event type and explore top-rated vendors.
        </p>

        <div className="flex flex-col items-center gap-4">
          {!eventName && (
            <select
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="p-4 border rounded-xl shadow-sm text-gray-700 w-full max-w-sm"
            >
              <option value="">Select event type</option>
              {events.map((ev, idx) => (
                <option key={idx} value={ev}>{ev}</option>
              ))}
            </select>
          )}

          {eventName && (
            <div className="flex items-center gap-4">
              <div
                className="bg-pink-100 text-pink-800 px-4 py-2 rounded-full font-medium shadow cursor-pointer hover:bg-pink-200 transition"
                onClick={() => setEventName("")}
              >
                {eventName} ✕
              </div>
            </div>
          )}

          <button
            onClick={handleSearch}
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl px-6 py-3 transition mt-2"
            disabled={!eventName}
          >
            Search Vendors
          </button>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-800">
            Browse Categories
          </h2>
          <p className="text-gray-600 mt-2">
            Discover popular vendor categories that match your event type
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => handleCategoryClick(cat)}
              className="cursor-pointer border rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white hover:bg-pink-50"
            >
              <div className="h-28 bg-pink-100 flex items-center justify-center text-4xl">
                🎉
              </div>
              <div className="p-4 text-center text-gray-800 font-semibold">
                {cat}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* View All Vendors */}
      <section className="text-center py-6">
        <button
          onClick={() => navigate("/suppliers")}
          className="text-pink-600 hover:underline text-base"
        >
          ← View all vendors
        </button>
      </section>

      {/* Become Supplier CTA */}
      <section className="py-10 px-4">
        <BecomeSupplierRequest />
      </section>
    </div>
  );
};

export default Home;