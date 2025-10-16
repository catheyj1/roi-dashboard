export const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/* ----------------- helpers ----------------- */
// Seeded random function for consistent data
let seed = 12345;
const seededRandom = () => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};

const rand = (min, max) => Math.round(min + seededRandom() * (max - min));
export const gen90d = (base = 100, amp = 12) =>
  Array.from({ length: 90 }).map((_, i) => ({
    day: i + 1,
    value: Math.round(base + Math.sin(i / 7) * amp + (seededRandom() - 0.5) * amp)
  }));

export const toSparkMonths = (series) => {
  const step = Math.floor(series.length / 12);
  return Array.from({ length: 12 }).map((_, i) => ({
    month: MONTHS[i],
    value: series[i * step]?.value ?? series.at(-1)?.value ?? 0
  }));
};

/* -------- theme aligned to Claims dashboard -------- */
export const palette = {
  pageBg: "#F9FAFB",
  cardBg: "#FFFFFF",
  border: "#E5E7EB",
  text: { primary: "#111827", secondary: "#6B7280" },
  iris: "#2563EB",
  industry: "#9CA3AF",
  growth: "#16A34A",
  protection: "#DC2626",
  efficiency: "#2563EB",
  neutral50: "#F9FAFB",
  neutral100: "#F3F4F6",
  neutral200: "#E5E7EB",
};

// ----------------------------------------------
// OVERVIEW: 3 cards with dual 90-day comparison
// ----------------------------------------------
export const roiOverview = [
  {
    key: "revenue_protected",
    title: "Total Revenue Protected",
    // returns/refunds prevented/deflected
    value: 437000,
    percent: 43.4, // of total ROI
    topDriver: "Inspection & Blocklist",
    description:
      "IRIS prevented losses via targeted inspection, blocklist controls, and boxless verification.",
    // 90-day trends (IRIS vs industry)
    iris90d: gen90d(490, 28),
    industry90d: gen90d(470, 18),
    benchmark: "+5% vs industry",
    // For expanded panel: top method/use-case contributors
    contributors: [
      { name: "Delayed Refund (Inspection)", type: "Protection", value: 180000, impact: "↓ Fraud Loss", icon: "🛡" },
      { name: "Blocklist", type: "Protection", value: 95000, impact: "↓ Repeat Abuse", icon: "⛔" },
      { name: "FTID Detection", type: "Protection", value: 58000, impact: "↓ Exposure", icon: "🎯" },
      { name: "Boxless Enforcement", type: "Protection", value: 45000, impact: "↑ Verification", icon: "📦" }
    ]
  },
  {
    key: "ltv_impact",
    title: "Customer LTV Impact",
    value: 265000,
    percent: 32.8,
    topDriver: "Early Refund",
    description:
      "Instant refunds for high-trust customers increased LTV and accelerated repurchase cadence.",
    iris90d: gen90d(520, 24),
    industry90d: gen90d(505, 16),
    benchmark: "+3% vs industry",
    contributors: [
      { name: "Early Refund at Scan", type: "Growth", value: 175000, impact: "↑ LTV / RPR", icon: "💚" },
      { name: "KTI (High Trust)", type: "Growth", value: 90000, impact: "↑ CX, ↓ Friction", icon: "⚙️" }
    ]
  },
  {
    key: "rpr_uplift",
    title: "Repeat Purchase Rate Uplift",
    value: 145000,
    percent: 23.8,
    topDriver: "KTI (Keep the Item)",
    description:
      "KTI approvals reduced friction and increased repeat purchases among loyal customers.",
    iris90d: gen90d(480, 20),
    industry90d: gen90d(470, 14),
    benchmark: "+2% vs industry",
    contributors: [
      { name: "KTI (High Trust)", type: "Efficiency", value: 95000, impact: "↓ COGS + Ship, ↑ CX", icon: "⚙️" },
      { name: "Early Refund at Scan", type: "Growth", value: 50000, impact: "↑ RPR, ↑ NPS", icon: "💚" }
    ]
  }
];

