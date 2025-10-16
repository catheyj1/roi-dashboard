import React from "react";
import { useCaseData } from "../data/mockData";
import UseCaseExpandableCard from "./UseCaseExpandableCard";

export default function UseCaseExpandedGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {useCaseData.map((uc) => (
        <UseCaseExpandableCard key={uc.key} useCase={uc} />
      ))}
    </div>
  );
}
