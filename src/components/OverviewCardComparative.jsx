import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useDarkMode } from "../contexts/DarkModeContext";
import { toSparkMonths, palette } from "../data/mockData";

export default function OverviewCardComparative({ item, isOpen, onClick }) {
  const { isDarkMode } = useDarkMode();
  
  // Build a single combined series for Recharts (required)
  const sparkData = useMemo(() => {
    const iris = toSparkMonths(item.iris90d);
    const industry = toSparkMonths(item.industry90d);
    const data = iris.map((p, i) => ({
      month: p.month,
      iris: p.value,
      industry: (industry[i]?.value ?? p.value) * 1.25 // Make industry 25% greater than IRIS
    }));
    return data;
  }, [item]);

  // Calculate month-over-month change for delta chip
  const momChange = useMemo(() => {
    if (sparkData.length < 2) return 0;
    const current = sparkData[sparkData.length - 1].iris;
    const previous = sparkData[sparkData.length - 2].iris;
    return Math.round(((current - previous) / previous) * 100);
  }, [sparkData]);

  return (
    <motion.div layout className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-5 hover:shadow-sm transition-all`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</p>
          <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${item.value.toLocaleString()}</p>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Top Driver <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.topDriver}</span>
          </p>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.description}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.percent?.toFixed?.(1)}%</div>
          <div className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
            momChange >= 0 
              ? isDarkMode 
                ? 'bg-green-900 text-green-300 border border-green-700' 
                : 'bg-green-50 text-green-700 border border-green-200'
              : isDarkMode
                ? 'bg-red-900 text-red-300 border border-red-700'
                : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {momChange >= 0 ? '+' : ''}{momChange}%
          </div>
        </div>
      </div>

      <div className={`flex items-center justify-between text-[11px] mt-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <span>Return Intelligence (Last 90 days)</span>
        <span>Industry Benchmark</span>
      </div>

      <div className="h-20 mt-2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <XAxis dataKey="month" hide />
            <YAxis hide />
            <Tooltip
              contentStyle={{ 
                fontSize: 11, 
                background: isDarkMode ? '#374151' : 'white', 
                border: isDarkMode ? '1px solid #4B5563' : '1px solid #E5E7EB', 
                borderRadius: '6px',
                color: isDarkMode ? '#F9FAFB' : '#111827'
              }}
              formatter={(v, n) => [Math.round(v).toLocaleString(), n === "iris" ? "Return Intelligence" : "Industry Benchmark"]}
              labelStyle={{ fontSize: 10, color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
            />
            {/* Simple IRIS line */}
            <Line 
              type="monotone" 
              dataKey="iris"
              stroke={palette.iris} 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: palette.iris }} 
            />
            {/* Simple industry line */}
            <Line 
              type="monotone" 
              dataKey="industry"
              stroke="#9CA3AF" 
              strokeWidth={1.5}
              strokeDasharray="3 2"
              dot={false}
              activeDot={{ r: 3, fill: "#9CA3AF" }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={`flex items-center justify-between mt-4 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <span className={`text-[11px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.benchmark}</span>
        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={onClick}
        >
          {isOpen ? "Close detailed breakdown" : "View detailed breakdown →"}
        </button>
      </div>
    </motion.div>
  );
}