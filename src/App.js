import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import RoiDashboardV2 from "./RoiDashboardV2";
import { exportToPDF } from "./utils/pdfExport";
import UseCaseExpandedGrid from "./components/UseCaseExpandedGrid";
import { roiOverview } from "./data/mockData";
import OverviewCardComparative from "./components/OverviewCardComparative";
import RoiBreakdownUseCaseTrust from "./components/RoiBreakdownUseCaseTrust";
import OverviewExpandedDetail from "./components/OverviewExpandedDetail";

// Policy Optimization Card Component
const PolicyOptimizationCard = ({ title, current, target, roi, effort, duration }) => (
  <div className="metric-card">
    <div className="card-header">
      <h4 className="text-lg font-bold text-gray-900">{title}</h4>
      <span className="text-sm text-gray-500 flex items-center gap-1">
        {effort.includes("Low") && "⚡"}
        {effort.includes("Medium") && "🔧"}
        {effort.includes("High") && "🏗"}
        {effort} • {duration}
      </span>
    </div>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Current</span>
        <span className="text-sm font-semibold text-gray-900">{current}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Target</span>
        <span className="text-sm font-semibold text-gray-900">{target}</span>
      </div>
      <div className="pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Est. ROI</span>
          <span className="text-lg font-bold text-green-600">{roi}</span>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  const [dashboardVersion, setDashboardVersion] = useState("v1");
  const [openDetail, setOpenDetail] = useState(null);

  const handleExportPDF = async () => {
    await exportToPDF('v1-dashboard-content', `ROI-Dashboard-V1-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // If V2 is selected, render the simplified dashboard
  if (dashboardVersion === "v2") {
    return <RoiDashboardV2 dashboardVersion={dashboardVersion} setDashboardVersion={setDashboardVersion} />;
  }

  // If V3 is selected, render the interactive dashboard
  if (dashboardVersion === "v3") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">V3 Dashboard Content Not Available</h1>
          <p className="text-lg text-gray-600">Please select V1 or V2 from the dropdown.</p>
          <button
            onClick={() => setDashboardVersion("v1")}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go to V1
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Returns Intelligence ROI Dashboard</h1>
              <p className="text-sm text-gray-600">Tier 1: Descriptive Analytics — "How is Returns Intelligence performing?"</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Version Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Version:</span>
                <select
                  className="border border-gray-200 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                  value={dashboardVersion}
                  onChange={(e) => setDashboardVersion(e.target.value)}
                >
                  <option value="v1">V1 - Claims Style</option>
                  <option value="v2">V2 - Simplified</option>
                  <option value="v3">V3 - Interactive</option>
                </select>
              </div>
              {/* PDF Export Button */}
              <button 
                onClick={handleExportPDF}
                className="btn-primary flex items-center gap-2"
              >
                <span>📄</span>
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN --- */}
      <main id="v1-dashboard-content" className="max-w-7xl mx-auto px-6 py-12 section-spacing">

        {/* ======================= */}
        {/* TIER 1: OVERVIEW */}
        {/* ======================= */}
        <section>
          <h2 className="tier-header mb-1">Tier 1 — ROI Overview</h2>
          <p className="tier-sub">High-level descriptive analytics summarizing ROI impact and distribution across IRIS pillars.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roiOverview.map((it) => (
              <OverviewCardComparative
                key={it.key}
                item={it}
                isOpen={openDetail?.key === it.key}
                onClick={() => setOpenDetail(openDetail?.key === it.key ? null : it)}
              />
            ))}
          </div>
          <AnimatePresence>
            {openDetail && (
              <OverviewExpandedDetail
                item={openDetail}
                onClose={() => setOpenDetail(null)}
              />
            )}
          </AnimatePresence>
        </section>

        <hr className="section-divider" />

        {/* ======================= */}
        {/* TIER 2: DIAGNOSTICS */}
        {/* ======================= */}
        <section>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-6 bg-blue-500 rounded"></div>
            <h2 className="tier-header">Tier 2 — Diagnostic Analytics</h2>
          </div>
          <p className="tier-sub">
            IRIS ROI performance across returns methods, trust tiers, and individual use cases.
          </p>

          <div className="space-y-10">
            <RoiBreakdownUseCaseTrust />
            <UseCaseExpandedGrid />
          </div>
        </section>

        <hr className="section-divider" />

        {/* ======================= */}
        {/* TIER 3: OPTIMIZATION */}
        {/* ======================= */}
        <section>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-6 bg-green-500 rounded"></div>
            <h2 className="tier-header">Tier 3 — Optimization Opportunities</h2>
          </div>
          <p className="tier-sub">Prescriptive recommendations surfaced from ROI variance patterns and IRIS signal analysis.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PolicyOptimizationCard
              title="Relax KTI suppression overlap"
              current="68%"
              target="<40%"
              roi="+$12.4K"
              effort="Low Effort"
              duration="1 week"
            />
            <PolicyOptimizationCard
              title="Adjust Boxless threshold"
              current="12%"
              target="8%"
              roi="+$8.7K"
              effort="Medium Effort"
              duration="2 weeks"
            />
            <PolicyOptimizationCard
              title="Increase IRIS weight in refund timing"
              current="0.3x"
              target="0.6x"
              roi="+$5.3K"
              effort="Low Effort"
              duration="3 days"
            />
          </div>

          {/* Inline summary band */}
          <div className="mt-10 bg-gradient-to-r from-green-600 to-blue-600 text-white p-5 rounded-xl shadow-sm">
            <h3 className="text-sm font-semibold mb-1">Next ROI Unlock Potential</h3>
            <p className="text-sm text-blue-50 leading-snug">
              IRIS has captured <span className="font-bold text-white">55%</span> of total ROI opportunity.
              Expanding Early Refund and optimizing KTI thresholds can deliver another
              <span className="font-bold text-white"> $363K</span> in value.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;