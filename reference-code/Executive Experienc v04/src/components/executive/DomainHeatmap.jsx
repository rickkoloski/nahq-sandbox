import React, { useMemo, useState } from 'react';

const ROLE_TARGETS = {
  'Core Quality': 2.2,
  'Clinical Quality Bridge': 2.0,
  'D&T Clinical Support': 1.8,
  'Frontline Care Delivery': 1.7,
  'Senior Leadership': 2.3,
  'Ancillary & Operational Support': 1.6,
};

function cellStyle(pct) {
  if (pct === null) return { bg: '#F3F4F6', text: '#9CA3AF', label: '—' };
  if (pct >= 80) return { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' };
  if (pct >= 60) return { bg: '#FEF9C3', text: '#713F12', border: '#FDE047' };
  if (pct >= 40) return { bg: '#FFEDD5', text: '#7C2D12', border: '#FDB97D' };
  return { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' };
}

export default function DomainHeatmap({ competencies, users, selectedSites }) {
  const [tooltip, setTooltip] = useState(null);

  const allSites = useMemo(() => [...new Set(users.map(u => u.site))].sort(), [users]);
  const allComps = useMemo(() => competencies.map(c => c.name), [competencies]);

  const showAllSites = !selectedSites || selectedSites.length === 0;
  const filteredSites = useMemo(() => {
    if (showAllSites) return allSites;
    return allSites.filter(s => selectedSites.includes(s));
  }, [allSites, selectedSites, showAllSites]);

  // Build matrix: site (rows) × competency (columns) → { met, total, pct }
  const matrix = useMemo(() => {
    const m = {};
    m['All Sites'] = {};
    allComps.forEach(comp => {
      const compUsers = users.filter(u => competencies.find(c => c.name === comp && c.users.includes(u)));
      if (compUsers.length === 0) {
        m['All Sites'][comp] = null;
      } else {
        const met = compUsers.filter(u => u.score >= (ROLE_TARGETS[u.role] || 2.0)).length;
        m['All Sites'][comp] = {
          pct: Math.round((met / compUsers.length) * 100),
          met,
          total: compUsers.length,
          avgScore: parseFloat((compUsers.reduce((s, u) => s + u.score, 0) / compUsers.length).toFixed(1)),
          avgDist: parseFloat((compUsers.reduce((d, u) => d + Math.max(0, (ROLE_TARGETS[u.role] || 2.0) - u.score), 0) / compUsers.length).toFixed(2)),
        };
      }
    });
    allSites.forEach(site => {
      m[site] = {};
      allComps.forEach(comp => {
        const compUsers = users.filter(u => u.site === site && competencies.find(c => c.name === comp && c.users.includes(u)));
        if (compUsers.length === 0) {
          m[site][comp] = null;
        } else {
          const met = compUsers.filter(u => u.score >= (ROLE_TARGETS[u.role] || 2.0)).length;
          m[site][comp] = {
            pct: Math.round((met / compUsers.length) * 100),
            met,
            total: compUsers.length,
            avgScore: parseFloat((compUsers.reduce((s, u) => s + u.score, 0) / compUsers.length).toFixed(1)),
            avgDist: parseFloat((compUsers.reduce((d, u) => d + Math.max(0, (ROLE_TARGETS[u.role] || 2.0) - u.score), 0) / compUsers.length).toFixed(2)),
          };
        }
      });
    });
    return m;
  }, [allSites, allComps, users, competencies]);

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-gray-200">
        <h3 className="text-sm font-bold text-[#3D3D3D] mb-2">Domain Heatmap</h3>
        <p className="text-xs text-gray-400 mb-3">% of individuals meeting their role target · by site and competency</p>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { label: '≥80%', bg: '#D1FAE5', text: '#065F46' },
            { label: '60–79%', bg: '#FEF9C3', text: '#713F12' },
            { label: '40–59%', bg: '#FFEDD5', text: '#7C2D12' },
            { label: '<40%', bg: '#FEE2E2', text: '#991B1B' },
          ].map(({ label, bg, text }) => (
            <div key={label} className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: bg }} />
              <span className="text-[10px] text-gray-500">{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0 bg-gray-200" />
            <span className="text-[10px] text-gray-500">No data</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        {filteredSites.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No sites match the current filter</p>
        ) : (
          <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: !showAllSites && filteredSites.length > 15 ? '480px' : undefined }}>
            <table className="w-full border-separate" style={{ borderSpacing: '2px' }}>
              <thead className="sticky top-0 bg-white z-10">
                <tr>
                  <th className="text-left pb-2 pr-2 sticky left-0 bg-white">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase">Site</span>
                  </th>
                  {allComps.map(comp => (
                    <th key={comp} className="pb-2 px-0.5">
                      <span className="text-[10px] font-semibold text-gray-500 leading-tight block text-center">{comp}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(showAllSites ? ['All Sites'] : filteredSites).map(site => {
                  const rowUsers = site === 'All Sites' ? users : users.filter(u => u.site === site);
                  const rowMet = rowUsers.filter(u => u.score >= (ROLE_TARGETS[u.role] || 2.0)).length;
                  const rowPct = Math.round((rowMet / rowUsers.length) * 100);

                  return (
                    <tr key={site}>
                      <td className="pr-2 py-0 sticky left-0 bg-white">
                        <span className={`text-xs font-semibold whitespace-nowrap ${site === 'All Sites' ? 'text-[#00A3E0]' : 'text-[#3D3D3D]'}`}>{site}</span>
                      </td>
                      {allComps.map(comp => {
                        const cell = matrix[site]?.[comp];
                        if (cell === null || !cell) {
                          return (
                            <td key={comp} className="p-0.5">
                              <div className="rounded-md h-12 flex items-center justify-center bg-gray-100">
                                <span className="text-xs text-gray-300">—</span>
                              </div>
                            </td>
                          );
                        }
                        const s = cellStyle(cell.pct);
                        return (
                          <td key={comp} className="p-0.5 relative">
                            <div
                              className="rounded-md h-12 flex flex-col items-center justify-center cursor-default transition-transform hover:scale-105"
                              style={{ backgroundColor: s.bg, border: `1px solid ${s.border || s.bg}` }}
                              onMouseEnter={() => setTooltip({ site, comp, ...cell })}
                              onMouseLeave={() => setTooltip(null)}
                            >
                              <span className="text-sm font-bold" style={{ color: s.text }}>{cell.pct}%</span>
                              <span className="text-[9px]" style={{ color: s.text, opacity: 0.7 }}>{cell.met}/{cell.total}</span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {tooltip && (
        <div className="px-5 pb-4 text-xs text-gray-600 flex items-center gap-6 flex-wrap">
          <span><strong className="text-[#3D3D3D]">{tooltip.site}</strong> · <strong className="text-[#3D3D3D]">{tooltip.comp}</strong></span>
          <span>Attainment: <strong className="text-[#3D3D3D]">{tooltip.pct}%</strong> ({tooltip.met} of {tooltip.total})</span>
          <span>Avg Score: <strong className="text-[#3D3D3D]">{tooltip.avgScore}</strong></span>
          <span>Avg Distance: <strong className="text-[#3D3D3D]">{tooltip.avgDist}</strong></span>
        </div>
      )}
    </div>
  );
}