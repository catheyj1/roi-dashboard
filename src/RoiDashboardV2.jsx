// src/RoiDashboardV2.jsx - Simplified Interactive ROI Dashboard
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Area,
  AreaChart
} from "recharts";
import { exportToPDF } from "./utils/pdfExport";
import { useDarkMode } from "./contexts/DarkModeContext";
import DarkModeToggle from "./components/DarkModeToggle";
import "./styles/darkMode.css";


// Meta KPI header with period toggle
const HeaderMetaKPI = ({ roiPercent = 55, delta = 5, kpiPeriod, setKpiPeriod }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="text-sm text-gray-600">
      <span className="mr-2">ROI Captured to Date:</span>
      <span className="font-semibold text-gray-900">{roiPercent}%</span>
      <span className="ml-2 inline-flex items-center text-green-600 font-medium">
        +{delta}% ({kpiPeriod})
      </span>
    </div>
    <div className="flex bg-gray-100 rounded-lg p-1 text-xs" role="group" aria-label="KPI time period selection">
      {["30d", "90d", "ytd"].map(p => (
        <button
          key={p}
          onClick={() => setKpiPeriod(p)}
          className={`px-3 py-1 rounded-md transition-all duration-200 ${
            kpiPeriod === p 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-600 hover:text-gray-900"
          }`}
          aria-pressed={kpiPeriod === p}
        >
          {p.toUpperCase()}
        </button>
      ))}
    </div>
  </div>
);



// Trust Mix Composition - Executive Enhanced
const TrustMixComposition = () => {
  // Use real data from V1 mockData
  const data = [
    { month: "Jan", low: 0.25, med: 0.60, high: 0.15, lowValue: 75000, medValue: 95000, highValue: 125000 },
    { month: "Feb", low: 0.23, med: 0.58, high: 0.19, lowValue: 78000, medValue: 92000, highValue: 130000 },
    { month: "Mar", low: 0.21, med: 0.56, high: 0.23, lowValue: 82000, medValue: 89000, highValue: 135000 },
    { month: "Apr", low: 0.19, med: 0.54, high: 0.27, lowValue: 85000, medValue: 86000, highValue: 140000 },
    { month: "May", low: 0.17, med: 0.52, high: 0.31, lowValue: 88000, medValue: 83000, highValue: 145000 },
    { month: "Jun", low: 0.15, med: 0.50, high: 0.35, lowValue: 91000, medValue: 80000, highValue: 150000 },
  ];

  const currentMix = data[data.length - 1];
  const totalValue = currentMix.lowValue + currentMix.medValue + currentMix.highValue;

  return (
    <div className="bg-white shadow rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Trust Evolution</h3>
          <p className="text-sm text-gray-600">Strategic shift toward higher-trust customer segments</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">${(totalValue / 1000).toFixed(0)}K</div>
          <div className="text-sm text-gray-600">Total Protected Value</div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-lg font-bold text-red-600">{(currentMix.low * 100).toFixed(0)}%</div>
          <div className="text-sm text-red-700">Low Trust</div>
          <div className="text-xs text-red-600">${(currentMix.lowValue / 1000).toFixed(0)}K value</div>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-lg font-bold text-yellow-600">{(currentMix.med * 100).toFixed(0)}%</div>
          <div className="text-sm text-yellow-700">Medium Trust</div>
          <div className="text-xs text-yellow-600">${(currentMix.medValue / 1000).toFixed(0)}K value</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">{(currentMix.high * 100).toFixed(0)}%</div>
          <div className="text-sm text-green-700">High Trust</div>
          <div className="text-xs text-green-600">${(currentMix.highValue / 1000).toFixed(0)}K value</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} stackOffset="expand" margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity="0.6" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280", fontWeight: 500 }}
            />
            <YAxis 
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
            />
            <Tooltip 
              formatter={(value, name) => {
                const monthData = data.find(d => d.month === value);
                if (monthData) {
                  const valueMap = { low: monthData.lowValue, med: monthData.medValue, high: monthData.highValue };
                  return [`${(value * 100).toFixed(1)}%`, `${name} ($${(valueMap[name] / 1000).toFixed(0)}K)`];
                }
                return [`${(value * 100).toFixed(1)}%`, name];
              }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '12px'
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '12px',
                color: '#6B7280'
              }}
              iconType="rect"
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
            <Area type="monotone" dataKey="low" stackId="1" stroke="#EF4444" fill="#FCA5A5" name="Low Trust" />
            <Area type="monotone" dataKey="med" stackId="1" stroke="#F59E0B" fill="#FDE68A" name="Medium Trust" />
            <Area type="monotone" dataKey="high" stackId="1" stroke="#10B981" fill="#86EFAC" name="High Trust" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Executive Insight */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
        <div className="flex items-start">
          <div className="text-blue-500 mr-3 mt-0.5">💡</div>
          <div>
            <p className="text-sm font-medium text-blue-900">Strategic Insight</p>
            <p className="text-sm text-blue-700">
              High-trust customers now represent 35% of our base (up from 15%), driving 70% of total protected value. 
              This shift validates our KTI strategy and trust-based segmentation approach.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Impact Metrics - Executive Enhanced
