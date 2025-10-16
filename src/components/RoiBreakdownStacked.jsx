import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from "recharts";
import { roiBreakdown, roiDriversByMonth } from "../data/mockData";
import DetailDrawer from "./DetailDrawer";

export default function RoiBreakdownStacked() {
  const [open, setOpen] = useState(false);
  const [clicked, setClicked] = useState(null);

  const handleBarClick = (d) => {
    const m = d?.activeLabel;
    if (!m) return;
    setClicked({ month: m, ...roiDriversByMonth[m] });
    setOpen(true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">ROI Breakdown — 12-Month Trend</h3>
        <p className="text-xs text-gray-500">Click any bar to explore monthly drivers</p>
      </div>

      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={roiBreakdown} onClick={handleBarClick}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="Growth" stackId="a" fill="#16A34A" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Protection" stackId="a" fill="#DC2626" />
            <Bar dataKey="Efficiency" stackId="a" fill="#2563EB" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 text-xs text-gray-700">
        💡 <span className="font-semibold">Insight:</span> Growth levers (Early Refund, Gift Card Incentives)
        sustain ROI acceleration; Protection levers (Inspection, FTID) stabilize losses; Efficiency
        continues steady cost reduction.
      </div>

      <DetailDrawer open={open} onClose={() => setOpen(false)} title={`Monthly Drivers — ${clicked?.month || ""}`}>
        <div className="text-xs text-gray-700 space-y-2">
          {clicked && (
            <>
              <p><strong>Total ROI:</strong> ${clicked.summary}</p>
              <p><strong>Top Growth Driver:</strong> {clicked.growthTop}</p>
              <p><strong>Top Protection Driver:</strong> {clicked.protectionTop}</p>
              <p><strong>Top Efficiency Driver:</strong> {clicked.efficiencyTop}</p>
              <p className="mt-2"><strong>Optimization Tip:</strong> Expand KTI threshold $→$40; tune inspection for low-trust cohorts.</p>
            </>
          )}
        </div>
      </DetailDrawer>
    </div>
  );
}
