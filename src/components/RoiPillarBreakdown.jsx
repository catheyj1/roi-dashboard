import React from "react";

export default function RoiPillarBreakdown({ data }) {
  const colors = {
    Growth: "from-green-50 to-green-100 border-green-200",
    Protection: "from-red-50 to-red-100 border-red-200",
    Efficiency: "from-blue-50 to-blue-100 border-blue-200"
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {["Growth", "Protection", "Efficiency"].map((pillar) => {
        const subset = data.filter((d) => d.pillar === pillar);
        const total = subset.reduce((sum, d) => sum + d.roi, 0);
        const top = subset.sort((a, b) => b.roi - a.roi)[0];
        const percent = ((total / data.reduce((a, b) => a + b.roi, 0)) * 100).toFixed(1);
        return (
          <div
            key={pillar}
            className={`metric-card relative ${colors[pillar]} hover:shadow-lg transition-all duration-200`}
          >
            <div className="card-header">
              <h3 className="text-lg font-bold text-gray-900">{pillar} ROI</h3>
              <div className="text-sm text-gray-500 font-medium">{percent}%</div>
            </div>
            
            <div className="metric-value mb-4">${total.toLocaleString()}</div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Top Driver</span>
                <span className="text-sm font-semibold text-gray-900">{top.name}</span>
              </div>
              
              <div className="text-sm text-gray-600 leading-relaxed">
                {top.description}
              </div>
              
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>View detailed breakdown</span>
                  <span className="text-blue-600 hover:text-blue-800 cursor-pointer">→</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
