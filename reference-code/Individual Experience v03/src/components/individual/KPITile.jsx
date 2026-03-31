import React, { useState } from 'react';
import { Info } from 'lucide-react';

export default function KPITile({ icon: Icon, label, value, sub, color = '#00A3E0', badge, tooltip }) {
  const [tipOpen, setTipOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div
          aria-hidden="true"
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon aria-hidden="true" className="w-4 h-4" style={{ color }} />
        </div>
        <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold leading-tight">{label}</p>
        {tooltip && (
          <div className="ml-auto relative flex-shrink-0">
            <button
              type="button"
              aria-label={`More information: ${tooltip}`}
              aria-expanded={tipOpen}
              onMouseEnter={() => setTipOpen(true)}
              onMouseLeave={() => setTipOpen(false)}
              onFocus={() => setTipOpen(true)}
              onBlur={() => setTipOpen(false)}
              className="p-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-1"
            >
              <Info aria-hidden="true" className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition-colors" />
            </button>
            {tipOpen && (
              <div
                role="tooltip"
                className="absolute right-0 top-6 z-30 w-52 bg-gray-900 text-white text-[11px] leading-relaxed rounded-lg px-3 py-2 shadow-lg pointer-events-none"
              >
                {tooltip}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-[#3D3D3D] leading-none">{value}</p>
        {badge && (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: badge.bg, color: badge.text }}
          >
            {badge.label}
          </span>
        )}
      </div>
      {sub && <p className="text-[11px] text-gray-600 mt-1 leading-snug">{sub}</p>}
    </div>
  );
}