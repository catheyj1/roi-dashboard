import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function RoiInteractiveBreakdown() {
  const [view, setView] = useState("Method");

  const byMethod = [
    { category: "Boxless", value: 75000 },
    { category: "KTI", value: 95000 },
    { category: "Gift Card", value: 90000 },
    { category: "Early Refund", value: 175000 }
  ];
  const byTrust = [
    { category: "High", value: 225000 },
    { category: "Medium", value: 145000 },
    { category: "Low", value: 200000 }
  ];
  const byChannel = [
    { category: "Online Returns", value: 280000 },
    { category: "In-Store Returns", value: 210000 },
    { category: "Carrier Drop-off", value: 100000 }
  ];

  const views = { Method: byMethod, "Trust Tier": byTrust, Channel: byChannel };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">ROI Breakdown</h3>
        <div className="flex gap-2">
          {Object.keys(views).map((key) => (
            <button
              key={key}
              className={`text-xs px-2 py-1 rounded border ${
                view === key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
              onClick={() => setView(key)}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={views[view]}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey="category"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#6B7280" }}
          />
          <YAxis
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#6B7280" }}
          />
          <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, "ROI"]} />
          <Bar
            dataKey="value"
            fill="#3B82F6"
            radius={[6, 6, 0, 0]}
            barSize={30}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
