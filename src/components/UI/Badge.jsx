// src/components/UI/Badge.jsx
import React from "react";

const Badge = ({ children, color = "green" }) => {
  const colors = {
    green: "bg-green-400 text-black",
    blue: "bg-blue-500 text-white",
    red: "bg-red-500 text-white",
    purple: "bg-purple-600 text-white",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-bold ${colors[color] || colors.green}`}
    >
      {children}
    </span>
  );
};

export default Badge;
