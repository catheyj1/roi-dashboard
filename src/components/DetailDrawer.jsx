import React from "react";

export default function DetailDrawer({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="ml-auto h-full w-full max-w-lg bg-white shadow-2xl border-l border-gray-200 p-5 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-sm">Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}
