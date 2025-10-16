import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

export default function UseCaseExpandableCard({ useCase }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-base font-semibold text-gray-900">{useCase.name}</h4>
          <p className="text-xs text-gray-500">{useCase.valueType} • {useCase.trust}-Trust</p>
        </div>
        <button
          className="text-xs text-blue-600 hover:underline"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Close details" : "View details →"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
        <div><p className="text-gray-500">ROI</p><p className="font-semibold text-gray-900">${useCase.roi.toLocaleString()}</p></div>
        <div><p className="text-gray-500">Opportunity</p><p className="font-semibold text-blue-600">+${useCase.opportunity.toLocaleString()}</p></div>
        <div><p className="text-gray-500">Lift</p><p className="font-semibold text-gray-900">+{useCase.lift}%</p></div>
      </div>

      <div className="h-28 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={useCase.series}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="ROI" stroke="#2563EB" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm text-gray-700 mt-2">{useCase.description}</p>

      {expanded && (
        <div className="mt-4 border-t border-gray-100 pt-3 space-y-2 text-xs text-gray-700">
          <div className="grid grid-cols-3 gap-3">
            {useCase.impactMetrics.map((m) => (
              <div key={m.label} className="bg-gray-50 border border-gray-200 rounded-md p-2">
                <p className="text-[11px] text-gray-500">{m.label}</p>
                <p className="text-sm font-semibold text-gray-900">{m.value}</p>
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
