import React, { useState } from "react";
import { roiUseCases } from "../data/roiUseCases";

const tones = {
  exceeding: "border-green-200 bg-green-50",
  improving: "border-blue-200 bg-blue-50",
  stable: "border-gray-200 bg-gray-50",
  underperforming: "border-amber-200 bg-amber-50"
};

export default function UseCaseCardGrid() {
  const [view, setView] = useState("ROI");

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Use Case Performance</h3>
        <div className="flex gap-2">
          {["ROI", "Optimization"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-xs px-2 py-1 rounded border ${
                view === v
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {roiUseCases.map((item) => (
          <button
            key={item.name}
            className={`text-left p-4 rounded-xl border ${tones[item.status]} hover:shadow-lg transition-transform hover:-translate-y-[2px]`}
            onClick={() => alert(`${item.name} selected — expand detail modal coming soon`)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
                <p className="text-xs text-gray-500 mb-1">{item.pillar}</p>
              </div>
              <span className="text-xs font-medium text-gray-600">
                {view === "ROI" ? `+$${(item.roi / 1000).toFixed(0)}K` : `+${item.lift}%`}
              </span>
            </div>
            <p className="text-[11px] text-gray-600 mt-2">{item.description}</p>
            {view === "Optimization" && (
              <div className="mt-3 text-xs text-blue-700 font-medium flex items-center gap-1">
                <span className="text-[13px]">⚙</span>
                <span>{item.opportunity > 0 ? `+$${(item.opportunity / 1000).toFixed(0)}K potential` : 'No additional opportunity'}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
