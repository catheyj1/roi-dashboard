import React from "react";

export default function TogglePill({ options, value, onChange }) {
  return (
    <div className="inline-flex rounded-full border border-gray-200 bg-white p-0.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1 text-xs rounded-full ${active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-50"}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
