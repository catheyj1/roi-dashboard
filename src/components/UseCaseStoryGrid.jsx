import React from "react";
import { roiUseCases } from "../data/roiUseCases";
import UseCaseStoryCard from "./UseCaseStoryCard";

export default function UseCaseStoryGrid() {
  return (
    <div className="space-y-8">
      {roiUseCases.map((uc, i) => (
        <UseCaseStoryCard key={i} useCase={uc} />
      ))}
    </div>
  );
}
