import React from "react";
import { useDarkMode } from "../contexts/DarkModeContext";

export default function CustomTooltip({ active, payload, label }) {
  const { isDarkMode } = useDarkMode();
  
  if (!active || !payload || !payload.length) return null;
  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-800'} border shadow-sm rounded-lg p-3 text-xs`}>
      <p className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{label}</p>
      {payload.map((p)=>(
        <div key={p.dataKey} className="flex justify-between gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{background:p.fill}}></span>
            {p.name}
          </span>
          <span>${p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
