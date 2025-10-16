import React, { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Legend, Tooltip, AreaChart, Area } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import TogglePill from "./TogglePill";
import CustomTooltip from "./CustomTooltip";
import { useDarkMode } from "../contexts/DarkModeContext";
import { roiBreakdownByUseCase, roiUseCaseMeta, roiTrustTierByMetric, roiBreakdownByMetric, palette, trustTierFlat } from "../data/mockData";

const VIEW = { USE: "use_case", TRUST: "trust" };
const METRICS = ["Return Volume","Revenue Protected","LTV Growth"];

export default function RoiBreakdownUseCaseTrust() {
  const [view, setView] = useState(VIEW.USE);
  const [metric, setMetric] = useState("Revenue Protected");
  const [expanded, setExpanded] = useState(null);
  const { isDarkMode } = useDarkMode();

  // Choose Y-axis format based on selected metric
  const formatAxis = useMemo(() => {
    if (metric === "Revenue Protected") {
      return (v) => `$${(v / 1000).toFixed(0)}k`;
    }
    // counts or LTV
    return (v) => v?.toLocaleString?.() ?? v;
  }, [metric]);

  const handleClickBar = (e)=>{
    const month = e?.activeLabel;
    if(!month) return;
    setExpanded((cur)=>cur===month?null:month);
  };

  const activeUseKeys = roiBreakdownByMetric[metric] || [];
  
  const trustMetricKey = useMemo(() => {
    // Friendly pills → underlying keys in mock data
    // When you toggle trust-tier metrics in the UI, map:
    // Return Volume → "# Returns"
    // Revenue Protected → "Revenue Protected"
    // LTV Growth → "Avg LTV"
    if (metric === "Return Volume") return "# Returns";
    if (metric === "LTV Growth") return "Avg LTV";
    return "Revenue Protected";
  }, [metric]);

  const trustChartData = useMemo(() => trustTierFlat(trustMetricKey), [trustMetricKey]);

  return (
    <motion.div layout className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>ROI Breakdown — 12-Month Trend</h3>
        <div className="flex items-center gap-3">
          <TogglePill
            options={[{label:"By Use Case",value:VIEW.USE},{label:"By Trust Tier",value:VIEW.TRUST}]}
            value={view}
            onChange={setView}
          />
        </div>
      </div>
      <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Click any bar or area to explore monthly details</p>

      {/* secondary metric toggle */}
      <div className="mb-2">
        <TogglePill
          options={METRICS.map((m)=>({label:m,value:m}))}
          value={metric}
          onChange={setMetric}
        />
      </div>

        <motion.div layout className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {view===VIEW.USE?(
              <BarChart data={roiBreakdownByUseCase} onClick={handleClickBar} style={{ cursor: 'pointer' }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : palette.border}/>
              <XAxis dataKey="month" tick={{fontSize:10,fill:isDarkMode ? "#9CA3AF" : "#6B7280"}}/>
              <YAxis tickFormatter={formatAxis} tick={{fontSize:10,fill:isDarkMode ? "#9CA3AF" : "#6B7280"}}/>
              <Legend wrapperStyle={{fontSize:10, color:isDarkMode ? "#9CA3AF" : "#6B7280"}}/>
              <Tooltip content={<CustomTooltip/>}/>
              {activeUseKeys.map((k)=>{
                return (
                  <Bar key={k} dataKey={k} name={roiUseCaseMeta[k].label}
                       stackId="a" fill={roiUseCaseMeta[k].color}
                       radius={[4,4,0,0]} />
                );
              })}
            </BarChart>
          ):(
            <motion.div layout initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trustChartData} onClick={handleClickBar} style={{ cursor: 'pointer' }}>
                  <defs>
                    <linearGradient id="HighGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16A34A" stopOpacity={0.7}/>
                      <stop offset="95%" stopColor="#16A34A" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="MedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.7}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="LowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DC2626" stopOpacity={0.7}/>
                      <stop offset="95%" stopColor="#DC2626" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : palette.border}/>
                  <XAxis dataKey="month" tick={{fontSize:10,fill:isDarkMode ? "#9CA3AF" : "#6B7280"}}/>
                  <YAxis tickFormatter={formatAxis} tick={{fontSize:10,fill:isDarkMode ? "#9CA3AF" : "#6B7280"}}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Legend wrapperStyle={{fontSize:10,color:isDarkMode ? "#9CA3AF" : "#6B7280"}}/>
                <Area type="monotone" dataKey="High" stackId="1"
                  stroke="#16A34A" fill="url(#HighGrad)" />
                <Area type="monotone" dataKey="Medium" stackId="1"
                  stroke="#2563EB" fill="url(#MedGrad)" />
                <Area type="monotone" dataKey="Low" stackId="1"
                  stroke="#DC2626" fill="url(#LowGrad)" />
                {/* Mix percentage labels */}
                <Area type="monotone" dataKey="High" stackId="1"
                  stroke="none" fill="none"
                  label={(props) => {
                    const { payload, index } = props;
                    if (!payload || index !== payload.length - 1) return null;
                    const total = payload.High + payload.Medium + payload.Low;
                    const highPct = Math.round((payload.High / total) * 100);
                    return (
                      <text x={props.x} y={props.y - 5} textAnchor="middle" fontSize="10" fill="#16A34A" fontWeight="600">
                        {highPct}%
                      </text>
                    );
                  }} />
                <Area type="monotone" dataKey="Medium" stackId="1"
                  stroke="none" fill="none"
                  label={(props) => {
                    const { payload, index } = props;
                    if (!payload || index !== payload.length - 1) return null;
                    const total = payload.High + payload.Medium + payload.Low;
                    const medPct = Math.round((payload.Medium / total) * 100);
                    return (
                      <text x={props.x} y={props.y - 5} textAnchor="middle" fontSize="10" fill="#2563EB" fontWeight="600">
                        {medPct}%
                      </text>
                    );
                  }} />
                <Area type="monotone" dataKey="Low" stackId="1"
                  stroke="none" fill="none"
                  label={(props) => {
                    const { payload, index } = props;
                    if (!payload || index !== payload.length - 1) return null;
                    const total = payload.High + payload.Medium + payload.Low;
                    const lowPct = Math.round((payload.Low / total) * 100);
                    return (
                      <text x={props.x} y={props.y - 5} textAnchor="middle" fontSize="10" fill="#DC2626" fontWeight="600">
                        {lowPct}%
                      </text>
                    );
                  }} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </ResponsiveContainer>
      </motion.div>

      <p className={`text-xs mt-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        💡 <span className="font-semibold">Insight:</span> {view===VIEW.USE
          ?"Use-case view highlights ROI by operational method."
          :"Trust-tier view reveals shifting LTV & fraud patterns over time."}
      </p>

      <AnimatePresence>
        {expanded && (
          <motion.div
            layout
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            exit={{opacity:0,y:20}}
            transition={{duration:0.4}}
            className={`mt-5 border rounded-lg p-4 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}
          >
            <div className="flex justify-between mb-2">
              <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {view===VIEW.USE?"Monthly Drivers":"Trust Tier Breakdown"} — {expanded}
              </h4>
              <button onClick={()=>setExpanded(null)} className="text-xs text-blue-600 hover:underline">Close</button>
            </div>

            {view===VIEW.USE?(
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeUseKeys.map((k)=>{
                  const meta=roiUseCaseMeta[k];
                  const val=roiBreakdownByUseCase.find(r=>r.month===expanded)?.[k]??0;
                  return(
                    <div key={k} className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded-md p-3 flex flex-col`}>
                      <div className="flex items-center gap-2">
                        <span>{meta.icon}</span>
                        <span className={`text-[11px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{meta.label}</span>
                      </div>
                      <p className={`text-sm font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${val.toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
            ):(
              <div className="overflow-x-auto mt-3">
                  <table className="min-w-full text-xs">
                    <thead className={`${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                      <tr>
                        <th className="p-2 text-left">Tier</th>
                        <th className="p-2 text-right">
                          {trustMetricKey === "# Returns" ? "Return Volume"
                           : trustMetricKey === "Avg LTV" ? "Avg LTV"
                           : "Revenue Protected"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-gray-600' : 'divide-gray-100'}`}>
                    {(() => {
                      const row = roiTrustTierByMetric.find(r=>r.month===expanded);
                      return Object.keys(row?.[trustMetricKey]||{}).map((t)=>(
                        <tr key={t}>
                          <td className="p-2">{t}</td>
                          <td className="p-2 text-right">
                            {trustMetricKey==="Avg LTV" || trustMetricKey==="Revenue Protected"
                              ? `$${row[trustMetricKey][t].toLocaleString()}`
                              : row[trustMetricKey][t].toLocaleString()}
                          </td>
                        </tr>
                      ));
                    })()}
                    </tbody>
                  </table>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}