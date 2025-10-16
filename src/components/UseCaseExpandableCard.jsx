import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { useDarkMode } from "../contexts/DarkModeContext";

export default function UseCaseExpandableCard({ useCase }) {
  const [expanded, setExpanded] = useState(false);
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 hover:shadow-md transition-all`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{useCase.name}</h4>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{useCase.valueType} • {useCase.trust}-Trust</p>
        </div>
        <button
          className="text-xs text-blue-600 hover:underline"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Close details" : "View details →"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
        <div><p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>ROI</p><p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${useCase.roi.toLocaleString()}</p></div>
        <div><p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Opportunity</p><p className="font-semibold text-blue-600">+${useCase.opportunity.toLocaleString()}</p></div>
        <div><p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Lift</p><p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>+{useCase.lift}%</p></div>
      </div>

      <div className="h-28 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={useCase.series}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#F3F4F6"} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: isDarkMode ? "#9CA3AF" : "#6B7280" }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={{ 
              fontSize: 11, 
              background: isDarkMode ? '#374151' : 'white', 
              border: isDarkMode ? '1px solid #4B5563' : '1px solid #E5E7EB',
              color: isDarkMode ? '#F9FAFB' : '#111827'
            }} />
            <Line type="monotone" dataKey="ROI" stroke="#2563EB" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{useCase.description}</p>

      {expanded && (
        <div className={`mt-4 border-t pt-3 space-y-2 text-xs ${isDarkMode ? 'border-gray-700 text-gray-300' : 'border-gray-100 text-gray-700'}`}>
          <div className="grid grid-cols-3 gap-3">
            {useCase.impactMetrics.map((m) => (
              <div key={m.label} className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-md p-2`}>
                <p className={`text-[11px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{m.label}</p>
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{m.value}</p>
              </div>
            ))}
          </div>
          <p><strong>Benchmark vs Industry:</strong> {useCase.benchmarkDelta}</p>
          <p><strong>Next Action:</strong> {useCase.optimization}</p>
        </div>
      )}
    </div>
  );
}
