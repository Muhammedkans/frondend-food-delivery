// src/components/UI/Loader.jsx
import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="w-12 h-12 border-4 border-t-green-400 border-r-blue-500 border-b-purple-500 border-l-gray-700 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
