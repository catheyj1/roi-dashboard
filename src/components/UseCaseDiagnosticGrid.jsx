import React from "react";
import { roiUseCases } from "../data/roiUseCases";
import UseCaseDiagnosticCard from "./UseCaseDiagnosticCard";

export default function UseCaseDiagnosticGrid() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-900">
          Use Case Performance Over Time
        </h3>
        <p className="text-xs text-gray-500">
          ROI and opportunity trends by IRIS decisioning area.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {roiUseCases.map((uc) => (
          <UseCaseDiagnosticCard key={uc.name} useCase={uc} />
        ))}
      </div>
    </div>
  );
}
