// src/context/DarkModeContext.js
import { createContext, useState, useContext } from "react";

// Create the context
export const DarkModeContext = createContext();

// Provider component
export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle theme (optional helper)
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Optional custom hook
export const useDarkMode = () => useContext(DarkModeContext);


