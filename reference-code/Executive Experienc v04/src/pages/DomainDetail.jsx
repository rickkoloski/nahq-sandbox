import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Target, BookOpen, ArrowLeft, Info, Search, ChevronDown, X, Filter, TrendingUp, BarChart2, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import FloatingChatButton from '@/components/shared/FloatingChatButton';
import { createPageUrl } from '@/utils';
import Header from '@/components/shared/Header';
import DomainCompetencyPanel from '@/components/executive/DomainCompetencyPanel';
import ExecutiveAIChat from '@/components/executive/ExecutiveAIChat';
import { ROLE_TARGETS, DOMAIN_COLORS, COMPETENCY_DATA, computeMetrics, getUniqueUsers } from '@/components/shared/workforceData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import AISummaryCard from '@/components/shared/AISummaryCard';

// Build DOMAIN_DATA from shared source
const DOMAIN_DATA = Object.fromEntries(
  Object.entries(COMPETENCY_DATA).map(([name, competencies]) => [
    name,
    { color: DOMAIN_COLORS[name] || '#00A3E0', competencies },
  ])
);

function seedVal(name, min, max) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return min + (Math.abs(h) % (max - min + 1));
}

function MiniDistBar({ users }) {
  if (!users.length) return null;
  let na = 0, foundational = 0, proficient = 0, advanced = 0;
  users.forEach(u => {
    if (u.score < 1.5) na++;
    else if (u.score < 2.3) foundational++;
    else if (u.score < 2.75) proficient++;
    else advanced++;
  });
  const total = users.length;
  const segs = [
    { label: 'N/R', pct: Math.round((na / total) * 100), color: '#D0D5DD', count: na },
    { label: 'Found.', pct: Math.round((foundational / total) * 100), color: '#FFD400', count: foundational },
    { label: 'Prof.', pct: Math.round((proficient / total) * 100), color: '#12B76A', count: proficient },
    { label: 'Adv.', pct: Math.round((advanced / total) * 100), color: '#2E90FA', count: advanced },
  ].filter(s => s.pct > 0);
  return (
    <div>
      <div
        role="img"
        aria-label={`Proficiency distribution: ${segs.map(s => `${s.label} ${s.pct}%`).join(', ')}`}
        className="flex h-2.5 w-full rounded-full overflow-hidden gap-px"
      >
        {segs.map((s, i) => (
          <div key={i} style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
        ))}
      </div>
      <div className="flex gap-3 mt-1.5" aria-hidden="true">
        {segs.map((s, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-[9px] text-gray-600">{s.label} {s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}



function CompetencyRow({ competency, users, domainColor, domainName, onOpenPanel }) {
  const navigate = useNavigate();

  // Deduplicate by name
  const uniqueByName = Object.values(users.reduce((acc, u) => { if (!acc[u.name]) acc[u.name] = u; return acc; }, {}));

  // Mini metrics
  const avgScore = uniqueByName.length > 0
    ? parseFloat((uniqueByName.reduce((s, u) => s + u.score, 0) / uniqueByName.length).toFixed(2)) : 0;
  const avgTarget = uniqueByName.length > 0
    ? parseFloat((uniqueByName.reduce((s, u) => s + (ROLE_TARGETS[u.role] || 2.0), 0) / uniqueByName.length).toFixed(2)) : 0;
  const avgDist = parseFloat(Math.max(0, avgTarget - avgScore).toFixed(2));
  const advancedCount = uniqueByName.filter(u => u.score >= 2.75).length;
  const advancedPct = uniqueByName.length > 0 ? Math.round((advancedCount / uniqueByName.length) * 100) : 0;

  const handleCardClick = () => {
    navigate(createPageUrl(`CompetencyDetail?domain=${encodeURIComponent(domainName)}&competency=${encodeURIComponent(competency)}`));
  };

  const handleInfoClick = (e) => {
    e.stopPropagation();
    onOpenPanel('competency', competency);
  };

  return (
    <button
      className="w-full border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-gray-300 transition-all text-left group"
      onClick={handleCardClick}
      aria-label={`View competency details for ${competency}`}
    >
      <div className="px-5 py-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#3D3D3D] truncate">{competency}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={handleInfoClick} className="p-0.5 hover:bg-gray-100 rounded transition-colors text-gray-500 hover:text-[#00A3E0]" aria-label={`View framework details for ${competency}`}>
              <Info className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#00A3E0] transition-colors" aria-hidden="true" />
          </div>
        </div>

        {/* Metrics row */}
        <div className="flex items-center gap-4 mb-3">
          <div>
            <p className="text-[9px] uppercase tracking-wide text-gray-500 font-semibold mb-0.5">Avg Results</p>
            <p className="text-lg font-bold text-[#3D3D3D] leading-none">{avgScore.toFixed(2)}</p>
          </div>
          <div className="w-px h-8 bg-gray-200 flex-shrink-0" aria-hidden="true" />
          <div>
            <p className="text-[9px] uppercase tracking-wide text-gray-500 font-semibold mb-0.5">National Avg Comparison</p>
            <p className="text-lg font-bold text-[#3D3D3D] leading-none">
              {avgDist > 0 ? `-${avgDist.toFixed(2)}` : '0.00'}
            </p>
          </div>
          <div className="w-px h-8 bg-gray-200 flex-shrink-0" aria-hidden="true" />
          <div>
            <p className="text-[9px] uppercase tracking-wide text-gray-500 font-semibold mb-0.5">% Not Responsible</p>
            <p className="text-lg font-bold text-[#3D3D3D] leading-none">{advancedPct}%</p>
          </div>
        </div>

        {/* Distribution bar */}
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Proficiency Distribution</p>
          <MiniDistBar users={uniqueByName} />
        </div>
      </div>
    </button>
  );
}

function CompetencyDistributionChart({ competencies, activeSites }) {
  const chartData = competencies.map(comp => {
    const users = comp.users.filter(u => activeSites.includes(u.site));
    if (!users.length) return null;
    let na = 0, foundational = 0, proficient = 0, advanced = 0;
    users.forEach(u => {
      if (u.score < 1.5) na++;
      else if (u.score < 2.3) foundational++;
      else if (u.score < 2.75) proficient++;
      else advanced++;
    });
    const total = users.length;
    return {
      name: comp.name.length > 28 ? comp.name.substring(0, 28) + '…' : comp.name,
      fullName: comp.name,
      'Not Responsible': Math.round((na / total) * 100),
      'Foundational': Math.round((foundational / total) * 100),
      'Proficient': Math.round((proficient / total) * 100),
      'Advanced': Math.round((advanced / total) * 100),
    };
  }).filter(Boolean);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-lg text-xs">
        <p className="font-semibold text-gray-800 mb-1.5">{d?.fullName || label}</p>
        {payload.map((entry) => (
          <p key={entry.name} style={{ color: entry.fill === '#D0D5DD' ? '#6B7280' : entry.fill }} className="leading-5 font-medium">
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    );
  };

  const [showInfoTooltip, setShowInfoTooltip] = React.useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
     <div className="flex items-start justify-between gap-3 mb-1">
     <div className="flex items-center gap-2">
       <BarChart2 className="w-4 h-4 text-[#00A3E0]" aria-hidden="true" />
       <h3 className="text-sm font-bold text-[#3D3D3D]">Competency Level of Work Distribution</h3>
     </div>
     <div className="relative flex-shrink-0">
       <button
         onMouseEnter={() => setShowInfoTooltip(true)}
         onMouseLeave={() => setShowInfoTooltip(false)}
         onFocus={() => setShowInfoTooltip(true)}
         onBlur={() => setShowInfoTooltip(false)}
         className="text-gray-500 hover:text-[#00A3E0] transition-colors"
         aria-label="About this chart"
         aria-describedby={showInfoTooltip ? 'dist-chart-tooltip' : undefined}
       >
         <Info className="w-4 h-4" aria-hidden="true" />
       </button>
       {showInfoTooltip && (
         <div id="dist-chart-tooltip" role="tooltip" className="absolute right-0 top-full mt-2 z-30 w-64 bg-[#3D3D3D] text-white text-xs rounded-lg px-3 py-2.5 shadow-xl leading-relaxed pointer-events-none">
           Distribution of self-assessed levels of work for each competency within the selected view.
           <div className="absolute -top-1.5 right-3 w-3 h-3 bg-[#3D3D3D] rotate-45" aria-hidden="true" />
         </div>
       )}
     </div>
     </div>
     <p className="text-xs text-gray-600 mb-4">Self-assessed proficiency levels per competency (% of participants).</p>

      <ResponsiveContainer width="100%" height={chartData.length * 36 + 40}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
          barSize={18}
        >
          <CartesianGrid horizontal={false} stroke="#F0F0F0" />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={v => `${v}%`}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={180}
            tick={{ fontSize: 11, fill: '#3D3D3D' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
          <Bar dataKey="Not Responsible" stackId="a" fill="#D0D5DD" isAnimationActive={false} />
          <Bar dataKey="Foundational" stackId="a" fill="#FFD400" isAnimationActive={false} />
          <Bar dataKey="Proficient" stackId="a" fill="#12B76A" isAnimationActive={false} />
          <Bar dataKey="Advanced" stackId="a" fill="#2E90FA" isAnimationActive={false} radius={[0, 3, 3, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 pt-2 border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-700 mb-2" aria-hidden="true">Selected Level</p>
        <div className="flex flex-wrap gap-3 text-xs text-gray-600">
          {[['#D0D5DD', '0=Not Responsible'], ['#FFD400', '1=Foundational'], ['#12B76A', '2=Proficient'], ['#2E90FA', '3=Advanced']].map(([color, label]) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} aria-hidden="true" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, sub, color = '#00A3E0', tooltip }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipId = `tooltip-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 relative">
      {tooltip && (
        <div className="absolute top-3 right-3">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            className="text-gray-500 hover:text-[#00A3E0] transition-colors"
            aria-label={`About ${label}`}
            aria-describedby={showTooltip ? tooltipId : undefined}
          >
            <Info className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          {showTooltip && (
            <div id={tooltipId} role="tooltip" className="absolute right-0 top-full mt-2 z-30 w-60 bg-[#3D3D3D] text-white text-xs rounded-lg px-3 py-2.5 shadow-xl leading-relaxed pointer-events-none">
              {tooltip}
              <div className="absolute -top-1.5 right-3 w-3 h-3 bg-[#3D3D3D] rotate-45" aria-hidden="true" />
            </div>
          )}
        </div>
      )}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-4 h-4" style={{ color }} aria-hidden="true" />
        </div>
        <p className="text-[10px] text-gray-600 uppercase tracking-wide font-medium leading-tight pr-5">{label}</p>
      </div>
      <p className="text-2xl font-bold text-[#3D3D3D]">{value}</p>
      {sub && <p className="text-[11px] text-gray-600 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function DomainDetail() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const params = new URLSearchParams(window.location.search);
  const domainName = params.get('domain') || 'Professional Engagement';
  
  const domainInfo = DOMAIN_DATA[domainName] || DOMAIN_DATA['Professional Engagement'];
  const domainColor = domainInfo.color;
  const domainComps = domainInfo.competencies || [];

  // Aggregate all users across all competencies in this domain
  const allUsers = domainComps.reduce((acc, comp) => [...acc, ...comp.users], []);
  const allSiteNamesRaw = useMemo(() => {
    const s = new Set(allUsers.map(u => u.site));
    return [...s].sort();
  }, [allUsers]);

  const [selectedSites, setSelectedSites] = useState([]);
  const [siteFilterSearch, setSiteFilterSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  const activeSites = selectedSites.length === 0 ? allSiteNamesRaw : selectedSites;

  const toggleSite = (site) => {
    setSelectedSites(prev => prev.includes(site) ? prev.filter(s => s !== site) : [...prev, site]);
  };
  const clearSites = () => { setSelectedSites([]); setSiteFilterSearch(''); };

  const dropdownSites = useMemo(() => {
    if (!siteFilterSearch.trim()) return allSiteNamesRaw;
    return allSiteNamesRaw.filter(s => s.toLowerCase().includes(siteFilterSearch.toLowerCase()));
  }, [allSiteNamesRaw, siteFilterSearch]);

  // Filtered versions of users based on activeSites
  const filteredAllUsers = useMemo(() => allUsers.filter(u => activeSites.includes(u.site)), [activeSites]);
  const filteredUniqueUsers = useMemo(() => {
    const byName = {};
    filteredAllUsers.forEach(u => { if (!byName[u.name]) byName[u.name] = u; });
    return Object.values(byName);
  }, [filteredAllUsers]);

  const { readiness, avgDist, metCount } = computeMetrics(filteredUniqueUsers);
  const avgScore = filteredUniqueUsers.length > 0
    ? parseFloat((filteredUniqueUsers.reduce((s, u) => s + u.score, 0) / filteredUniqueUsers.length).toFixed(2)) : 0;
  const nahqStandardTarget = filteredUniqueUsers.length > 0
    ? parseFloat((filteredUniqueUsers.reduce((s, u) => s + (ROLE_TARGETS[u.role] || 2.0), 0) / filteredUniqueUsers.length).toFixed(2)) : 0;
  const notResponsibleCount = filteredUniqueUsers.filter(u => u.score < 1.5).length;
  const pctNotResponsible = filteredUniqueUsers.length > 0 ? Math.round((notResponsibleCount / filteredUniqueUsers.length) * 100) : 0;

  const critCount = filteredUniqueUsers.filter(u => {
    const target = ROLE_TARGETS[u.role] || 2.0;
    return Math.round((u.score / target) * 100) < 90;
  }).length;
  const bySite = filteredAllUsers.reduce((acc, u) => { if (!acc[u.site]) acc[u.site] = []; acc[u.site].push(u); return acc; }, {});

  const [panelOpen, setPanelOpen] = useState(false);
  const [panelType, setPanelType] = useState(null);
  const [panelName, setPanelName] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInitialSummary, setChatInitialSummary] = useState('');

  const handleOpenPanel = (type, name) => {
    setPanelType(type);
    setPanelName(name);
    setPanelOpen(true);
  };

  const handleChatOpen = (summary) => {
    setChatInitialSummary(summary);
    setChatOpen(true);
  };

  const aiPrompt = useMemo(() => {
    const compStats = domainComps.map(comp => {
      const compUsers = comp.users.filter(u => activeSites.includes(u.site));
      const unique = Object.values(compUsers.reduce((acc, u) => { if (!acc[u.name]) acc[u.name] = u; return acc; }, {}));
      if (!unique.length) return null;
      const avg = parseFloat((unique.reduce((s, u) => s + u.score, 0) / unique.length).toFixed(2));
      const target = parseFloat((unique.reduce((s, u) => s + (ROLE_TARGETS[u.role] || 2.0), 0) / unique.length).toFixed(2));
      const dist = Math.max(0, target - avg).toFixed(2);
      const pctAdv = Math.round((unique.filter(u => u.score >= 2.75).length / unique.length) * 100);
      return { competency: comp.name, avgScore: avg, nahqTarget: target, distToStandard: dist, pctAdvanced: pctAdv, participants: unique.length };
    }).filter(Boolean);

    return `You are a senior healthcare quality workforce strategist writing for a C-suite executive audience.

Using the competency-level self-assessment data below for the "${domainName}" domain, write an executive summary as exactly 4–5 concise bullet points.

Guidelines:
- Each bullet should be one crisp sentence (max 30 words) capturing a distinct insight.
- Focus on patterns, contrasts, and capability composition across competencies — not individual scores.
- Avoid repeating specific numeric values already visible in the page. Use relative language (e.g., "highest leadership density," "narrowest gap to standard," "most evenly distributed").
- Do not use alarmist, evaluative, or prescriptive language. No "critical gaps," "alarming," "must," or recommendations.
- Frame insights around: where capability strength is concentrated, how proficiency varies across competencies, and which competencies show closest or widest alignment to role standards.
- Start each bullet with a short bold label (2–4 words) followed by a colon, then the insight. Example format: **Capability Strength:** The "Integrate ethical standards" competency shows the highest concentration of advanced proficiency.
- Output ONLY the bullet lines, one per line, each starting with "- **Label:** Insight text."

Data (JSON):
${JSON.stringify(compStats, null, 2)}`;
  }, [domainName, activeSites.join(','), domainComps]);

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <Header currentPage="Executive" />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
            <Link to={createPageUrl('ExecutiveDashboard')} className="hover:text-[#00A3E0] transition-colors font-medium">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="text-[#3D3D3D] font-semibold truncate" aria-current="page">{domainName}</span>
          </nav>

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                  style={{ backgroundColor: `${domainColor}18`, color: domainColor }}>
                  Domain
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-xl font-bold text-[#3D3D3D] leading-snug">{domainName}</h1>
                <button
                  onClick={() => handleOpenPanel('domain', domainName)}
                  className="p-0.5 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-[#00A3E0] flex-shrink-0"
                  aria-label={`View details for ${domainName} domain`}
                >
                  <Info className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              <p className="text-xs text-gray-500">{allUsers.length} participants · {Object.keys(bySite).length} sites · {domainComps.length} competencies</p>
            </div>
            <Link
              to={createPageUrl('ExecutiveDashboard')}
              className="flex-shrink-0 flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#00A3E0] border border-gray-200 rounded-lg px-3 py-2 transition-colors bg-white hover:border-[#00A3E0]"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Site Filter Bar */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide flex-shrink-0">
              <Filter className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Filter Sites</span>
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(o => !o)}
                className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-lg px-3 py-1.5 hover:border-[#00A3E0] hover:text-[#00A3E0] transition-colors bg-white"
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
                aria-label={selectedSites.length === 0 ? `Site filter: All ${allSiteNamesRaw.length} sites selected` : `Site filter: ${selectedSites.length} sites selected`}
              >
                <Search className="w-3 h-3" aria-hidden="true" />
                {selectedSites.length === 0 ? `All ${allSiteNamesRaw.length} sites` : `${selectedSites.length} selected`}
                <ChevronDown className="w-3 h-3" aria-hidden="true" />
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 top-full mt-1 z-30 bg-white border border-gray-200 rounded-xl shadow-lg w-64">
                  <div className="p-2 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                      <input autoFocus type="text" placeholder="Search sites..." value={siteFilterSearch}
                        onChange={e => setSiteFilterSearch(e.target.value)}
                        className="w-full pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A3E0]"
                      />
                    </div>
                  </div>
                  <ul role="listbox" aria-label="Sites" aria-multiselectable="true" className="max-h-52 overflow-y-auto py-1">
                    {dropdownSites.map(site => (
                      <li key={site} role="option" aria-selected={selectedSites.includes(site)}>
                        <button onClick={() => toggleSite(site)}
                          className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-gray-50 transition-colors ${selectedSites.includes(site) ? 'text-[#00A3E0] font-semibold' : 'text-gray-700'}`}>
                          <span className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${selectedSites.includes(site) ? 'bg-[#00A3E0] border-[#00A3E0]' : 'border-gray-300'}`} aria-hidden="true">
                            {selectedSites.includes(site) && <span className="text-white text-[8px]">✓</span>}
                          </span>
                          {site}
                        </button>
                      </li>
                    ))}
                    {dropdownSites.length === 0 && <li className="text-xs text-gray-500 text-center py-3">No sites found</li>}
                  </ul>
                  <div className="p-2 border-t border-gray-100 flex justify-between">
                    <button onClick={clearSites} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Clear all</button>
                    <button onClick={() => { setDropdownOpen(false); setSiteFilterSearch(''); }} className="text-xs text-[#00A3E0] font-semibold hover:underline">Done</button>
                  </div>
                </div>
              )}
            </div>
            {selectedSites.map(site => (
              <span key={site} className="inline-flex items-center gap-1 bg-[#00A3E0]/10 text-[#00A3E0] text-[11px] font-medium rounded-full px-2.5 py-0.5">
                {site}
                <button onClick={() => toggleSite(site)} className="hover:text-[#0087bd] transition-colors" aria-label={`Remove ${site} filter`}><X className="w-3 h-3" aria-hidden="true" /></button>
              </span>
            ))}
            {selectedSites.length > 0 && (
              <button onClick={clearSites} className="text-xs text-gray-400 hover:text-gray-600 ml-auto transition-colors">Clear all</button>
            )}
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-600 mb-3">[Parent Org] Domain Summary</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
             <MetricCard icon={TrendingUp} label="Domain Avg. Response Value" value={avgScore.toFixed(2)} sub="Self-assessed average score" color={domainColor} tooltip="Average level of work for this domain within the selected view." />
             <MetricCard icon={BarChart2} label="Avg. Distance to NAHQ National Average" value={avgDist.toFixed(2)} sub="Points below target" color="#F59E0B" tooltip="Difference between current average score and National average." />
             <MetricCard icon={BookOpen} label="% Not Responsible" value={`${pctNotResponsible}%`} sub={`${notResponsibleCount} of ${filteredUniqueUsers.length} individuals`} color="#D0D5DD" tooltip="% of responses that indicated Not Responsible for a competency in this domain." />
           </div>
        </motion.div>

        {/* AI Summary */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.05 }}>
          <AISummaryCard
            prompt={aiPrompt}
            title={`AI Insights — ${domainName}`}
            subtitle="Executive-level narrative based on competency-level data for this domain"
            onChatOpen={handleChatOpen}
          />
        </motion.div>

        {/* Competency Distribution Chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.08 }}>
          <CompetencyDistributionChart competencies={domainComps} activeSites={activeSites} />
        </motion.div>


        <hr className="border-gray-200" />

         {/* Competencies breakdown */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.1 }}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <h2 className="text-sm font-bold text-[#3D3D3D] uppercase tracking-wide" id="competency-breakdown-heading">Breakdown by Competency</h2>
              <p className="text-xs text-gray-600 mt-0.5">
                Click a competency card to view detailed breakdown. {selectedSites.length > 0 && `Filtered to ${selectedSites.length} sites.`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3" aria-labelledby="competency-breakdown-heading">
            {domainComps.map((comp) => {
              const compUsers = comp.users.filter(u => activeSites.includes(u.site));
              return (
                <CompetencyRow 
                  key={comp.name} 
                  competency={comp.name} 
                  users={compUsers} 
                  domainColor={domainColor}
                  domainName={domainName}
                  onOpenPanel={handleOpenPanel}
                />
              );
            })}
          </div>
        </motion.div>
      </div>

      <DomainCompetencyPanel 
        isOpen={panelOpen} 
        onClose={() => setPanelOpen(false)} 
        type={panelType} 
        name={panelName} 
      />
      <FloatingChatButton onClick={() => { setChatInitialSummary(''); setChatOpen(true); }} />
      <ExecutiveAIChat
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        context="domain"
        initialSummary={chatInitialSummary}
        data={{
          organizationalScore: avgScore,
          benchmarkScore: nahqStandardTarget,
          domainName,
          totalUsers: filteredUniqueUsers.length,
          pctNotResponsible,
          avgDist,
          competencyStats: domainComps.map(comp => {
            const compUsers = comp.users.filter(u => activeSites.includes(u.site));
            const unique = Object.values(compUsers.reduce((acc, u) => { if (!acc[u.name]) acc[u.name] = u; return acc; }, {}));
            if (!unique.length) return null;
            const avg = parseFloat((unique.reduce((s, u) => s + u.score, 0) / unique.length).toFixed(2));
            const target = parseFloat((unique.reduce((s, u) => s + (ROLE_TARGETS[u.role] || 2.0), 0) / unique.length).toFixed(2));
            return { competency: comp.name, avgScore: avg, nahqTarget: target, distToStandard: Math.max(0, target - avg).toFixed(2), pctAdvanced: Math.round((unique.filter(u => u.score >= 2.75).length / unique.length) * 100), participants: unique.length };
          }).filter(Boolean),
        }}
      />
    </div>
  );
}