/* ----------------- ROI BREAKDOWN (Use Case & Trust Tier) ----------------- */
// 12-month per-use-case series (for grouped/stacked bars)
const useCaseKeys = [
  { key: "early_refund", label: "Early Refund (Growth)", color: "#16A34A", icon: "💚" },
  { key: "kti_high", label: "KTI (High Trust)", color: "#0EA5E9", icon: "⚙️" },
  { key: "inspection", label: "Delayed Refund (Inspection)", color: "#DC2626", icon: "🛡" },
  { key: "ftid", label: "FTID Detection", color: "#EF4444", icon: "🎯" },
  { key: "blocklist", label: "Blocklist", color: "#F97316", icon: "⛔" },
  { key: "boxless", label: "Forced Boxless", color: "#F59E0B", icon: "📦" },
  { key: "kti_denial", label: "KTI Denial (Low Trust)", color: "#FB7185", icon: "🧱" }
];

export const roiBreakdownByUseCase = MONTHS.map((m, i) => ({
  month: m,
  early_refund: 22000 + Math.sin(i/1.3)*4000 + rand(-1500,1500),
  kti_high: 15000 + Math.sin(i/1.5)*3000 + rand(-1200,1200),
  inspection: 18000 + Math.cos(i/1.4)*3500 + rand(-1500,1500),
  ftid: 9000 + Math.cos(i/1.8)*2500 + rand(-1000,1000),
  blocklist: 7000 + Math.sin(i/1.9)*2000 + rand(-800,800),
  boxless: 11000 + Math.sin(i/1.6)*2000 + rand(-800,800),
  kti_denial: 9500 + Math.cos(i/1.7)*1800 + rand(-700,700),
}));

export const roiUseCaseMeta = Object.fromEntries(
  useCaseKeys.map((u) => [u.key, u])
);

// 12-month trust-tier series + extra metrics (for table)
export const roiBreakdownByTrustTier = MONTHS.map((m, i) => ({
  month: m,
  High: 125000 + Math.sin(i/1.2)*8000 + rand(-2000,2000),
  Medium: 95000 + Math.cos(i/1.5)*7000 + rand(-1500,1500),
  Low: 75000 + Math.sin(i/1.3)*6000 + rand(-1500,1500),
  metrics: {
    High: { customers: 20000, returns: 22000, avgReturn: 68, avgLtv: 1247 },
    Medium: { customers: 40000, returns: 56000, avgReturn: 55, avgLtv: 425 },
    Low: { customers: 16000, returns: 54000, avgReturn: 48, avgLtv: 127 }
  }
}));

/* ----- ROI Breakdown metric variants ----- */
export const roiMetrics = ["Return Volume","Revenue Protected","LTV Growth"];

export const roiBreakdownByMetric = {
  "Return Volume": ["boxless","inspection","kti_denial"],
  "Revenue Protected": ["blocklist","ftid","inspection","boxless"],
  "LTV Growth": ["early_refund","kti_high"]
};

