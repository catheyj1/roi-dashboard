import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from "recharts";
import { roiBreakdown12m, palette } from "../data/mockData";

export default function RoiBreakdownStackedExpandable() {
  const [expandedMonth, setExpandedMonth] = useState(null);

  const onClickBar = (evt) => {
    const month = evt?.activeLabel;
    if (!month) return;
    const row = roiBreakdown12m.find((r) => r.month === month);
    setExpandedMonth((curr) => (curr?.month === month ? null : row));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">ROI Breakdown — 12-Month Trend</h3>
        <span className="text-xs text-gray-500">Click any bar to expand monthly drivers</span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={roiBreakdown12m} onClick={onClickBar}>
            <CartesianGrid strokeDasharray="3 3" stroke={palette.border} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} />
            <YAxis tickFormatter={(v)=>`$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "#6B7280" }}/>
            <Tooltip formatter={(v)=>`$${v.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="Growth" stackId="a" fill={palette.growth} radius={[4,4,0,0]} />
            <Bar dataKey="Protection" stackId="a" fill={palette.protection} />
            <Bar dataKey="Efficiency" stackId="a" fill={palette.efficiency} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-gray-700 mt-3">
        💡 <span className="font-semibold">Insight:</span> Growth (Early Refund, KTI-High) drives LTV & RPR; Protection (Inspection, FTID, Boxless, Blocklist) reduces loss; Efficiency (KTI) lowers COGS + shipping.
      </p>

      {/* Inline expanded details */}
      {expandedMonth && (
        <div className="mt-5 border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">Monthly Drivers — {expandedMonth.month}</h4>
            <button className="text-xs text-blue-600 hover:underline" onClick={()=>setExpandedMonth(null)}>Close</button>
          </div>

          {/* Methods / use-cases */}
          <div className="mt-3">
            <p className="text-xs text-gray-700 mb-2"><span className="font-semibold">Revenue protection & growth by method / use case</span></p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {expandedMonth.methods.map((m) => (
                <div key={m.name} className="bg-white border border-gray-200 rounded-md p-3">
                  <p className="text-[11px] text-gray-500">{m.type}</p>
                  <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                  <p className="text-xs text-gray-600 mt-1">${m.value.toLocaleString()} • {m.impact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust tier table */}
          <div className="mt-5">
            <p className="text-xs text-gray-700 mb-2"><span className="font-semibold">Trust tier breakdown</span> (ROI, customers, returns, avg return $, avg LTV)</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="p-2 text-left">Tier</th>
                    <th className="p-2 text-right">ROI $</th>
                    <th className="p-2 text-right"># Customers</th>
                    <th className="p-2 text-right"># Returns</th>
                    <th className="p-2 text-right">Avg Return $</th>
                    <th className="p-2 text-right">Avg LTV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {expandedMonth.trustTiers.map((t) => (
                    <tr key={t.tier}>
                      <td className="p-2">{t.tier}</td>
                      <td className="p-2 text-right">${t.roi.toLocaleString()}</td>
                      <td className="p-2 text-right">{t.customers.toLocaleString()}</td>
                      <td className="p-2 text-right">{t.returns.toLocaleString()}</td>
                      <td className="p-2 text-right">${t.avgReturn.toLocaleString()}</td>
                      <td className="p-2 text-right">${t.avgLtv.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
