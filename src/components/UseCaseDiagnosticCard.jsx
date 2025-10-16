import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function UseCaseDiagnosticCard({ useCase }) {
  const [view, setView] = useState("ROI");

  // Mock time-series data
  const timeline = Array.from({ length: 12 }).map((_, i) => ({
    month: `M${i + 1}`,
    roi: useCase.roi * (0.8 + Math.random() * 0.4),
    volume: 1000 + i * 80 + Math.random() * 100,
    lift: useCase.lift * (0.8 + Math.random() * 0.4)
  }));

  const color =
    useCase.status === "exceeding"
      ? "#16A34A"
      : useCase.status === "improving"
      ? "#2563EB"
      : useCase.status === "stable"
      ? "#6B7280"
      : "#EAB308";

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-300 flex flex-col justify-between`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">{useCase.name}</h4>
          <p className="text-xs text-gray-500">{useCase.pillar}</p>
        </div>
        <div className="flex gap-1">
          {["ROI", "Volume", "Lift"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-[10px] px-2 py-0.5 rounded border ${
                view === v
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Summary */}
      <div className="flex justify-between text-xs mb-2">
        <span className="text-gray-600">ROI:</span>
        <span className="font-semibold text-gray-900">
          ${useCase.roi.toLocaleString()}
        </span>
      </div>

      {/* Chart */}
      <div className="h-20 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeline}>
            <XAxis dataKey="month" hide />
            <YAxis hide />
            <Tooltip
              formatter={(v) => [`$${Math.round(v).toLocaleString()}`, view]}
              contentStyle={{
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px"
              }}
            />
            <Line
              type="monotone"
              dataKey={view.toLowerCase()}
              stroke={color}
              strokeWidth={2}
              dot={false}
              animationDuration={700}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Optimization Info */}
      <div className="text-xs text-gray-700">
        ⚙ {useCase.opportunity > 0 ? `+$${(useCase.opportunity / 1000).toFixed(0)}K opportunity` : 'No additional opportunity'}
        <span className="ml-1 text-gray-500">
          ({useCase.status})
        </span>
      </div>
    </div>
  );
}