// Trust-tier metrics with realistic seasonal patterns and migration trends:
// - High: grows over time with seasonal peaks (holiday shopping, back-to-school)
// - Medium: decreases overall but spikes during peak seasons
// - Low: decreases as fraud detection improves, but increases during high-volume periods
export const roiTrustTierByMetric = MONTHS.map((m,i)=>{
  // Seasonal factors (0.7 to 1.4 range)
  const holidayPeak = (i === 10 || i === 11) ? 1.4 : 1.0; // Nov/Dec holiday shopping
  const backToSchool = (i === 7 || i === 8) ? 1.2 : 1.0; // Aug/Sep back-to-school
  const summerDip = (i >= 5 && i <= 7) ? 0.8 : 1.0; // Jun-Aug summer slowdown
  const springPeak = (i === 3 || i === 4) ? 1.15 : 1.0; // Apr/May spring shopping
  
  // Regional variation (simulates different geographic patterns)
  const regionalVariation = 0.9 + (Math.sin(i * 0.5) * 0.2) + (Math.random() * 0.1);
  
  // Month-specific events (Valentine's Day, Mother's Day, etc.)
  const valentinesBoost = (i === 1) ? 1.1 : 1.0; // Feb
  const mothersDayBoost = (i === 4) ? 1.08 : 1.0; // May
  const fathersDayBoost = (i === 5) ? 1.05 : 1.0; // June
  const blackFridayPrep = (i === 9) ? 1.15 : 1.0; // Oct (pre-holiday)
  
  const seasonalFactor = holidayPeak * backToSchool * summerDip * springPeak * regionalVariation * 
                       valentinesBoost * mothersDayBoost * fathersDayBoost * blackFridayPrep;
  
  // Migration trends (customers moving between tiers)
  const migrationTrend = 1 + (i * 0.02); // 2% growth per month in high-trust
  
  return {
    month: m,
    "# Returns": {
      High: Math.round((18000 + i*200) * seasonalFactor + rand(-800,800)),
      Medium: Math.round((56000 - i*600) * seasonalFactor + rand(-1200,1200)),
      Low: Math.round((54000 - i*350) * seasonalFactor + rand(-1000,1000))
    },
    "Avg LTV": {
      High: Math.round((1200 + i*10) * migrationTrend + rand(-20,20)),
      Medium: Math.round((420 + i*3) * migrationTrend + rand(-15,15)),
      Low: Math.round((125 - i*2) * migrationTrend + rand(-10,10))
    },
    "# Customers": {
      High: Math.round((20000 + i*250) * seasonalFactor + rand(-500,500)),
      Medium: Math.round((40000 - i*350) * seasonalFactor + rand(-800,800)),
      Low: Math.round((16000 - i*100) * seasonalFactor + rand(-300,300))
    },
    "Revenue Protected": {
      High: Math.round((125000 + i*4500) * seasonalFactor + rand(-3000,3000)),
      Medium: Math.round((95000 + i*1800) * seasonalFactor + rand(-2500,2500)),
      Low: Math.round((75000 - i*1400) * seasonalFactor + rand(-2000,2000))
    }
  };
})

// Flattened helper arrays for chart rendering
export const trustTierFlat = (metric) => {
  return roiTrustTierByMetric.map((r)=>({
    month:r.month,
    High:r[metric]?.High??0,
    Medium:r[metric]?.Medium??0,
    Low:r[metric]?.Low??0
  }));
};

// ----- Topline ROI summary (sparklines + benchmarks) -----
export const roiSummary = {
  total: 437000,
  growth: 265000,
  protection: 200000,
  efficiency: 145000,
  months: Array.from({ length: 12 }).map((_, i) => ({
    month: MONTHS[i],
    // realistic variability
    growth: 22000 + Math.sin(i / 1.4) * 4000 + seededRandom() * 2000,
    protection: 18000 + Math.cos(i / 1.7) * 3500 + seededRandom() * 1500,
    efficiency: 13000 + Math.sin(i / 1.2) * 2500 + seededRandom() * 1000
  })),
  benchmarks: {
    growth: { value: 0.07, label: "+7% vs industry" },
    protection: { value: 0.05, label: "+5% vs industry" },
    efficiency: { value: 0.03, label: "+3% vs industry" }
  }
};

