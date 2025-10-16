import React, { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { roiByMethodTS, trustTiersTS } from "../data/roiTimeSeries";

const colorFor = (valueType) => ({
  Growth: "#16A34A",
  Protection: "#DC2626",
  Efficiency: "#2563EB"
}[valueType] || "#6B7280");

export default function RoiBreakdownTimeSeries({ enableChannel=false }) {
  const [view, setView] = useState("Method");
  const [expandedSeries, setExpandedSeries] = useState(null);

  const methodSeries = useMemo(() => {
    return Object.entries(roiByMethodTS).map(([name, obj]) => ({
      name,
      valueType: obj.valueType,
      data: obj.series
    }));
  }, []);

  const trustSeries = useMemo(() => {
    return Object.entries(trustTiersTS).map(([tier, obj]) => ({
      name: tier,
      data: obj.series
    }));
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">ROI Breakdown — Trend</h3>
        <div className="flex gap-2">
          {["Method", "Trust Tier", ...(enableChannel ? ["Channel"] : [])].map((k) => (
            <button key={k}
              onClick={() => setView(k)}
              className={`text-xs px-2 py-1 rounded border ${view===k ? "bg-blue-600 text-white border-blue-600":"bg-white text-gray-700 border-gray-200"}`}>
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart margin={{ top:10, right:20, left:10, bottom:0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB"/>
            <XAxis dataKey="month" tick={{ fontSize: 11 }}/>
            <YAxis tickFormatter={(v)=>`$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }}/>
            <Tooltip formatter={(v)=>[`$${Math.round(v).toLocaleString()}`, "ROI"]}/>
            <Legend wrapperStyle={{ fontSize: 12 }}/>
            {view === "Method" &&
              methodSeries.map((s) => (
                <Line
                  key={s.name}
                  type="monotone"
                  dataKey="value"
                  name={`${s.name} (${s.valueType})`}
                  stroke={colorFor(s.valueType)}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{
                    r: 5,
                    onClick: () => {
                      setExpandedSeries(expandedSeries === s.name ? null : s.name);
                    }
                  }}
                  data={s.data}
                />
              ))}
            {view === "Trust Tier" &&
              trustSeries.map((s) => (
                <Line
                  key={s.name}
                  type="monotone"
                  dataKey="roi"
                  name={`${s.name} Trust`}
                  stroke={
                    s.name === "High"
                      ? "#16A34A"
                      : s.name === "Medium"
                      ? "#2563EB"
                      : "#DC2626"
                  }
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{
                    r: 5,
                    onClick: () => {
                      setExpandedSeries(expandedSeries === s.name ? null : s.name);
                    }
                  }}
                  data={s.data}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Context / MoM insight */}
      <div className="mt-3 text-xs text-gray-700">
        💡 <span className="font-semibold">Insight:</span>{" "}
        {view === "Method"
          ? "Early Refund (Growth) and KTI (Efficiency) lead ROI growth; Inspection Delays & FTID drive Protection."
          : "High-trust segments yield highest LTV and ROI; Low-trust segments show high return rates and low LTV — rightfully targeted by Protection levers."}
      </div>

      {/* Trust Tier metrics table */}
      {view === "Trust Tier" && (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-2 text-left">Trust Tier</th>
                <th className="p-2 text-right">ROI $</th>
                <th className="p-2 text-right"># Customers</th>
                <th className="p-2 text-right"># Returns</th>
                <th className="p-2 text-right">Avg Return $</th>
                <th className="p-2 text-right">Avg LTV / Customer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.entries(trustTiersTS).map(([tier, obj]) => {
                const latest = obj.series[obj.series.length-1]?.roi || 0;
                return (
                  <tr key={tier}>
                    <td className="p-2">{tier}</td>
                    <td className="p-2 text-right">${latest.toLocaleString()}</td>
                    <td className="p-2 text-right">{obj.customers.toLocaleString()}</td>
                    <td className="p-2 text-right">{obj.returns.toLocaleString()}</td>
                    <td className="p-2 text-right">${obj.avgReturnAmount.toLocaleString()}</td>
                    <td className="p-2 text-right">${obj.avgLtv.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Expandable Series Details */}
      {expandedSeries && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start mb-3">
            <h4 className="text-sm font-semibold text-gray-900">
              Detailed drivers — {expandedSeries}
            </h4>
            <button
              onClick={() => setExpandedSeries(null)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ✕ Close
            </button>
          </div>
          
          <div className="space-y-3 text-xs text-gray-700">
            {view === "Method" && (
              <>
                <p><strong>Value Type:</strong> {
                  methodSeries.find(s => s.name === expandedSeries)?.valueType
                }</p>
                <p><strong>Narrative:</strong> {
                  expandedSeries === "Early Refund at Scan"
                    ? "Early Refund drives LTV and NPS improvements through faster resolutions."
                    : expandedSeries === "Delayed Refund upon Inspection"
                    ? "Inspection delays protect revenue by catching false refunds while maintaining CX balance."
                    : expandedSeries === "Block Return / Charge Fee"
                    ? "Blocking or fee-based returns reduce repeat abuse and leakage."
                    : expandedSeries === "Keep-the-Item (KTI)"
                    ? "KTI minimizes cost of goods sold and shipping, improving net efficiency."
                    : "FTID detection strengthens fraud prevention accuracy and trust scoring."
                }</p>
                <p><strong>Last Month ROI:</strong> $
                  {methodSeries.find(s => s.name === expandedSeries)?.data?.at(-1)?.value?.toLocaleString()}</p>
                <p><strong>Retailer Impact:</strong>{" "}
                  {expandedSeries === "Early Refund at Scan"
                    ? "Revenue growth through repeat purchase uplift."
                    : expandedSeries === "Delayed Refund upon Inspection"
                    ? "Revenue protection through fraud reduction."
                    : expandedSeries === "Block Return / Charge Fee"
                    ? "Reduced leakage and fewer repeat abusers."
                    : expandedSeries === "Keep-the-Item (KTI)"
                    ? "Reduced COGS, improved CX & LTV."
                    : "Fraud exposure mitigated through detection accuracy."}
                </p>
              </>
            )}

            {view === "Trust Tier" && (
              <>
                <p><strong>Category:</strong> Trust Tier</p>
                <p><strong>Narrative:</strong> {
                  expandedSeries === "High"
                    ? "High-trust customers yield the highest LTV and ROI. Maintain frictionless experiences."
                    : expandedSeries === "Medium"
                    ? "Medium-trust customers are stable performers but can be nudged upward via education and early refunds."
                    : "Low-trust customers are high-return, low-LTV cohorts—prime targets for fraud controls and inspection rules."
                }</p>
                <p><strong>Current ROI:</strong> $
                  {trustTiersTS[expandedSeries]?.series?.at(-1)?.roi?.toLocaleString()}</p>
                <p><strong>Avg LTV:</strong> $
                  {trustTiersTS[expandedSeries]?.avgLtv?.toLocaleString()}</p>
                <p><strong>Avg Return $:</strong> $
                  {trustTiersTS[expandedSeries]?.avgReturnAmount?.toLocaleString()}</p>
                <p><strong>Return Rate:</strong>{" "}
                  {(
                    (trustTiersTS[expandedSeries]?.returns /
                      trustTiersTS[expandedSeries]?.customers) *
                    100
                  ).toFixed(1)}%</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