const TrustImpactMetrics = () => {
  // Use real data from V1 mockData
  const data = [
    { month: "Jan", highLTV: 1200, repeatPR: 62, revenue: 125000, customers: 20000 },
    { month: "Feb", highLTV: 1210, repeatPR: 64, revenue: 130000, customers: 20250 },
    { month: "Mar", highLTV: 1220, repeatPR: 66, revenue: 135000, customers: 20500 },
    { month: "Apr", highLTV: 1230, repeatPR: 68, revenue: 140000, customers: 20750 },
    { month: "May", highLTV: 1240, repeatPR: 70, revenue: 145000, customers: 21000 },
    { month: "Jun", highLTV: 1247, repeatPR: 72, revenue: 150000, customers: 21250 },
  ];

  const currentData = data[data.length - 1];
  const ltvGrowth = ((currentData.highLTV - data[0].highLTV) / data[0].highLTV * 100).toFixed(1);
  const rprGrowth = ((currentData.repeatPR - data[0].repeatPR) / data[0].repeatPR * 100).toFixed(1);

  return (
    <div className="bg-white shadow rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Value Impact</h3>
          <p className="text-sm text-gray-600">High-trust customer lifetime value and retention trends</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">+{ltvGrowth}%</div>
          <div className="text-sm text-gray-600">LTV Growth</div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">${currentData.highLTV}</div>
          <div className="text-sm text-green-700">High Trust LTV</div>
          <div className="text-xs text-green-600">+{ltvGrowth}% vs Jan</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600">{currentData.repeatPR}%</div>
          <div className="text-sm text-purple-700">Repeat Purchase Rate</div>
          <div className="text-xs text-purple-600">+{rprGrowth}% vs Jan</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">${(currentData.revenue / 1000).toFixed(0)}K</div>
          <div className="text-sm text-blue-700">Monthly Revenue</div>
          <div className="text-xs text-blue-600">High-trust segment</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-lg font-bold text-orange-600">{currentData.customers.toLocaleString()}</div>
          <div className="text-sm text-orange-700">Active Customers</div>
          <div className="text-xs text-orange-600">High-trust tier</div>
        </div>
      </div>

      {/* Dual Chart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LTV Trend */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Lifetime Value Growth</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity="0.6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} />
                <Tooltip 
                  formatter={(value) => [`$${value}`, "LTV"]}
                  contentStyle={{ 
                    backgroundColor: "white", 
                    border: "1px solid #e5e7eb", 
                    borderRadius: 8, 
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    fontSize: "12px"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="highLTV" 
                  stroke="#10B981" 
                  strokeWidth={3} 
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Repeat Purchase Rate */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Retention Rate Improvement</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity="0.6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, "Repeat Rate"]}
                  contentStyle={{ 
                    backgroundColor: "white", 
                    border: "1px solid #e5e7eb", 
                    borderRadius: 8, 
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    fontSize: "12px"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="repeatPR" 
                  stroke="#7C3AED" 
                  strokeWidth={3} 
                  dot={{ fill: "#7C3AED", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#7C3AED", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-purple-50 rounded-lg border border-green-200">
        <div className="flex items-start">
          <div className="text-green-500 mr-3 mt-0.5">📈</div>
          <div>
            <p className="text-sm font-medium text-gray-900">Performance Summary</p>
            <p className="text-sm text-gray-700">
              High-trust customers show consistent growth with {ltvGrowth}% LTV increase and {rprGrowth}% retention improvement. 
              This segment now generates ${(currentData.revenue / 1000).toFixed(0)}K monthly revenue from {currentData.customers.toLocaleString()} active customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dummy Data Arrays
const segmentationData = [
  { trust: "Low Trust", customers: 25, retailerLTV: 127, networkLTV: 156, returns: 847 },
  { trust: "Medium Trust", customers: 60, retailerLTV: 425, networkLTV: 523, returns: 1432 },
  { trust: "High Trust", customers: 15, retailerLTV: 1247, networkLTV: 1589, returns: 234 },
];

const ktiData = [
  { trust: "Low", LTV: 127 },
  { trust: "Medium", LTV: 425 },
  { trust: "High", LTV: 1247 },
];

const ktiSuppression = [
  { type: "Rules Only", value: 247 },
  { type: "Both", value: 89 },
  { type: "IRIS Only", value: 156 },
];

const boxlessData = [
  { trust: "Low", LTV: 127 },
  { trust: "Medium", LTV: 425 },
  { trust: "High", LTV: 1247 },
];

const boxlessSuppression = [
  { type: "Rules Only", value: 134 },
  { type: "Both", value: 67 },
  { type: "IRIS Only", value: 98 },
];

const appeasementBeforeAfter = [
  { metric: "Repeat Purchase Rate", before: 67.2, after: 79.8 },
  { metric: "LTV", before: 1247, after: 1456 },
  { metric: "Time to Next Purchase (days)", before: 18.3, after: 14.7 },
];

const delayedFraud = [
  { metric: "Confirmed Fraud Cases", value: 43 },
  { metric: "Refund $ Saved", value: 18925 },
];

const delayedRates = { denialRate: 23.7, falsePositive: 4.2 };

const ftidData = [
  { type: "Attempts", value: 120 },
  { type: "Blocked", value: 95 },
];

// Shared DrillInModal
const DrillInModal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl max-w-4xl w-full p-6 overflow-y-auto max-h-[90vh] relative">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-lg"
      >
        ✕
      </button>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  </div>
);

// Drill-in Components
const SegmentationDrillIn = () => (
  <div className="h-80">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={segmentationData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="trust" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="customers" fill="#3B82F6" name="% of Customers" />
        <Bar dataKey="retailerLTV" fill="#10B981" name="Retailer LTV" />
        <Bar dataKey="networkLTV" fill="#6366F1" name="Network LTV" />
        <Bar dataKey="returns" fill="#F59E0B" name="Returns Volume" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const KtiDrillIn = () => (
  <div>
    <h3 className="font-semibold mb-2">LTV by Trust</h3>
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={ktiData}>
          <XAxis dataKey="trust" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="LTV" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <h3 className="font-semibold mt-6 mb-2">Suppression Overlap</h3>
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={ktiSuppression}>
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#60A5FA" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const BoxlessDrillIn = () => (
  <div>
    <h3 className="font-semibold mb-2">LTV by Trust</h3>
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={boxlessData}>
          <XAxis dataKey="trust" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="LTV" fill="#7C3AED" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <h3 className="font-semibold mt-6 mb-2">Rules vs IRIS Enforcement</h3>
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={boxlessSuppression}>
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#A78BFA" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const AppeasementDrillIn = () => (
  <div className="h-64">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={appeasementBeforeAfter}>
        <XAxis dataKey="metric" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="before" fill="#9CA3AF" name="Before" />
        <Bar dataKey="after" fill="#10B981" name="After" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const DelayedRefundDrillIn = () => (
  <div>
    <h3 className="font-semibold mb-2">Fraud Cases & Savings</h3>
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={delayedFraud}>
          <XAxis dataKey="metric" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#DC2626" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <h3 className="font-semibold mt-6">Rates</h3>
    <p>Denial Rate: {delayedRates.denialRate}%</p>
    <p>False Positive Rate: {delayedRates.falsePositive}%</p>
  </div>
);

const FtidDrillIn = () => (
  <div className="h-48">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={ftidData}>
        <XAxis dataKey="type" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#F97316" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// Outcome Metric Grid
const OutcomeMetricGrid = () => {
  const metrics = [
    { label: "Early Refund (Growth)", value: "+$100K LTV", color: "text-green-600", trend: [62,65,70] },
    { label: "Refund upon Inspection", value: "$200K Prevented", color: "text-red-600", trend: [180,200,220] },
    { label: "FTID Detection", value: "$40K Avoided", color: "text-red-600", trend: [30,40,45] },
    { label: "Force Boxless", value: "$60K Prevented", color: "text-red-600", trend: [50,55,60] },
    { label: "KTI Savings", value: "$50K Saved", color: "text-blue-600", trend: [45,50,55] },
    { label: "KTI Deterrence", value: "12% Fraud Reduction", color: "text-blue-600", trend: [10,11,12] },
  ];

  const getStrokeColor = (colorClass) => {
    const colorMap = {
      "text-green-600": "#10B981",
      "text-red-600": "#EF4444", 
      "text-blue-600": "#3B82F6"
    };
    return colorMap[colorClass] || "#6B7280";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {metrics.map((m,i)=>(
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="text-sm font-medium text-gray-700 mb-2">{m.label}</div>
          <div className={`text-xl font-bold ${m.color} mb-2`}>{m.value}</div>
          <div style={{ height: 50 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={m.trend.map((y,idx)=>({x:idx,y}))}>
                <Line type="monotone" dataKey="y" stroke={getStrokeColor(m.color)} strokeWidth={2} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
};





// Revenue Protection Breakdown - Interactive
// eslint-disable-next-line no-unused-vars
const RevenueProtectionBreakdown = () => {
  const [selectedTypes, setSelectedTypes] = useState(['all']);
  const [viewMode, setViewMode] = useState('dollar'); // 'dollar' or 'volume'
  const [customerType, setCustomerType] = useState('all'); // 'all', 'new', 'repeat'
  
  // Mock data for last 30 days with daily intervals
  const dailyData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dayOfWeek = date.getDay();
    
    // Simulate weekly patterns (lower on weekends)
    const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 1;
    
    return {
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      deniedReturns: Math.round((200 + Math.random() * 100) * weekendMultiplier),
      deflectedReturns: Math.round((100 + Math.random() * 50) * weekendMultiplier),
      earlyAppeasement: Math.round((80 + Math.random() * 40) * weekendMultiplier),
      delayedRefunds: Math.round((60 + Math.random() * 30) * weekendMultiplier),
      kti: Math.round((40 + Math.random() * 20) * weekendMultiplier),
      exchanges: Math.round((30 + Math.random() * 15) * weekendMultiplier),
      giftCards: Math.round((20 + Math.random() * 10) * weekendMultiplier)
    };
  });

  const returnTypes = [
    { key: 'all', label: 'All Types', color: '#6B7280' },
    { key: 'deniedReturns', label: 'Denied Returns', color: '#FCA5A5' },
    { key: 'deflectedReturns', label: 'Deflected Returns', color: '#7DD3FC' },
    { key: 'earlyAppeasement', label: 'Early Appeasement', color: '#86EFAC' },
    { key: 'delayedRefunds', label: 'Delayed Refunds', color: '#FDE68A' },
    { key: 'kti', label: 'Keep the Item (KTI)', color: '#C4B5FD' },
    { key: 'exchanges', label: 'Exchanges', color: '#F9A8D4' },
    { key: 'giftCards', label: 'Gift Cards', color: '#A5B4FC' }
  ];

  const handleTypeToggle = (typeKey) => {
    if (typeKey === 'all') {
      setSelectedTypes(['all']);
    } else {
      setSelectedTypes(prev => {
        const filtered = prev.filter(t => t !== 'all');
        if (filtered.includes(typeKey)) {
          return filtered.filter(t => t !== typeKey);
        } else {
          return [...filtered, typeKey];
        }
      });
    }
  };

  const filteredData = dailyData.map(day => {
    const filtered = { ...day };
    if (!selectedTypes.includes('all')) {
      returnTypes.forEach(type => {
        if (!selectedTypes.includes(type.key)) {
          filtered[type.key] = 0;
        }
      });
    }
    return filtered;
  });

  const totalVolume = dailyData.reduce((sum, day) => 
    sum + day.deniedReturns + day.deflectedReturns + day.earlyAppeasement + 
    day.delayedRefunds + day.kti + day.exchanges + day.giftCards, 0
  );

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Revenue Protection Breakdown - Interactive</h3>
          <p className="text-sm text-gray-600 mt-1">Return volume by day with filtering capabilities • Last 30 days</p>
        </div>
        <div className="text-sm text-gray-500">
          Total Volume: <span className="font-semibold text-gray-900">{totalVolume.toLocaleString()}</span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 space-y-4">
        {/* View Mode Toggle */}
        <div className="flex items-center space-x-4">
          <h4 className="text-sm font-semibold text-gray-700">View:</h4>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('dollar')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                viewMode === 'dollar' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              $ Value
            </button>
            <button
              onClick={() => setViewMode('volume')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                viewMode === 'volume' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Volume
            </button>
          </div>
        </div>

        {/* Customer Type Filter */}
        <div className="flex items-center space-x-4">
          <h4 className="text-sm font-semibold text-gray-700">Customer Type:</h4>
          <select
            className="border border-gray-200 rounded-md px-3 py-1.5 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
            value={customerType}
            onChange={(e) => setCustomerType(e.target.value)}
          >
            <option value="all">All Customers</option>
            <option value="new">New Customers</option>
            <option value="repeat">Repeat Customers</option>
          </select>
        </div>

        {/* Return Type Filter */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Filter by Return Type:</h4>
          <div className="flex flex-wrap gap-2">
            {returnTypes.map(type => (
              <button
                key={type.key}
                onClick={() => handleTypeToggle(type.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                  selectedTypes.includes(type.key)
                    ? 'text-gray-700 border-gray-300 shadow-sm'
                    : 'text-gray-500 bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                style={{
                  backgroundColor: selectedTypes.includes(type.key) ? type.color : undefined,
                  borderColor: selectedTypes.includes(type.key) ? type.color : undefined
                }}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity="0.6" />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#6B7280' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              tickFormatter={(v) => v.toLocaleString()}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#6B7280' }}
            />
            <Tooltip 
              formatter={(value, name) => [value.toLocaleString(), returnTypes.find(t => t.key === name)?.label || name]}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '20px',
                fontSize: '12px',
                color: '#6B7280'
              }}
              iconType="rect"
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
            {selectedTypes.includes('all') || selectedTypes.includes('deniedReturns') ? (
              <Bar dataKey="deniedReturns" stackId="a" fill="#FCA5A5" name="Denied Returns" />
            ) : null}
            {selectedTypes.includes('all') || selectedTypes.includes('deflectedReturns') ? (
              <Bar dataKey="deflectedReturns" stackId="a" fill="#7DD3FC" name="Deflected Returns" />
            ) : null}
            {selectedTypes.includes('all') || selectedTypes.includes('earlyAppeasement') ? (
              <Bar dataKey="earlyAppeasement" stackId="a" fill="#86EFAC" name="Early Appeasement" />
            ) : null}
            {selectedTypes.includes('all') || selectedTypes.includes('delayedRefunds') ? (
              <Bar dataKey="delayedRefunds" stackId="a" fill="#FDE68A" name="Delayed Refunds" />
            ) : null}
            {selectedTypes.includes('all') || selectedTypes.includes('kti') ? (
              <Bar dataKey="kti" stackId="a" fill="#C4B5FD" name="Keep the Item (KTI)" />
            ) : null}
            {selectedTypes.includes('all') || selectedTypes.includes('exchanges') ? (
              <Bar dataKey="exchanges" stackId="a" fill="#F9A8D4" name="Exchanges" />
            ) : null}
            {selectedTypes.includes('all') || selectedTypes.includes('giftCards') ? (
              <Bar dataKey="giftCards" stackId="a" fill="#A5B4FC" name="Gift Cards" />
            ) : null}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {dailyData.reduce((sum, day) => sum + day.deniedReturns, 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">Denied Returns</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {dailyData.reduce((sum, day) => sum + day.deflectedReturns, 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">Deflected Returns</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {(dailyData.reduce((sum, day) => sum + day.earlyAppeasement, 0) + 
              dailyData.reduce((sum, day) => sum + day.delayedRefunds, 0)).toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">Approved Returns</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {dailyData.reduce((sum, day) => sum + day.kti, 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">Keep the Item</div>
        </div>
      </div>
    </div>
  );
};

// Use Case Card Component
// eslint-disable-next-line no-unused-vars
const UseCaseCard = ({ name, roiContribution, sparklineData, optimizationNote, icon, color }) => (
  <div className={`${color} p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 group`}>
    <div className="flex items-center gap-3 mb-3">
      <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{icon}</span>
      <div>
        <h3 className="text-sm font-medium text-gray-700">{name}</h3>
        <div className="text-lg font-bold text-gray-900">{roiContribution}</div>
      </div>
    </div>
    
    {/* Mini Sparkline */}
    <div className="mb-3">
      <div className="h-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparklineData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    
    <p className="text-xs text-gray-600">{optimizationNote}</p>
  </div>
);

// Predictive Callout Component
// eslint-disable-next-line no-unused-vars
const PredictiveCallout = ({ title, value, subtext, chartData, chartType = "bar", color, icon }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div className="text-xs text-gray-500 font-medium">🔮 Predictive</div>
    </div>
    
    <div className="space-y-4">
      <div>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        <div className="text-sm text-gray-600">{subtext}</div>
      </div>
      
      {/* Mini Chart */}
      <div className="h-20">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={chartData}>
              <Bar dataKey="value" fill={color.replace('text-', '#').replace('-600', '')} />
            </BarChart>
          ) : (
            <LineChart data={chartData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color.replace('text-', '#').replace('-600', '')} 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

// ROI Trend Chart with Toggle
// eslint-disable-next-line no-unused-vars
const ROITrendChart = () => {
  const [showProjected, setShowProjected] = useState(true);
  
  const data = [
    { month: "Jan", actual: 120000, projected: null, milestone: null },
    { month: "Feb", actual: 135000, projected: null, milestone: null },
    { month: "Mar", actual: 150000, projected: null, milestone: "Force Boxless enabled" },
    { month: "Apr", actual: 180000, projected: null, milestone: null },
    { month: "May", actual: 220000, projected: null, milestone: "KTI strategy launched" },
    { month: "Jun", actual: 280000, projected: null, milestone: null },
    { month: "Jul", actual: 320000, projected: null, milestone: "Early Appeasement expanded" },
    { month: "Aug", actual: 380000, projected: null, milestone: "AI Detection enabled" },
    { month: "Sep", actual: 437000, projected: 520000, milestone: null },
    { month: "Oct", actual: null, projected: 580000, milestone: null },
    { month: "Nov", actual: null, projected: 650000, milestone: null },
    { month: "Dec", actual: null, projected: 720000, milestone: null }
  ];
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">ROI Growth Timeline</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showProjected"
              checked={showProjected}
              onChange={(e) => setShowProjected(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showProjected" className="text-sm text-gray-700">
              Show Projected ROI
            </label>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity="0.6" />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
          />
          <YAxis 
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
          />
          <Tooltip 
            formatter={(v, name) => {
              if (name === 'projected') return [`$${v.toLocaleString()}`, 'Projected ROI'];
              return [`$${v.toLocaleString()}`, 'Actual ROI'];
            }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="#3B82F6" 
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
            name="Actual ROI"
          />
          {showProjected && (
            <Line 
              type="monotone" 
              dataKey="projected" 
              stroke="#10B981" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
              connectNulls={false}
              name="Projected ROI"
            />
          )}
          {/* Milestone annotations */}
          {data.map((entry, index) => (
            entry.milestone && (
              <g key={`milestone-${index}`}>
                <circle 
                  cx={index * (1200 / data.length) + 60} 
                  cy={20} 
                  r={4} 
                  fill="#10B981" 
                  stroke="#059669" 
                  strokeWidth={2}
                />
                <text 
                  x={index * (1200 / data.length) + 60} 
                  y={15} 
                  textAnchor="middle" 
                  fontSize="10" 
                  fill="#065F46" 
                  fontWeight="600"
                >
                  🚀
                </text>
              </g>
            )
          ))}
        </LineChart>
      </ResponsiveContainer>
      
      {/* Milestone Legend */}
      <div className="mt-4 space-y-2">
        {data.filter(entry => entry.milestone).map((entry, index) => (
          <div key={index} className="flex items-center text-xs text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="font-medium">{entry.month}:</span>
            <span className="ml-1">{entry.milestone}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Revenue Protection Wrapper with Toggle
const RevenueProtectionWrapper = () => {
  const [viewType, setViewType] = useState("value"); // "value" | "volume" | "share"
  const [customerType, setCustomerType] = useState("all"); // "all" | "new" | "repeat"

  return (
    <div className="bg-white shadow rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Protection Breakdown</h3>
        <div className="flex items-center space-x-4">
          {/* Customer Type Filter */}
          <select
            className="border border-gray-200 rounded-md px-3 py-1.5 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
            value={customerType}
            onChange={(e) => setCustomerType(e.target.value)}
          >
            <option value="all">All Customers</option>
            <option value="new">New Customers</option>
            <option value="repeat">Repeat Customers</option>
          </select>
          
          {/* View Type Toggle */}
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                viewType === "value" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setViewType("value")}
            >
              $ Value
            </button>
            <button
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                viewType === "volume" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setViewType("volume")}
            >
              Volume
            </button>
            <button
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                viewType === "share" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setViewType("share")}
            >
              % Share
            </button>
          </div>
        </div>
      </div>

      {viewType === "value" && <RevenueValueChart />}
      {viewType === "volume" && <RevenueVolumeChart />}
      {viewType === "share" && <ROIShareTrend />}
    </div>
  );
};

// Revenue Value Chart
const RevenueValueChart = () => {
  const data = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dayOfWeek = date.getDay();
    const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 1;
    
    return {
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      EarlyRefund: Math.round((100 + Math.random() * 50) * weekendMultiplier),
      DelayedRefund: Math.round((200 + Math.random() * 100) * weekendMultiplier),
      BlockReturn: Math.round((75 + Math.random() * 40) * weekendMultiplier),
      KTI: Math.round((50 + Math.random() * 25) * weekendMultiplier),
      Boxless: Math.round((10 + Math.random() * 5) * weekendMultiplier),
      FTID: Math.round((5 + Math.random() * 3) * weekendMultiplier)
    };
  });

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity="0.6" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#6B7280' }}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={(v) => `$${v}K`}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#6B7280' }}
          />
          <Tooltip
            formatter={(value, name) => [`$${value}K`, name]}
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '12px',
              color: '#6B7280'
            }}
            iconType="rect"
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
          />
          <Bar dataKey="DelayedRefund" stackId="a" fill="#DC2626" name="Refund upon Inspection" />
          <Bar dataKey="EarlyRefund" stackId="a" fill="#16A34A" name="Early Refund at Scan" />
          <Bar dataKey="BlockReturn" stackId="a" fill="#EF4444" name="Block Return / Charge Fee" />
          <Bar dataKey="KTI" stackId="a" fill="#3B82F6" name="Keep the Item / Instant Credit" />
          <Bar dataKey="Boxless" stackId="a" fill="#7C3AED" name="Force Boxless Drop-Off" />
          <Bar dataKey="FTID" stackId="a" fill="#F97316" name="FTID Detection" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Revenue Volume Chart
const RevenueVolumeChart = () => {
  const data = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dayOfWeek = date.getDay();
    const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 1;
    
    return {
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      EarlyRefund: Math.round((40 + Math.random() * 20) * weekendMultiplier),
      DelayedRefund: Math.round((80 + Math.random() * 40) * weekendMultiplier),
      BlockReturn: Math.round((30 + Math.random() * 15) * weekendMultiplier),
      KTI: Math.round((20 + Math.random() * 10) * weekendMultiplier),
      Boxless: Math.round((4 + Math.random() * 2) * weekendMultiplier),
      FTID: Math.round((2 + Math.random() * 1) * weekendMultiplier)
    };
  });

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity="0.6" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#6B7280' }}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={(v) => v.toLocaleString()}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#6B7280' }}
          />
          <Tooltip
            formatter={(value, name) => [value.toLocaleString(), name]}
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '12px',
              color: '#6B7280'
            }}
            iconType="rect"
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
          />
          <Bar dataKey="DelayedRefund" stackId="a" fill="#DC2626" name="Refund upon Inspection" />
          <Bar dataKey="EarlyRefund" stackId="a" fill="#16A34A" name="Early Refund at Scan" />
          <Bar dataKey="BlockReturn" stackId="a" fill="#EF4444" name="Block Return / Charge Fee" />
          <Bar dataKey="KTI" stackId="a" fill="#3B82F6" name="Keep the Item / Instant Credit" />
          <Bar dataKey="Boxless" stackId="a" fill="#7C3AED" name="Force Boxless Drop-Off" />
          <Bar dataKey="FTID" stackId="a" fill="#F97316" name="FTID Detection" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ROI Share Trend Chart
const ROIShareTrend = () => {
  const data = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    
    return {
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      EarlyRefund: 0.15 + (Math.random() - 0.5) * 0.1,
      DelayedRefund: 0.46 + (Math.random() - 0.5) * 0.1,
      BlockReturn: 0.17 + (Math.random() - 0.5) * 0.1,
      KTI: 0.11 + (Math.random() - 0.5) * 0.1,
      Boxless: 0.02 + (Math.random() - 0.5) * 0.01,
      FTID: 0.01 + (Math.random() - 0.5) * 0.01
    };
  });

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} stackOffset="expand" margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity="0.6" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#6B7280' }}
            interval="preserveStartEnd"
          />
          <YAxis 
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#6B7280' }}
          />
          <Tooltip 
            formatter={(v) => `${(v * 100).toFixed(1)}%`}
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '12px',
              color: '#6B7280'
            }}
            iconType="rect"
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
          />
          <Area type="monotone" dataKey="DelayedRefund" stackId="1" stroke="#DC2626" fill="#DC2626" name="Refund upon Inspection" />
          <Area type="monotone" dataKey="EarlyRefund" stackId="1" stroke="#16A34A" fill="#16A34A" name="Early Refund at Scan" />
          <Area type="monotone" dataKey="BlockReturn" stackId="1" stroke="#EF4444" fill="#EF4444" name="Block Return / Charge Fee" />
          <Area type="monotone" dataKey="KTI" stackId="1" stroke="#3B82F6" fill="#3B82F6" name="Keep the Item / Instant Credit" />
          <Area type="monotone" dataKey="Boxless" stackId="1" stroke="#7C3AED" fill="#7C3AED" name="Force Boxless Drop-Off" />
          <Area type="monotone" dataKey="FTID" stackId="1" stroke="#F97316" fill="#F97316" name="FTID Detection" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Main V2 Dashboard Component
function RoiDashboardV2({ dashboardVersion, setDashboardVersion }) {
  const [timelineExpanded, setTimelineExpanded] = useState(false);
  const [timeRange, setTimeRange] = useState("30d");
  const [kpiPeriod, setKpiPeriod] = useState("30d");
  
  // Modal state management
  const [activeModal, setActiveModal] = useState(null);
  
  // Dark mode context
  const { isDarkMode } = useDarkMode();

  // Heroicons SVG components
  const ShieldCheck = () => (
    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  const TrendingUp = () => (
    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );

  const RepeatIcon = () => (
    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );

  const ShieldAlert = () => (
    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  );

  const handleExportPDF = async () => {
    await exportToPDF('v2-dashboard-content', `ROI-Dashboard-V2-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <DarkModeToggle />
      {/* --- HEADER --- */}
      <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Returns Intelligence ROI Dashboard</h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>RI V2 - Executive Summary Focus — "What's the strategic business impact?"</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Version Selector */}
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Version:</span>
                <select
                  className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                  value={dashboardVersion}
                  onChange={(e) => setDashboardVersion(e.target.value)}
                >
                  <option value="v1">RI V1</option>
                  <option value="v2">RI V2</option>
                </select>
              </div>
              {/* Time Range Selector */}
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Period:</span>
                <select
                  className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                  <option value="custom">Custom range</option>
                </select>
              </div>
              {/* PDF Export Button */}
              <button 
                onClick={handleExportPDF}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <span>📄</span>
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN --- */}
      <main id="v2-dashboard-content" className="max-w-7xl mx-auto px-6 py-12 section-spacing">
        
        {/* ======================= */}
        {/* TIER 1: EXECUTIVE OVERVIEW */}
        {/* ======================= */}
        <section>
          <h2 className={`tier-header mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Tier 1 — Executive Overview</h2>
          <p className={`tier-sub ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>High-level business impact summary and strategic insights for executive decision-making.</p>
          
          {/* Meta KPI Header */}
          <HeaderMetaKPI roiPercent={55} delta={5} kpiPeriod={kpiPeriod} setKpiPeriod={setKpiPeriod} />
        
        {/* Executive Summary - Business Impact Focus */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Returns Intelligence Business Impact</h2>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Executive Summary • Last 90 Days</p>
          </div>
          
          {/* Key Business Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={`metric-card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="card-header">
                <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Revenue Protected</h4>
                <span className="status-indicator status-exceeding">+15%</span>
              </div>
              <div className={`metric-value ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>$437K</div>
              <div className={`metric-label ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>8,500 returns prevented</div>
              <div className="mt-4 flex items-center">
                <div className={`p-2 rounded-lg mr-3 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <ShieldCheck />
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Protection Strategy</div>
              </div>
            </div>
            
            <div className={`metric-card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="card-header">
                <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Customer LTV Growth</h4>
                <span className="status-indicator status-exceeding">+3%</span>
              </div>
              <div className={`metric-value ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>+15%</div>
              <div className={`metric-label ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>+$300K projected value</div>
              <div className="mt-4 flex items-center">
                <div className={`p-2 rounded-lg mr-3 ${isDarkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                  <TrendingUp />
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Growth Strategy</div>
              </div>
            </div>
            
            <div className={`metric-card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="card-header">
                <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Repeat Purchase Rate</h4>
                <span className="status-indicator status-exceeding">+12%</span>
              </div>
              <div className={`metric-value ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>+50%</div>
              <div className={`metric-label ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Customer retention boost</div>
              <div className="mt-4 flex items-center">
                <div className={`p-2 rounded-lg mr-3 ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                  <RepeatIcon />
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Retention Strategy</div>
              </div>
            </div>
            
            <div className={`metric-card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="card-header">
                <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Fraud Prevention</h4>
                <span className="status-indicator status-improving">+8%</span>
              </div>
              <div className={`metric-value ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>$200K</div>
              <div className={`metric-label ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>180 high-risk returns blocked</div>
              <div className="mt-4 flex items-center">
                <div className={`p-2 rounded-lg mr-3 ${isDarkMode ? 'bg-red-900' : 'bg-red-100'}`}>
                  <ShieldAlert />
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Security Strategy</div>
              </div>
            </div>
          </div>
        </div>
        </section>

        <hr className={`section-divider ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />

        {/* ======================= */}
        {/* TIER 2: STRATEGIC DIAGNOSTICS */}
        {/* ======================= */}
        <section>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-6 bg-blue-500 rounded"></div>
            <h2 className={`tier-header ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Tier 2 — Strategic Diagnostics</h2>
          </div>
          <p className={`tier-sub ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Deep dive into strategic performance across customer segments, use cases, and business impact.
          </p>

        {/* ROI Journey Timeline - Collapsible */}
        <div className={`rounded-xl shadow-sm border mb-12 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <button 
            onClick={() => setTimelineExpanded(!timelineExpanded)}
            className={`w-full p-8 text-left transition-colors rounded-xl ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Returns Intelligence Journey</h3>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Click to {timelineExpanded ? 'collapse' : 'expand'}</span>
                <svg 
                  className={`w-5 h-5 transform transition-transform ${timelineExpanded ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </button>
          
          {timelineExpanded && (
            <div className={`px-8 pb-8 ${isDarkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-green-500 to-purple-500"></div>
                
                {/* Timeline Items */}
                <div className="space-y-12">
                  {/* Phase 1: Foundation */}
                  <div className="relative flex items-start">
                    <div className="absolute left-6 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg"></div>
                    <div className="ml-16">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">Phase 1</span>
                        <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Foundation & Early Wins</span>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Q1 2024</span>
                      </div>
                      <p className={`mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Launched basic return intelligence with early refund capabilities and fraud detection.</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-900' : 'bg-blue-50'}`}>
                          <div className={`font-semibold ${isDarkMode ? 'text-blue-100' : 'text-blue-900'}`}>$85K Revenue Protected</div>
                          <div className={isDarkMode ? 'text-blue-200' : 'text-blue-700'}>1,200 returns prevented</div>
                        </div>
                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-green-900' : 'bg-green-50'}`}>
                          <div className={`font-semibold ${isDarkMode ? 'text-green-100' : 'text-green-900'}`}>23% Customer Satisfaction</div>
                          <div className={isDarkMode ? 'text-green-200' : 'text-green-700'}>Early refund adoption</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phase 2: Growth */}
                  <div className="relative flex items-start">
                    <div className="absolute left-6 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                    <div className="ml-16">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">Phase 2</span>
                        <span className="text-lg font-bold text-gray-900">Strategic Expansion</span>
                        <span className="text-sm text-gray-500">Q2-Q3 2024</span>
                      </div>
                      <p className="text-gray-600 mb-3">Introduced KTI (Keep the Item) and trust-based segmentation, expanding to medium-trust customers.</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="font-semibold text-green-900">$245K Revenue Protected</div>
                          <div className="text-green-700">4,800 returns prevented</div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <div className="font-semibold text-purple-900">40% LTV Increase</div>
                          <div className="text-purple-700">High-trust KTI users</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phase 3: Optimization */}
                  <div className="relative flex items-start">
                    <div className="absolute left-6 w-4 h-4 bg-purple-500 rounded-full border-4 border-white shadow-lg"></div>
                    <div className="ml-16">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">Phase 3</span>
                        <span className="text-lg font-bold text-gray-900">AI-Powered Intelligence</span>
                        <span className="text-sm text-gray-500">Q4 2024</span>
                      </div>
                      <p className="text-gray-600 mb-3">Deployed advanced ML models and predictive analytics, achieving breakthrough performance.</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <div className="font-semibold text-purple-900">$437K Revenue Protected</div>
                          <div className="text-purple-700">8,500 returns prevented</div>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <div className="font-semibold text-orange-900">85% Fraud Detection</div>
                          <div className="text-orange-700">ML-powered accuracy</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Future Phase */}
                  <div className="relative flex items-start">
                    <div className="absolute left-6 w-4 h-4 bg-gray-300 rounded-full border-4 border-white shadow-lg"></div>
                    <div className="ml-16">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">Phase 4</span>
                        <span className="text-lg font-bold text-gray-900">Predictive Excellence</span>
                        <span className="text-sm text-gray-500">Q1 2025</span>
                      </div>
                      <p className="text-gray-600 mb-3">Next-generation AI with real-time personalization and cross-channel integration.</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 p-3 rounded-lg border-2 border-dashed border-gray-300">
                          <div className="font-semibold text-gray-700">$650K+ Projected</div>
                          <div className="text-gray-600">Advanced AI capabilities</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border-2 border-dashed border-gray-300">
                          <div className="font-semibold text-gray-700">95%+ Accuracy</div>
                          <div className="text-gray-600">Predictive intelligence</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Key Insights & Action Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Key Business Insights */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Key Business Insights
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Early Refund Strategy Driving Growth</p>
                  <p className="text-sm text-gray-600">KTI implementation increased customer satisfaction by 23% and reduced return processing costs by $45K monthly.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm">📈</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Trust-Based Segmentation Working</p>
                  <p className="text-sm text-gray-600">High-trust customers show 40% higher LTV when using KTI, validating our risk-based approach.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-yellow-600 text-sm">⚠️</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Fraud Detection Needs Enhancement</p>
                  <p className="text-sm text-gray-600">FTID detection caught 85% of fraudulent returns, but 15% still slip through costing $12K monthly.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Immediate Action Items */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Immediate Action Items
            </h3>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">Expand KTI to Medium Trust</h4>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">High Impact</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Extend Keep the Item to medium-trust customers to capture additional $85K monthly revenue.</p>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="mr-4">💰 $85K/month potential</span>
                  <span>⏱️ 2-week implementation</span>
                </div>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">Enhance Fraud Detection</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Medium Impact</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Implement additional ML models to reduce fraud leakage by 8% and save $12K monthly.</p>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="mr-4">💰 $12K/month savings</span>
                  <span>⏱️ 4-week implementation</span>
                </div>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">Optimize Early Refund Timing</h4>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Quick Win</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Fine-tune refund timing to reduce processing time by 2 days and improve customer experience.</p>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="mr-4">💰 $25K/month efficiency</span>
                  <span>⏱️ 1-week implementation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <section className="mb-12">
          {/* Revenue Protection Breakdown - Interactive with Toggle */}
          <RevenueProtectionWrapper />

          {/* Trust Mix Composition */}
          <div className="chart-container mb-8">
            <TrustMixComposition />
          </div>

          {/* Trust Impact Metrics */}
          <div className="chart-container mb-8">
            <TrustImpactMetrics />
          </div>
          <div className="text-xs text-blue-600 hover:underline cursor-pointer mt-2"
               onClick={() => setActiveModal("Segmentation")}>
            View Customer Segmentation →
          </div>

          {/* Outcome Metric Grid */}
          <OutcomeMetricGrid />


        </section>

      {/* Drill-In Modals */}
      {activeModal === "Segmentation" && (
        <DrillInModal title="Customer Segmentation" onClose={() => setActiveModal(null)}>
          <SegmentationDrillIn />
        </DrillInModal>
      )}
      {activeModal === "KTI" && (
        <DrillInModal title="Keep The Item (KTI)" onClose={() => setActiveModal(null)}>
          <KtiDrillIn />
        </DrillInModal>
      )}
      {activeModal === "Boxless" && (
        <DrillInModal title="Force Boxless Drop-Off" onClose={() => setActiveModal(null)}>
          <BoxlessDrillIn />
        </DrillInModal>
      )}
      {activeModal === "Appeasement" && (
        <DrillInModal title="Appeasement Outcomes" onClose={() => setActiveModal(null)}>
          <AppeasementDrillIn />
        </DrillInModal>
      )}
      {activeModal === "Delayed" && (
        <DrillInModal title="Refund upon Inspection" onClose={() => setActiveModal(null)}>
          <DelayedRefundDrillIn />
        </DrillInModal>
      )}
      {activeModal === "FTID" && (
        <DrillInModal title="FTID Detection" onClose={() => setActiveModal(null)}>
          <FtidDrillIn />
        </DrillInModal>
      )}

      {/* Strategic Recommendations */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-xl border border-gray-200 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Strategic Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Short-term (1-3 months)</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Expand KTI to medium-trust customers</li>
              <li>• Optimize early refund timing</li>
              <li>• Enhance fraud detection models</li>
            </ul>
            <div className="mt-3 text-xs text-green-600 font-medium">Potential: +$122K/month</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Medium-term (3-6 months)</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Implement predictive analytics</li>
              <li>• Expand to new customer segments</li>
              <li>• Integrate with loyalty programs</li>
            </ul>
            <div className="mt-3 text-xs text-blue-600 font-medium">Potential: +$200K/month</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Long-term (6-12 months)</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• AI-powered personalization</li>
              <li>• Cross-channel integration</li>
              <li>• Advanced fraud prevention</li>
            </ul>
            <div className="mt-3 text-xs text-purple-600 font-medium">Potential: +$350K/month</div>
          </div>
        </div>
      </div>

      {/* Executive Strategy Performance */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Strategy Performance Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* KTI Strategy */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">+23%</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Keep the Item (KTI)</h4>
            <p className="text-sm text-gray-600 mb-4">High-trust customers keep items instead of returning, reducing processing costs.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Revenue Impact:</span>
                <span className="font-semibold text-green-600">$245K</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Customer Satisfaction:</span>
                <span className="font-semibold text-green-600">+23%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Processing Savings:</span>
                <span className="font-semibold text-green-600">$45K/month</span>
              </div>
            </div>
          </div>

          {/* Early Refund Strategy */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">+18%</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Early Refund Processing</h4>
            <p className="text-sm text-gray-600 mb-4">Immediate refunds for low-risk returns, improving customer experience.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Revenue Protected:</span>
                <span className="font-semibold text-blue-600">$120K</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Processing Time:</span>
                <span className="font-semibold text-blue-600">-65%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Customer NPS:</span>
                <span className="font-semibold text-blue-600">+18%</span>
              </div>
            </div>
          </div>

          {/* Fraud Prevention */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">85%</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Fraud Detection</h4>
            <p className="text-sm text-gray-600 mb-4">Advanced ML models identify and prevent fraudulent return attempts.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Detection Rate:</span>
                <span className="font-semibold text-red-600">85%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fraud Blocked:</span>
                <span className="font-semibold text-red-600">180 cases</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Value Protected:</span>
                <span className="font-semibold text-red-600">$200K</span>
              </div>
            </div>
          </div>

          {/* Trust Segmentation */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">+40%</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Trust-Based Segmentation</h4>
            <p className="text-sm text-gray-600 mb-4">Dynamic customer classification enables personalized return experiences.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">LTV Increase:</span>
                <span className="font-semibold text-purple-600">+40%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">High Trust %:</span>
                <span className="font-semibold text-purple-600">35%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Value Concentration:</span>
                <span className="font-semibold text-purple-600">70%</span>
              </div>
            </div>
          </div>

          {/* Predictive Analytics */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">92%</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Predictive Analytics</h4>
            <p className="text-sm text-gray-600 mb-4">ML-powered insights predict return behavior and optimize strategies.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Prediction Accuracy:</span>
                <span className="font-semibold text-orange-600">92%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ROI Improvement:</span>
                <span className="font-semibold text-orange-600">+15%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cost Reduction:</span>
                <span className="font-semibold text-orange-600">$28K/month</span>
              </div>
            </div>
          </div>

          {/* Force Boxless */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">+12%</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Force Boxless Returns</h4>
            <p className="text-sm text-gray-600 mb-4">Streamlined return process reduces friction and improves efficiency.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Efficiency Gain:</span>
                <span className="font-semibold text-indigo-600">+12%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Processing Time:</span>
                <span className="font-semibold text-indigo-600">-30%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cost Savings:</span>
                <span className="font-semibold text-indigo-600">$18K/month</span>
              </div>
            </div>
          </div>
        </div>
      </div>
        </section>

        <hr className="section-divider" />

        {/* ======================= */}
        {/* TIER 3: OPTIMIZATION OPPORTUNITIES */}
        {/* ======================= */}
        <section>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-6 bg-green-500 rounded"></div>
            <h2 className="tier-header">Tier 3 — Optimization Opportunities</h2>
          </div>
          <p className="tier-sub">
            Strategic recommendations and actionable insights for maximizing ROI impact.
          </p>

        {/* Strategic Use Case Performance */}
        <div className="chart-container mb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Strategic Use Case Performance</h3>
            <p className="text-gray-600">Revenue protection strategies by customer segment and business impact</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
            <span>View Customer Segmentation</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        {/* Executive Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-bold text-emerald-900">Growth Strategies</h4>
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-emerald-700 mb-1">$175K</div>
            <div className="text-sm text-emerald-600">Early Refund Impact</div>
            <div className="mt-3 text-xs text-emerald-700 font-medium">High-trust customers only</div>
          </div>
          
          <div className="bg-gradient-to-r from-red-50 to-rose-50 p-6 rounded-xl border border-red-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-bold text-red-900">Protection Strategies</h4>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-red-700 mb-1">$355K</div>
            <div className="text-sm text-red-600">Fraud Prevention Impact</div>
            <div className="mt-3 text-xs text-red-700 font-medium">Low-trust + All segments</div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-bold text-blue-900">Efficiency Strategies</h4>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-blue-700 mb-1">$95K</div>
            <div className="text-sm text-blue-600">Cost Savings Impact</div>
            <div className="mt-3 text-xs text-blue-700 font-medium">High-trust customers only</div>
          </div>
        </div>

        {/* Detailed Strategy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Early Refund (Growth) */}
          <div className="group bg-gradient-to-br from-emerald-50 to-green-100 p-6 rounded-xl border border-emerald-200 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-emerald-700 bg-emerald-200 px-3 py-1 rounded-full">Growth</div>
                <div className="text-xs text-emerald-600 mt-1">High Trust (35%)</div>
              </div>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Early Refund at Scan</h4>
            <p className="text-sm text-gray-600 mb-4">Instant refunds for trusted customers to drive loyalty and repeat purchases.</p>
            
            {/* Key Metrics with Visual Indicators */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ROI Impact</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-emerald-200 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-emerald-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-bold text-emerald-700">$175K</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">LTV Lift</span>
                <span className="text-sm font-bold text-emerald-700">+12%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Repeat Rate</span>
                <span className="text-sm font-bold text-emerald-700">+18%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Customer Satisfaction</span>
                <span className="text-sm font-bold text-emerald-700">92%</span>
              </div>
            </div>
          </div>

          {/* KTI (Efficiency) */}
          <div className="group bg-gradient-to-br from-blue-50 to-cyan-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-blue-700 bg-blue-200 px-3 py-1 rounded-full">Efficiency</div>
                <div className="text-xs text-blue-600 mt-1">High Trust (35%)</div>
              </div>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Keep the Item (KTI)</h4>
            <p className="text-sm text-gray-600 mb-4">Avoids COGS + shipping while improving customer experience for trusted customers.</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ROI Impact</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div className="w-3/5 h-full bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-bold text-blue-700">$95K</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">COGS Saved</span>
                <span className="text-sm font-bold text-blue-700">$24K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Shipping Saved</span>
                <span className="text-sm font-bold text-blue-700">$7K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Abandonment Rate</span>
                <span className="text-sm font-bold text-blue-700">11%</span>
              </div>
            </div>
          </div>

          {/* Delayed Refund (Protection) */}
          <div className="group bg-gradient-to-br from-red-50 to-rose-100 p-6 rounded-xl border border-red-200 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-red-700 bg-red-200 px-3 py-1 rounded-full">Protection</div>
                <div className="text-xs text-red-600 mt-1">Low Trust (15%)</div>
              </div>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Delayed Refund (Inspection)</h4>
            <p className="text-sm text-gray-600 mb-4">Targets high-risk returns for inspection to prevent fraud and reduce losses.</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ROI Impact</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-red-200 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-bold text-red-700">$125K</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Fraud Prevention</span>
                <span className="text-sm font-bold text-red-700">82%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Loss Avoided</span>
                <span className="text-sm font-bold text-red-700">$75</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">False Positive</span>
                <span className="text-sm font-bold text-red-700">3.5%</span>
              </div>
            </div>
          </div>

          {/* FTID Detection (Protection) */}
          <div className="group bg-gradient-to-br from-orange-50 to-amber-100 p-6 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-orange-700 bg-orange-200 px-3 py-1 rounded-full">Protection</div>
                <div className="text-xs text-orange-600 mt-1">All Segments</div>
              </div>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">FTID Detection</h4>
            <p className="text-sm text-gray-600 mb-4">Advanced ML models identify fraudulent return attempts and prevent losses.</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ROI Impact</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-orange-200 rounded-full overflow-hidden">
                    <div className="w-3/5 h-full bg-orange-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-bold text-orange-700">$90K</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Detection Rate</span>
                <span className="text-sm font-bold text-orange-700">85%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">False Positive</span>
                <span className="text-sm font-bold text-orange-700">3.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ML Accuracy</span>
                <span className="text-sm font-bold text-orange-700">92%</span>
              </div>
            </div>
          </div>

          {/* Force Boxless (Protection) */}
          <div className="group bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-purple-700 bg-purple-200 px-3 py-1 rounded-full">Protection</div>
                <div className="text-xs text-purple-600 mt-1">Low Trust (15%)</div>
              </div>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Force Boxless Returns</h4>
            <p className="text-sm text-gray-600 mb-4">Routes risky returns to in-network verification to reduce fraud and item-switching.</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ROI Impact</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-purple-200 rounded-full overflow-hidden">
                    <div className="w-2/5 h-full bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-bold text-purple-700">$75K</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Efficiency Gain</span>
                <span className="text-sm font-bold text-purple-700">+12%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Processing Time</span>
                <span className="text-sm font-bold text-purple-700">-30%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cost Savings</span>
                <span className="text-sm font-bold text-purple-700">$18K</span>
              </div>
            </div>
          </div>

          {/* KTI Denial (Protection) */}
          <div className="group bg-gradient-to-br from-pink-50 to-rose-100 p-6 rounded-xl border border-pink-200 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-pink-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-pink-700 bg-pink-200 px-3 py-1 rounded-full">Protection</div>
                <div className="text-xs text-pink-600 mt-1">Low Trust (15%)</div>
              </div>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">KTI Denial (Low Trust)</h4>
            <p className="text-sm text-gray-600 mb-4">Denies Keep the Item to low-trust customers to prevent abuse and reduce losses.</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ROI Impact</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-pink-200 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-pink-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-bold text-pink-700">$65K</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Abuse Prevention</span>
                <span className="text-sm font-bold text-pink-700">+25%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Loss Reduction</span>
                <span className="text-sm font-bold text-pink-700">$18K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Risk Mitigation</span>
                <span className="text-sm font-bold text-pink-700">High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Insight Footer */}
        <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Strategic Insight</h4>
              <p className="text-gray-700 mb-3">
                Our segmentation strategy creates a clear value hierarchy: <strong>High-trust customers</strong> receive premium experiences 
                (Early Refund, KTI) driving $270K in growth and efficiency gains, while <strong>low-trust segments</strong> are protected 
                through inspection and verification strategies preventing $265K in losses.
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-600">Growth: $175K</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">Protection: $355K</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Efficiency: $95K</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        </section>

        {/* Executive Summary Footer */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Next Steps</h4>
        <p className="text-gray-600 mb-4">Schedule a strategy session to prioritize these recommendations and create an implementation roadmap.</p>
        <div className="flex justify-center space-x-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Schedule Meeting
          </button>
          <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            Download Report
          </button>
        </div>
      </div>
      </main>
    </div>
  );
}

export default RoiDashboardV2;