// ----------------------------------------------
// BREAKDOWN: 12-month stacked ROI + drill-ins
// ----------------------------------------------
export const roiBreakdown12m = Array.from({ length: 12 }).map((_, i) => ({
  month: MONTHS[i],
  Growth: 80000 + Math.sin(i / 1.25) * 9000 + (i % 3 === 0 ? 11000 : 0) + seededRandom() * 3500,
  Protection: 65000 + Math.cos(i / 1.5) * 7000 + (i % 2 === 0 ? 8500 : 0) + seededRandom() * 2500,
  Efficiency: 48000 + Math.sin(i / 1.1) * 5000 + (i === 11 ? 12000 : 0) + seededRandom() * 1800,
  // Detailed drill-ins per month
  methods: [
    { name: "Forced Boxless", type: "Protection", value: 18000, impact: "↓ Fraud via in-network verification" },
    { name: "KTI Denial (Low Trust)", type: "Protection", value: 15000, impact: "↓ Leakage, ↓ Abuse" },
    { name: "FTID Detection", type: "Protection", value: 12000, impact: "↓ Exposure, ↑ Accuracy" },
    { name: "Blocklist", type: "Protection", value: 10000, impact: "↓ Repeat Fraud" },
    { name: "Delayed Refund (Inspection)", type: "Protection", value: 20000, impact: "↓ Fraud Loss" },
    { name: "Early Refund at Scan", type: "Growth", value: 22000, impact: "↑ LTV / RPR, ↑ NPS" },
    { name: "KTI (High Trust)", type: "Efficiency", value: 15000, impact: "↓ COGS + Ship, ↑ CX" }
  ],
  trustTiers: [
    { tier: "High", roi: 125000, customers: 20000, returns: 22000, avgReturn: 68, avgLtv: 1247 },
    { tier: "Medium", roi: 95000, customers: 40000, returns: 56000, avgReturn: 55, avgLtv: 425 },
    { tier: "Low", roi: 75000, customers: 16000, returns: 54000, avgReturn: 48, avgLtv: 127 }
  ]
}));

// ----- 12-month stacked ROI breakdown (Growth / Protection / Efficiency) -----
export const roiBreakdown = Array.from({ length: 12 }).map((_, i) => ({
  month: MONTHS[i],
  Growth: 80000 + Math.sin(i / 1.2) * 9000 + (i % 3 === 0 ? 10000 : 0) + Math.random() * 3000,
  Protection: 65000 + Math.cos(i / 1.5) * 6000 + (i % 2 === 0 ? 8000 : 0) + Math.random() * 2500,
  Efficiency: 48000 + Math.sin(i / 1.1) * 4000 + (i === 11 ? 12000 : 0) + Math.random() * 1800
}));

// quick context to show on stacked bar drill-ins
export const roiDriversByMonth = Object.fromEntries(
  MONTHS.map((m, i) => [
    m,
    {
      month: m,
      summary: `Total ROI ${(roiBreakdown[i].Growth + roiBreakdown[i].Protection + roiBreakdown[i].Efficiency)
        .toLocaleString()}`,
      growthTop: "Early Refund (+$15K)",
      protectionTop: i % 2 === 0 ? "Inspection (+$8K)" : "FTID (+$7K)",
      efficiencyTop: "KTI (+$6K)"
    }
  ])
);

// ----- Trust tiers (for contextual table / narratives) -----
export const trustTiers = [
  {
    tier: "High",
    roi: 125000,
    customers: 20000,
    returns: 22000,
    avgReturnAmount: 68,
    avgLtv: 1247,
    fraudRate: 0.8,
    ltvLift: 0.15,
    trustScore: 0.9
  },
  {
    tier: "Medium",
    roi: 95000,
    customers: 40000,
    returns: 56000,
    avgReturnAmount: 55,
    avgLtv: 425,
    fraudRate: 1.6,
    ltvLift: 0.08,
    trustScore: 0.6
  },
  {
    tier: "Low",
    roi: 75000,
    customers: 16000,
    returns: 54000,
    avgReturnAmount: 48,
    avgLtv: 127,
    fraudRate: 5.5,
    ltvLift: 0.02,
    trustScore: 0.3
  }
];

