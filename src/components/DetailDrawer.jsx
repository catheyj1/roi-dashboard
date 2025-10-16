import React from "react";
import { useDarkMode } from "../contexts/DarkModeContext";

export default function DetailDrawer({ open, onClose, title, children }) {
  const { isDarkMode } = useDarkMode();
  
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className={`ml-auto h-full w-full max-w-lg shadow-2xl border-l p-5 overflow-y-auto ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
          <button onClick={onClose} className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}
