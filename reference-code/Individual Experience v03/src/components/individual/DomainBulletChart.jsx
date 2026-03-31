import React from 'react';

// Neutral gray-tone bands — low contrast, subtle visual guides
const BANDS = [
  { from: 0, to: 1, color: '#F8FAFB', label: 'Foundational' },
  { from: 1, to: 2, color: '#F0F4F6', label: 'Proficient'   },
  { from: 2, to: 3, color: '#E7EDF0', label: 'Advanced'     },
];

const DOMAIN_MAX = 3;

// Color the gap pill based on how large the gap is
function gapPillStyle(gap) {
  if (gap <= 0)    return { bg: '#D1FAE5', text: '#065F46' }; // green — met
  if (gap <= 0.4)  return { bg: '#FEF3C7', text: '#92400E' }; // yellow — small gap
  return               { bg: '#FEE2E2', text: '#991B1B' };     // red — large gap
}

export default function DomainBulletChart({ domainProfile, singleDomainView = false }) {
  return (
    <div className="space-y-3">
      {/* Legend — hidden in single domain view */}
      {!singleDomainView && (
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-10 h-3 rounded-sm" style={{ background: 'linear-gradient(90deg, #9C0070, #2D2D7F)' }} />
          <span className="text-[10px] text-gray-500 font-semibold">Your Score</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-0.5 h-4 bg-gray-800" />
          <span className="text-[10px] text-gray-500 font-semibold">NAHQ Role Target (per domain)</span>
        </div>
        <div className="flex items-center gap-3 ml-auto text-[10px] text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#F8FAFB', border: '1px solid #D1D9DD' }} />Foundational</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#F0F4F6', border: '1px solid #D1D9DD' }} />Proficient</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#E7EDF0', border: '1px solid #C0CDD3' }} />Advanced</span>
        </div>
      </div>
      )}

      {domainProfile.map((domain) => {
        const target    = domain.roleTarget ?? 2.0;
        const avgLevel  = domain.overrideAvgLevel ?? domain.avgLevel;
        const scorePct  = (avgLevel / DOMAIN_MAX) * 100;
        const targetPct = (target / DOMAIN_MAX) * 100;
        const gap       = parseFloat((target - avgLevel).toFixed(1));
        const pill      = gapPillStyle(gap);

        return (
          <div key={domain.slug} className="flex items-center gap-3">
            {/* Domain label — hidden in single domain view */}
            {!singleDomainView && (
            <div className="w-44 flex-shrink-0 text-right">
              <span className="text-[11px] font-semibold text-[#3D3D3D] leading-snug block truncate">{domain.name}</span>
            </div>
            )}

            {/* Bullet bar */}
            <div className="flex-1 relative h-6 rounded overflow-hidden flex border border-slate-200">
              {/* Qualitative bands */}
              {BANDS.map(b => (
                <div
                  key={b.label}
                  className="h-full flex-shrink-0"
                  style={{ width: `${((b.to - b.from) / DOMAIN_MAX) * 100}%`, backgroundColor: b.color }}
                />
              ))}

              {/* Your score bar — centered vertically */}
              <div
                className="absolute top-1/2 -translate-y-1/2 rounded"
                style={{
                  left: 0,
                  width: `${scorePct}%`,
                  height: '42%',
                  backgroundColor: domain.color,
                  minWidth: 4,
                }}
              />

              {/* NAHQ target marker */}
              <div
                className="absolute top-0 h-full"
                style={{
                  left: `${targetPct}%`,
                  width: 2.5,
                  backgroundColor: '#00A3E0',
                  transform: 'translateX(-50%)',
                  boxShadow: '0 0 0 1px rgba(0,163,224,0.25)',
                }}
              >
                {/* Top tick */}
                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 6, height: 3, backgroundColor: '#00A3E0', borderRadius: '0 0 2px 2px' }} />
                {/* Bottom tick */}
                <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 6, height: 3, backgroundColor: '#00A3E0', borderRadius: '2px 2px 0 0' }} />
              </div>
            </div>

            {/* Score + gap pill */}
            <div className="w-24 flex-shrink-0 flex items-center gap-1.5">
              <span className="text-sm font-bold text-[#3D3D3D]">{avgLevel.toFixed(1)}</span>
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: pill.bg, color: pill.text }}
              >
                {gap <= 0 ? '✓ Met' : `↑${gap.toFixed(1)}`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}