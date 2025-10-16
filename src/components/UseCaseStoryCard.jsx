import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function UseCaseStoryCard({ useCase }) {
  const [view, setView] = useState("ROI");

  const mockData = Array.from({ length: 12 }).map((_, i) => ({
    month: `M${i + 1}`,
    ROI: useCase.roi * (0.8 + Math.random() * 0.4),
    Volume: 1000 + i * 60 + Math.random() * 100,
    Lift: useCase.lift * (0.7 + Math.random() * 0.4)
  }));

  const colorMap = {
    Growth: "#16A34A",
    Protection: "#DC2626",
    Efficiency: "#2563EB"
  };

  return (
    <div className="metric-card">
      {/* HEADER */}
      <div className="card-header">
        <div>
          <h4 className="text-lg font-bold text-gray-900">{useCase.name}</h4>
          <p className="text-sm text-gray-500">{useCase.pillar} • {useCase.trust}-Trust Segment</p>
          <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full border bg-white text-gray-600">
            {useCase.valueType}
          </span>
        </div>
        <div className="flex gap-2">
          {["ROI", "Volume", "Lift"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-sm px-3 py-1.5 rounded-md font-medium transition-colors duration-200 ${
                view === v
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* METRICS + Benchmark */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div>
          <p className="metric-label">ROI</p>
          <p className="metric-value text-2xl">${useCase.roi.toLocaleString()}</p>
        </div>
        <div>
          <p className="metric-label">Opportunity</p>
          <p className="metric-value text-2xl text-blue-600">
            +${useCase.opportunity.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="metric-label">Lift</p>
          <p className="metric-value text-2xl">+{useCase.lift}%</p>
          <p className="text-[11px] text-gray-500 mt-0.5">{useCase.benchmarkDelta}</p>
        </div>
      </div>

      {/* CHART */}
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              formatter={(v) => [`${Math.round(v).toLocaleString()}`, view]}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                fontSize: "11px"
              }}
            />
            <Line
              type="monotone"
              dataKey={view}
              stroke={colorMap[useCase.pillar]}
              strokeWidth={2}
              dot={false}
              animationDuration={600}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* NARRATIVE */}
      <div className="text-sm text-gray-700 leading-snug">
        <p className="mb-2">{useCase.description}</p>
        <p>
          <span className="font-medium text-gray-900">IRIS Optimization:</span>{" "}
          {useCase.opportunity > 0 ? `+$${(useCase.opportunity / 1000).toFixed(0)}K potential` : 'No additional opportunity'}. This initiative could unlock{" "}
          <span className="font-semibold text-blue-700">
            +${(useCase.opportunity / 1000).toFixed(0)}K
          </span>{" "}
          in incremental ROI.
        </p>
      </div>

      {/* STATUS TAG */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div
          className={`status-indicator ${
            useCase.status === "exceeding"
              ? "status-exceeding"
              : useCase.status === "improving"
              ? "status-improving"
              : useCase.status === "underperforming"
              ? "status-underperforming"
              : "status-stable"
          }`}
        >
          {useCase.status === "exceeding"
            ? "Performing above target"
            : useCase.status === "improving"
            ? "Improving steadily"
            : useCase.status === "underperforming"
            ? "Requires tuning"
            : "Stable"}
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View details →
        </button>
      </div>
    </div>
  );
}
