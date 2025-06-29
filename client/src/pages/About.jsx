import React from "react";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-pink-600 mb-6 text-center">Who Are We?</h1>

      <p className="text-gray-800 text-lg leading-relaxed mb-6">
        Our website was built to help you find event suppliers of all kinds – easily, quickly, and efficiently.
        Whether you're planning a wedding, bar mitzvah, corporate event, or private party – we're here to connect you with the right people.
      </p>

      <p className="text-gray-800 text-lg leading-relaxed mb-6">
        Our suppliers are carefully verified. We display transparent information, prices, reviews, and allow direct contact.
      </p>

      <p className="text-gray-800 text-lg leading-relaxed mb-6">
        Our service is completely free for users. Suppliers can join and receive inquiries from real clients.
        We believe in ease of use, transparency, and a great user experience.
      </p>

      <div className="mt-10 text-center">
        <span className="text-sm text-gray-500">
          Version 1.0 – The site is under continuous development
        </span>
      </div>
    </div>
  );
};

export default About;
