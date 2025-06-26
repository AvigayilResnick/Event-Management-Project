import React from "react";
import { Range } from "react-range";

const PriceRangeSlider = ({ min, max, value, onChange }) => {
  return (
    <div className="w-full relative z-10 py-6">
      <label className="font-semibold block mb-2 mt-6">Price Range (₪)</label>

      <Range
        step={100}
        min={min}
        max={max}
        values={value}
        onChange={onChange}
        renderTrack={({ props, children }) => {
          const { key, ...rest } = props;
          const [minVal, maxVal] = value;

          return (
            <div
              key={key}
              {...rest}
              style={{
                ...rest.style,
                height: "6px",
                background: `linear-gradient(to right, 
                  #e5e7eb 0%, 
                  #e5e7eb ${(minVal - min) / (max - min) * 100}%,
                  #ec4899 ${(minVal - min) / (max - min) * 100}%,
                  #ec4899 ${(maxVal - min) / (max - min) * 100}%,
                  #e5e7eb ${(maxVal - min) / (max - min) * 100}%,
                  #e5e7eb 100%)`,
                borderRadius: "4px",
                margin: "24px 0",
                position: "relative",
              }}
            >
              {children}
            </div>
          );
        }}
        renderThumb={({ props, index }) => {
          const { key, ...rest } = props;
          const isMin = index === 0;

          return (
            <div
              key={key}
              {...rest}
              style={{
                ...rest.style,
                height: "16px",
                width: "16px",
                borderRadius: "50%",
                backgroundColor: "#ec4899",
                boxShadow: "0 0 0 2px white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: isMin ? "24px" : "-45px", // 👈 למעלה או למטה בהתאם ל-index
                  backgroundColor: "rgba(236, 72, 153, 0.1)",
                  color: "#ec4899",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "500",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  whiteSpace: "nowrap",
                }}
              >
                {value[index]} ₪
              </div>
            </div>
          );
        }}

      />
    </div>
  );
};

export default PriceRangeSlider;
