import React, { useState, useMemo } from 'react';

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

export default function CompetencyHeatmap({ users, selectedSites }) {
  const [tooltip, setTooltip] = useState(null);

  const allSites = useMemo(() => [...new Set(users.map(u => u.site))].sort(), [users]);
  const roles = useMemo(() => [...new Set(users.map(u => u.role))].sort(), [users]);

  const showAllSites = !selectedSites || selectedSites.length === 0;

  const filteredSites = useMemo(() => {
    if (showAllSites) return allSites;
    return allSites.filter(s => selectedSites.includes(s));
  }, [allSites, selectedSites, showAllSites]);

  // Build matrix: site × role → { met, total }
  const matrix = useMemo(() => {
    const m = {};
    // "All Sites" aggregate row
    m['All Sites'] = {};
    roles.forEach(role => {
      const group = users.filter(u => u.role === role);
      if (group.length === 0) {
        m['All Sites'][role] = null;
      } else {
        const target = ROLE_TARGETS[role] || 2.0;
        const met = group.filter(u => u.score >= target).length;
        m['All Sites'][role] = {
          pct: Math.round((met / group.length) * 100),
          met,
          total: group.length,
          avgScore: parseFloat((group.reduce((s, u) => s + u.score, 0) / group.length).toFixed(1)),
          target,
        };
      }
    });
    allSites.forEach(site => {
      m[site] = {};
      roles.forEach(role => {
        const group = users.filter(u => u.site === site && u.role === role);
        if (group.length === 0) {
          m[site][role] = null;
        } else {
          const target = ROLE_TARGETS[role] || 2.0;
          const met = group.filter(u => u.score >= target).length;
          m[site][role] = {
            pct: Math.round((met / group.length) * 100),
            met,
            total: group.length,
            avgScore: parseFloat((group.reduce((s, u) => s + u.score, 0) / group.length).toFixed(1)),
            target,
          };
        }
      });
    });
    return m;
  }, [allSites, roles, users]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#3D3D3D]">Competency Heatmap</h3>
          <p className="text-xs text-gray-400 mt-0.5">% of individuals meeting their role target · by site and role group</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Legend */}
          {[
            { label: '≥80%', bg: '#D1FAE5', text: '#065F46' },
            { label: '60–79%', bg: '#FEF9C3', text: '#713F12' },
            { label: '40–59%', bg: '#FFEDD5', text: '#7C2D12' },
            { label: '<40%', bg: '#FEE2E2', text: '#991B1B' },
          ].map(({ label, bg, text }) => (
            <div key={label} className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: bg }} />
              <span className="text-[10px] text-gray-500">{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm flex-shrink-0 bg-gray-200" />
            <span className="text-[10px] text-gray-500">No data</span>
          </div>
        </div>
      </div>

      {filteredSites.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No sites match the current filter</p>
      ) : (
        <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: !showAllSites && filteredSites.length > 15 ? '480px' : undefined }}>
          <table className="w-full border-separate" style={{ borderSpacing: '4px' }}>
            <thead className="sticky top-0 bg-white z-10">
              <tr>
                <th className="text-left pb-2 pr-3 min-w-[140px]">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase">Site / Role</span>
                </th>
                {roles.map(role => (
                  <th key={role} className="pb-2 px-1 min-w-[110px]">
                    <span className="text-[10px] font-semibold text-gray-500 leading-tight block text-center">{role}</span>
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
                    <td className="pr-3 py-0">
                      <span className={`text-xs font-semibold whitespace-nowrap ${site === 'All Sites' ? 'text-[#00A3E0]' : 'text-[#3D3D3D]'}`}>{site}</span>
                    </td>
                    {roles.map(role => {
                      const cell = matrix[site]?.[role];
                      if (cell === null || !cell) {
                        return (
                          <td key={role} className="p-0">
                            <div className="rounded-lg h-14 flex items-center justify-center bg-gray-100">
                              <span className="text-xs text-gray-300">—</span>
                            </div>
                          </td>
                        );
                      }
                      const s = cellStyle(cell.pct);
                      return (
                        <td key={role} className="p-0 relative">
                          <div
                            className="rounded-lg h-14 flex flex-col items-center justify-center cursor-default transition-transform hover:scale-105"
                            style={{ backgroundColor: s.bg, border: `1px solid ${s.border || s.bg}` }}
                            onMouseEnter={() => setTooltip({ site, role, ...cell })}
                            onMouseLeave={() => setTooltip(null)}
                          >
                            <span className="text-base font-bold" style={{ color: s.text }}>{cell.pct}%</span>
                            <span className="text-[10px] mt-0.5" style={{ color: s.text, opacity: 0.7 }}>{cell.met}/{cell.total} met</span>
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

      {/* Tooltip */}
      {tooltip && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600 flex items-center gap-6 flex-wrap">
          <span><strong className="text-[#3D3D3D]">{tooltip.site}</strong> · <strong className="text-[#3D3D3D]">{tooltip.role}</strong></span>
          <span>Attainment: <strong className="text-[#3D3D3D]">{tooltip.pct}%</strong> ({tooltip.met} of {tooltip.total})</span>
          <span>Avg Score: <strong className="text-[#3D3D3D]">{tooltip.avgScore}</strong></span>
          <span>Role Target: <strong className="text-[#3D3D3D]">{tooltip.target?.toFixed(1)}</strong></span>
        </div>
      )}
    </div>
  );
}