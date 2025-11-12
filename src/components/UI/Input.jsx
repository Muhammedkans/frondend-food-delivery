// src/components/UI/Input.jsx
import React from "react";

const Input = ({ label, type = "text", value, onChange, placeholder = "", error = "" }) => {
  return (
    <div className="flex flex-col mb-4">
      {label && <label className="mb-1 font-medium text-white">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700
          focus:border-green-400 focus:ring-1 focus:ring-green-400 outline-none
          transition-all duration-200
        `}
      />
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
};

export default Input;
