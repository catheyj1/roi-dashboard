import React from "react";
import { motion } from "framer-motion";

export default function OverviewExpandedDetail({ item, onClose }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mt-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">
          {item.title} — Detailed Breakdown
        </h3>
        <button
          onClick={onClose}
          className="text-sm text-blue-600 hover:underline"
        >
          Close
        </button>
      </div>

      <p className="text-sm text-gray-700 mb-4">{item.description}</p>
      <p className="text-xs text-gray-500 mb-4">
        Benchmark {item.benchmark} • Top Driver {item.topDriver}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {item.contributors.map((c) => (
          <motion.div
            key={c.name}
            whileHover={{ scale: 1.02 }}
            className="bg-gray-50 border border-gray-200 rounded-md p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">{c.icon}</span>
              <span className="text-[11px] text-gray-500">{c.type}</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">{c.name}</p>
            <p className="text-xs text-gray-600 mt-1">
              ${c.value.toLocaleString()} • {c.impact}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
