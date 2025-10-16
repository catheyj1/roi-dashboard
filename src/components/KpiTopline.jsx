import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useDarkMode } from "../contexts/DarkModeContext";

export default function KpiTopline({ title, value, series, vsIndustryLabel, tone="info" }) {
  const { isDarkMode } = useDarkMode();
  
  const toneMap = {
    info: isDarkMode ? "bg-blue-900/30 border-blue-700" : "bg-blue-50 border-blue-200",
    success: isDarkMode ? "bg-green-900/30 border-green-700" : "bg-green-50 border-green-200",
    danger: isDarkMode ? "bg-red-900/30 border-red-700" : "bg-red-50 border-red-200"
  };
  return (
    <div className={`border ${toneMap[tone]} rounded-xl p-5`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
        <span className={`text-[11px] px-2 py-1 rounded-full border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white text-gray-600'}`}>
          {vsIndustryLabel}
        </span>
      </div>
      <div className="h-12 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series}>
            <XAxis dataKey="month" hide />
            <YAxis hide />
            <Tooltip contentStyle={{ 
              fontSize: 11, 
              background: isDarkMode ? '#374151' : 'white', 
              border: isDarkMode ? '1px solid #4B5563' : '1px solid #E5E7EB',
              color: isDarkMode ? '#F9FAFB' : '#111827'
            }} />
            <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
