import React from "react";
import { useDarkMode } from "../contexts/DarkModeContext";

export default function TogglePill({ options, value, onChange }) {
  const { isDarkMode } = useDarkMode();
  
  return (
    <div className={`inline-flex rounded-full border p-0.5 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1 text-xs rounded-full ${
              active 
                ? "bg-blue-600 text-white" 
                : isDarkMode 
                  ? "text-gray-300 hover:bg-gray-700" 
                  : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
