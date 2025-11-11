import React from "react";

const DishCard = ({ dish, onAdd }) => {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:scale-105 transition-transform duration-300">
      <img
        src={dish.image || "/logo.png"}
        alt={dish.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-green-400">{dish.name}</h3>
        <p className="text-gray-400 text-sm mt-1">{dish.description}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-green-400 font-bold">${dish.price}</span>
          <button
            onClick={() => onAdd(dish)}
            className="bg-green-400 text-gray-900 px-3 py-1 rounded-lg font-semibold hover:bg-green-500 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
