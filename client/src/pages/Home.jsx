import React from "react";
import SupplierList from "../components/SupplierList";
import BecomeSupplierRequest from "../components/BecomeSupplierRequest";

const Home = () => {
  return (
    <div className="p-4">
      <section className="mb-10 text-center">
        <h2 className="text-4xl font-serifRomantic mb-2 text-pink-600">
          ספקים שיגרמו לאירוע שלך לזרוח ✨
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          כאן תוכל למצוא את מיטב הספקים לחתונה, בר מצווה, אירוע עסקי או כל חגיגה אחרת!
        </p>
      </section>

      <BecomeSupplierRequest />

      <section className="mt-10">
        <SupplierList />
      </section>
    </div>
  );
};

export default Home;
// This Home component serves as the main landing page for the application.
// It includes a welcome message, a section for suppliers to request to become suppliers, and a list of available suppliers.