// ----- Use-case data (cards) with volatility, benchmarks, and impact metrics -----
export const useCaseData = [
  {
    key: "early_refund",
    name: "Early Refund at Scan",
    pillar: "Growth",
    valueType: "Growth",
    roi: 175000,
    lift: 12,
    opportunity: 25000,
    trust: "High",
    benchmarkDelta: "+3% vs industry",
    description:
      "Rewards high-trust customers with instant refunds to drive loyalty, repeat purchase rate, and NPS.",
    optimization: "Expand Early Refund to medium-trust cohort (+$45K projected).",
    impactMetrics: [
      { label: "Repeat Purchase Rate", value: "+18%" },
      { label: "LTV Lift", value: "+12%" },
      { label: "Refund Time Reduction", value: "-2.4 days" }
    ],
    series: MONTHS.map((m, i) => ({
      month: m,
      ROI: 15000 + Math.sin(i / 1.4) * 2000 + seededRandom() * 1500
    }))
  },
  {
    key: "inspection_delay",
    name: "Delayed Refund upon Inspection",
    pillar: "Protection",
    valueType: "Protection",
    roi: 125000,
    lift: 9,
    opportunity: 30000,
    trust: "Low",
    benchmarkDelta: "+5% vs industry",
    description:
      "Targets high-risk returns for inspection to prevent loss and reduce false refunds.",
    optimization: "Expand inspection threshold to 12% of returns (+$60K savings).",
    impactMetrics: [
      { label: "Fraud Prevention Success Rate", value: "82%" },
      { label: "Avg Loss Avoided per Return", value: "$75" },
      { label: "False Positive Rate", value: "3.5%" }
    ],
    series: MONTHS.map((m, i) => ({
      month: m,
      ROI: 9000 + Math.cos(i / 1.6) * 2500 + seededRandom() * 1200
    }))
  },
  {
    key: "kti",
    name: "Keep-the-Item (KTI)",
    pillar: "Efficiency",
    valueType: "Efficiency",
    roi: 95000,
    lift: 7,
    opportunity: 18000,
    trust: "Medium",
    benchmarkDelta: "+2% vs industry",
    description:
      "Avoids COGS + shipping while improving CX; denying KTI to low-trust curbs abuse long-term.",
    optimization: "Raise KTI threshold from $30 → $40 to capture additional cost savings.",
    impactMetrics: [
      { label: "COGS Saved", value: "$24K" },
      { label: "Shipping Cost Saved", value: "$7K" },
      { label: "Customer Abandonment Rate", value: "11%" }
    ],
    series: MONTHS.map((m, i) => ({
      month: m,
      ROI: 7000 + Math.sin(i / 1.1) * 1800 + seededRandom() * 1000
    }))
  },
  {
    key: "boxless",
    name: "Boxless Enforcement",
    pillar: "Protection",
    valueType: "Protection",
    roi: 75000,
    lift: 8,
    opportunity: 20000,
    trust: "Low",
    benchmarkDelta: "-2% vs industry",
    description:
      "Routes risky returns to in-network verification to reduce FTID and item-switching.",
    optimization: "Adjust boxless routing for mid-risk segments to reduce exposure.",
    impactMetrics: [
      { label: "Deflected Returns", value: "2,400" },
      { label: "Refunds Saved", value: "$45K" },
      { label: "Abandonment Rate", value: "6%" }
    ],
    series: MONTHS.map((m, i) => ({
      month: m,
      ROI: 6000 + Math.sin(i / 1.3) * 2000 + seededRandom() * 1500
    }))
  },
  {
    key: "ftid",
    name: "FTID Detection",
    pillar: "Protection",
    valueType: "Protection",
    roi: 60000,
    lift: 6,
    opportunity: 10000,
    trust: "Low",
    benchmarkDelta: "+4% vs industry",
    description:
      "Detects fraudulent tracking IDs / reused labels to prevent refund scams.",
    optimization: "Expand label validation rules for repeat offenders.",
    impactMetrics: [
      { label: "FTID Fraud Prevented", value: "$58K" },
      { label: "Detection Accuracy", value: "94%" },
      { label: "Abandonment Rate", value: "3%" }
    ],
    series: MONTHS.map((m, i) => ({
      month: m,
      ROI: 4500 + Math.cos(i / 1.5) * 1500 + seededRandom() * 800
    }))
  }
];
