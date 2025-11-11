// src/components/UI/Button.jsx
import React from "react";

const Button = ({ children, onClick, type = "button", className = "", disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-5 py-2 rounded-lg font-semibold transition-all duration-300
        bg-gradient-to-r from-green-400 via-blue-500 to-purple-600
        text-white hover:from-purple-600 hover:to-green-400
        shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
