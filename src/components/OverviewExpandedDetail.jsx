import React from "react";
import { motion } from "framer-motion";
import { useDarkMode } from "../contexts/DarkModeContext";

export default function OverviewExpandedDetail({ item, onClose }) {
  const { isDarkMode } = useDarkMode();
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 shadow-sm mt-6`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {item.title} — Detailed Breakdown
        </h3>
        <button
          onClick={onClose}
          className="text-sm text-blue-600 hover:underline"
        >
          Close
        </button>
      </div>

      <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.description}</p>
      <p className={`text-xs mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Benchmark {item.benchmark} • Top Driver {item.topDriver}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {item.contributors.map((c) => (
          <motion.div
            key={c.name}
            whileHover={{ scale: 1.02 }}
            className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-md p-4`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">{c.icon}</span>
              <span className={`text-[11px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{c.type}</span>
            </div>
            <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{c.name}</p>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              ${c.value.toLocaleString()} • {c.impact}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
