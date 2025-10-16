import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function KpiTopline({ title, value, series, vsIndustryLabel, tone="info" }) {
  const toneMap = {
    info: "bg-blue-50 border-blue-200",
    success: "bg-green-50 border-green-200",
    danger: "bg-red-50 border-red-200"
  };
  return (
    <div className={`border ${toneMap[tone]} rounded-xl p-5`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <span className="text-[11px] px-2 py-1 rounded-full bg-white border text-gray-600">
          {vsIndustryLabel}
        </span>
      </div>
      <div className="h-12 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series}>
            <XAxis dataKey="month" hide />
            <YAxis hide />
            <Tooltip contentStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
