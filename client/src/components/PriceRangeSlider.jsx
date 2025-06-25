import React from "react";
import { Range } from "react-range";

const PriceRangeSlider = ({ min, max, value, onChange }) => {
  return (
    <div className="w-full relative z-10 py-6">
      <label className="font-semibold block mb-2">Price Range (₪)</label>
      <Range
        step={100}
        min={min}
        max={max}
        values={value}
        onChange={onChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: "6px",
              backgroundColor: "#e5e7eb",
              borderRadius: "4px",
              margin: "24px 0",
              position: "relative",
              zIndex: 1,
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: "16px",
              width: "16px",
              borderRadius: "50%",
              backgroundColor: "#ec4899",
              boxShadow: "0 0 0 2px white",
              zIndex: 2,
            }}
          />
        )}
      />
      <div className="flex justify-between text-sm mt-2 text-gray-700">
        <span>{value[0]} ₪</span>
        <span>{value[1]} ₪</span>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
