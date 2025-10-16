// Month labels for the last 12 periods
export const months = Array.from({ length: 12 }).map((_, i) => `M${i + 1}`);

// ROI by method (value expressed in $, aligned to VALUE TYPE)
export const roiByMethodTS = {
  "Early Refund at Scan": { // GROWTH
    valueType: "Growth",
    series: months.map((m, i) => ({ month: m, value: 90000 + i * 3000 + Math.random() * 4000 }))
  },
  "Delayed Refund upon Inspection": { // PROTECTION
    valueType: "Protection",
    series: months.map((m, i) => ({ month: m, value: 65000 + i * 1500 + Math.random() * 3000 }))
  },
  "Block Return / Charge Fee": { // PROTECTION
    valueType: "Protection",
    series: months.map((m, i) => ({ month: m, value: 52000 + i * 1200 + Math.random() * 2500 }))
  },
  "Keep-the-Item (KTI)": { // EFFICIENCY (COGS + ship avoided) + Growth side-effect
    valueType: "Efficiency",
    series: months.map((m, i) => ({ month: m, value: 72000 + i * 1800 + Math.random() * 2500 }))
  },
  "FTID Detection": { // PROTECTION
    valueType: "Protection",
    series: months.map((m, i) => ({ month: m, value: 41000 + i * 1100 + Math.random() * 1500 }))
  }
};

// ROI by trust tier + cohort metrics
export const trustTiersTS = {
  High: {
    series: months.map((m, i) => ({ month: m, roi: 120000 + i * 3500 + Math.random() * 4000 })),
    customers: 18000,
    returns: 22000,
    avgReturnAmount: 68,
    avgLtv: 1247
  },
  Medium: {
    series: months.map((m, i) => ({ month: m, roi: 90000 + i * 1800 + Math.random() * 2500 })),
    customers: 42000,
    returns: 68000,
    avgReturnAmount: 52,
    avgLtv: 425
  },
  Low: {
    series: months.map((m, i) => ({ month: m, roi: 70000 + i * 1400 + Math.random() * 2200 })),
    customers: 16000,
    returns: 56000,
    avgReturnAmount: 49,
    avgLtv: 127
  }
};

// Industry "benchmark" time series (for sparklines/badges)
export const industryBenchmark = {
  totalROI: months.map((m, i) => ({ month: m, value: 340000 + i * 3000 })), // example trend
  growth: 0.08,        // +8% QoQ
  protection: 0.06,    // +6% QoQ
  efficiency: 0.04     // +4% QoQ
};
