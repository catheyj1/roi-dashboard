import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { toSparkMonths, palette } from "../data/mockData";

export default function OverviewCardComparative({ item, isOpen, onClick }) {
  // Build a single combined series for Recharts (required)
  const sparkData = useMemo(() => {
    const iris = toSparkMonths(item.iris90d);
    const industry = toSparkMonths(item.industry90d);
    const data = iris.map((p, i) => ({
      month: p.month,
      iris: p.value,
      industry: (industry[i]?.value ?? p.value) + 15 // Add offset for visual separation
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
    <motion.div layout className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">{item.title}</p>
          <p className="text-3xl font-bold text-gray-900">${item.value.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">
            Top Driver <span className="font-medium text-gray-900">{item.topDriver}</span>
          </p>
          <p className="text-sm text-gray-700 mt-2">{item.description}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-sm text-gray-500">{item.percent?.toFixed?.(1)}%</div>
          <div className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
            momChange >= 0 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {momChange >= 0 ? '+' : ''}{momChange}%
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-gray-600 mt-3">
        <span>Return Intelligence (Last 90 days)</span>
        <span>Industry Benchmark</span>
      </div>

      <div className="h-20 mt-2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <XAxis dataKey="month" hide />
            <YAxis hide />
            <Tooltip
              contentStyle={{ fontSize: 11, background: 'white', border: '1px solid #E5E7EB', borderRadius: '6px' }}
              formatter={(v, n) => [Math.round(v).toLocaleString(), n === "iris" ? "Return Intelligence" : "Industry Benchmark"]}
              labelStyle={{ fontSize: 10, color: '#6B7280' }}
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

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
        <span className="text-[11px] text-gray-600">{item.benchmark}</span>
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