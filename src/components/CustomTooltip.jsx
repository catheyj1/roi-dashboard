import React from "react";

export default function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-3 text-xs text-gray-800">
      <p className="font-semibold text-gray-900 mb-1">{label}</p>
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
