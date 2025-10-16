import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList
} from "recharts";
import DetailDrawer from "./DetailDrawer";

export default function RoiBreakdownEnhanced() {
  const [view, setView] = useState("Method");
  const [open, setOpen] = useState(false);

  const datasets = {
    Method: [
      { category: "Boxless", value: 75000, delta: "+9%" },
      { category: "KTI", value: 95000, delta: "+7%" },
      { category: "Gift Card", value: 90000, delta: "+5%" },
      { category: "Early Refund", value: 175000, delta: "+12%" }
    ],
    "Trust Tier": [
      { category: "High", value: 225000, delta: "+8%" },
      { category: "Medium", value: 145000, delta: "+3%" },
      { category: "Low", value: 200000, delta: "+6%" }
    ],
    Channel: [
      { category: "Online Returns", value: 280000, delta: "+10%" },
      { category: "In-Store Returns", value: 210000, delta: "+4%" },
      { category: "Carrier Drop-off", value: 100000, delta: "+2%" }
    ]
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">ROI Breakdown Analysis</h3>
          <p className="chart-subtitle">
            {view === "Method"
              ? "ROI distribution by IRIS enforcement type"
              : view === "Trust Tier"
              ? "ROI variation across customer trust tiers"
              : "ROI contribution by return channel"}
          </p>
        </div>
        <div className="flex gap-2">
          {Object.keys(datasets).map((key) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`text-sm px-3 py-1.5 rounded-md font-medium transition-colors duration-200 ${
                view === key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={datasets[view]} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
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
          <Tooltip
            formatter={(v, n, p) => [`$${v.toLocaleString()}`, `${p.payload.delta} change`]}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px"
            }}
          />
          <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]}>
            <LabelList
              dataKey="delta"
              position="top"
              className="text-[10px] fill-gray-500"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Inline insight */}
      <div className="mt-4 text-sm text-gray-700 leading-snug">
        💡 <span className="font-semibold">Insight:</span>{" "}
        {view === "Method"
          ? "Early Refund and KTI together represent 55% of total ROI growth this cycle (+12% MoM)."
          : view === "Trust Tier"
          ? "High-trust segments generate the largest ROI uplift, while Low-trust controls mitigate 30% potential exposure."
          : "In-store channels drive stronger ROI recovery due to lower friction and faster resolution."}
      </div>

      <button className="mt-3 text-xs font-medium text-blue-600 hover:underline" onClick={()=>setOpen(true)}>
        View detailed drivers →
      </button>
      <DetailDrawer open={open} onClose={()=>setOpen(false)} title={`Detailed drivers — ${view}`}>
        <div className="text-xs text-gray-700 space-y-3">
          <p><strong>Driver mix:</strong> Early Refund (Growth), KTI (Efficiency), Delayed Refund & FTID (Protection).</p>
          <p><strong>Trust-tier context:</strong> High = higher LTV & lower return rates; Low = lower LTV with higher return rates and fraud propensity.</p>
          <p><strong>Actions:</strong> Expand Early Refund coverage to mid-trust; tighten Boxless/Inspection thresholds for Low-trust; raise KTI ceiling where abandonment is low.</p>
        </div>
      </DetailDrawer>
    </div>
  );
}
