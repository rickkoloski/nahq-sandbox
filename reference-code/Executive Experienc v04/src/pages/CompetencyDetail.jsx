import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Target, BookOpen, ArrowLeft, Info, Search, X, Filter, TrendingUp, BarChart2, SquareArrowOutUpRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import FloatingChatButton from '@/components/shared/FloatingChatButton';
import { createPageUrl } from '@/utils';
import Header from '@/components/shared/Header';
import UserDetailModal from '@/components/executive/UserDetailModal';
import DomainCompetencyPanel from '@/components/executive/DomainCompetencyPanel';
import ExecutiveAIChat from '@/components/executive/ExecutiveAIChat';
import { ROLE_TARGETS, DOMAIN_COLORS, COMPETENCY_DATA, computeMetrics } from '@/components/shared/workforceData';
import AISummaryCard from '@/components/shared/AISummaryCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function seedVal(name, min, max) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = h * 31 + name.charCodeAt(i) & 0xffffffff;
  return min + Math.abs(h) % (max - min + 1);
}

// ─── Metric Card ─────────────────────────────────────────────────────────────

function MetricCard({ icon: Icon, label, value, sub, color = '#00A3E0', tooltip }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipId = `metric-tooltip-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 relative">
      {tooltip &&
      <div className="absolute top-3 right-3">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            aria-label={`About ${label}`}
            aria-describedby={showTooltip ? tooltipId : undefined}
            className="text-gray-500 hover:text-[#00A3E0] transition-colors"
          >
            <Info className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          {showTooltip &&
        <div id={tooltipId} role="tooltip" className="absolute right-0 top-full mt-2 z-30 w-60 bg-[#3D3D3D] text-white text-xs rounded-lg px-3 py-2.5 shadow-xl leading-relaxed pointer-events-none">
              {tooltip}
              <div className="absolute -top-1.5 right-3 w-3 h-3 bg-[#3D3D3D] rotate-45" aria-hidden="true" />
            </div>
        }
        </div>
      }
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }} aria-hidden="true">
          <Icon className="w-4 h-4" style={{ color }} aria-hidden="true" />
        </div>
        <p className="text-[10px] text-gray-600 uppercase tracking-wide font-medium leading-tight pr-5">{label}</p>
      </div>
      <p className="text-2xl font-bold text-[#3D3D3D]">{value}</p>
      {sub && <p className="text-[11px] text-gray-600 mt-0.5">{sub}</p>}
    </div>);

}

// ─── Job level mapping ────────────────────────────────────────────────────────

const JOB_LEVEL_MAP = {
  'Director of Quality': 'Director',
  'Quality Manager': 'Manager',
  'Quality Specialist': 'Specialist',
  'Quality Analyst': 'Specialist'
};

const JOB_LEVEL_ORDER = ['C-Level', 'VP', 'Director', 'Manager', 'Specialist', 'Coordinator', 'Consultant', 'Clinical', 'Support'];

function getJobLevel(role) {
  return JOB_LEVEL_MAP[role] || role;
}

// ─── Distribution Bar Chart ───────────────────────────────────────────────────

function CompetencyDistributionChart({ users, domainColor }) {
  // Group by job level
  const byLevel = {};
  users.forEach((u) => {
    const level = getJobLevel(u.role);
    if (!byLevel[level]) byLevel[level] = [];
    byLevel[level].push(u);
  });

  // Build rows in defined order, only for levels that have data
  const chartData = JOB_LEVEL_ORDER.filter((lvl) => byLevel[lvl]?.length > 0).map((lvl) => {
    const lvlUsers = byLevel[lvl];
    let na = 0,foundational = 0,proficient = 0,advanced = 0;
    lvlUsers.forEach((u) => {
      if (u.score < 1.5) na++;else
      if (u.score < 2.3) foundational++;else
      if (u.score < 2.75) proficient++;else
      advanced++;
    });
    const total = lvlUsers.length;
    return {
      name: lvl,
      fullName: lvl,
      'Not Responsible': Math.round(na / total * 100),
      'Foundational': Math.round(foundational / total * 100),
      'Proficient': Math.round(proficient / total * 100),
      'Advanced': Math.round(advanced / total * 100)
    };
  });

  // Also add an "All" row
  let na = 0,foundational = 0,proficient = 0,advanced = 0;
  users.forEach((u) => {
    if (u.score < 1.5) na++;else
    if (u.score < 2.3) foundational++;else
    if (u.score < 2.75) proficient++;else
    advanced++;
  });
  const total = users.length;
  if (total > 0) {
    chartData.unshift({
      name: 'All Participants',
      fullName: 'All Participants',
      'Not Responsible': Math.round(na / total * 100),
      'Foundational': Math.round(foundational / total * 100),
      'Proficient': Math.round(proficient / total * 100),
      'Advanced': Math.round(advanced / total * 100)
    });
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-lg text-xs">
        <p className="font-semibold text-gray-800 mb-1.5">{d?.fullName || label}</p>
        {payload.map((entry) =>
        <p key={entry.name} style={{ color: entry.fill === '#D0D5DD' ? '#6B7280' : entry.fill }} className="leading-5 font-medium">
            {entry.name}: {entry.value}%
          </p>
        )}
      </div>);

  };

  const [showInfoTooltip, setShowInfoTooltip] = React.useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between gap-3 mb-1">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-[#00A3E0]" aria-hidden="true" />
          <h3 className="text-sm font-bold text-[#3D3D3D]">Level of Work Distribution by Job Level</h3>
        </div>
        <div className="relative flex-shrink-0">
          <button
            onMouseEnter={() => setShowInfoTooltip(true)}
            onMouseLeave={() => setShowInfoTooltip(false)}
            onFocus={() => setShowInfoTooltip(true)}
            onBlur={() => setShowInfoTooltip(false)}
            aria-label="About this chart"
            aria-describedby={showInfoTooltip ? 'dist-chart-info' : undefined}
            className="text-gray-500 hover:text-[#00A3E0] transition-colors"
          >
            <Info className="w-4 h-4" aria-hidden="true" />
          </button>
          {showInfoTooltip && (
            <div id="dist-chart-info" role="tooltip" className="absolute right-0 top-full mt-2 z-30 w-64 bg-[#3D3D3D] text-white text-xs rounded-lg px-3 py-2.5 shadow-xl leading-relaxed pointer-events-none">
              Distribution of self-assessed level of work for this competency.
              <div className="absolute -top-1.5 right-3 w-3 h-3 bg-[#3D3D3D] rotate-45" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-600 mb-4">Self-assessed proficiency levels by role group (% of participants).</p>
      <ResponsiveContainer width="100%" height={chartData.length * 36 + 40}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }} barSize={18}>
          <CartesianGrid horizontal={false} stroke="#F0F0F0" />
          <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11, fill: '#3D3D3D' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
          <Bar dataKey="Not Responsible" stackId="a" fill="#D0D5DD" isAnimationActive={false} />
          <Bar dataKey="Foundational" stackId="a" fill="#FFD400" isAnimationActive={false} />
          <Bar dataKey="Proficient" stackId="a" fill="#12B76A" isAnimationActive={false} />
          <Bar dataKey="Advanced" stackId="a" fill="#2E90FA" isAnimationActive={false} radius={[0, 3, 3, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 pt-2 border-t border-gray-200 flex flex-wrap gap-3 text-xs text-gray-600" role="list" aria-label="Chart legend">
        {[['#D0D5DD', '0=Not Responsible'], ['#FFD400', '1=Foundational'], ['#12B76A', '2=Proficient'], ['#2E90FA', '3=Advanced']].map(([color, label]) =>
        <div key={label} className="flex items-center gap-2" role="listitem">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} aria-hidden="true" />
            <span>{label}</span>
          </div>
        )}
      </div>
    </div>);

}

// ─── Individual User Row ──────────────────────────────────────────────────────

function UserRow({ user, onUserClick }) {
  const target = ROLE_TARGETS[user.role] || 2.0;
  const dist = Math.max(0, target - user.score);
  const learningPct = seedVal(user.name + 'lp', 10, 90);
  const initials = user.name.split(' ').map((n) => n[0]).join('').toUpperCase();

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View details for ${user.name}, ${user.role}`}
      className="grid items-center px-5 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-inset"
      style={{ gridTemplateColumns: '1.5fr 0.8fr 0.8fr 0.8fr 1fr 36px' }}
      onClick={() => onUserClick(user)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onUserClick(user); } }}>
      
      {/* Name + Role */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-[#00A3E0]/15 flex items-center justify-center flex-shrink-0 font-semibold text-xs text-[#00A3E0]" aria-hidden="true">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#3D3D3D] truncate">{user.name}</p>
          <p className="text-xs text-gray-600 truncate">{user.role}</p>
        </div>
      </div>
      {/* Results */}
       <div className="flex flex-col items-center justify-center">
         <p className="text-sm font-bold text-[#3D3D3D]">{Math.round(user.score)}</p>
       </div>
      {/* NAHQ Standard Role Target */}
      <div className="flex flex-col items-center justify-center">
        <p className="text-sm font-bold text-[#00A3E0]">{Math.round(target)}</p>
      </div>
      {/* Avg. Distance to Standard */}
      <div className="flex flex-col items-center justify-center">
        <p className="text-sm font-bold" style={{ color: dist > 0.5 ? '#DC2626' : dist > 0.2 ? '#D97706' : '#059669' }}>
          {dist > 0 ? `-${dist.toFixed(2)}` : '0.00'}
        </p>
      </div>
      {/* Learning Progress */}
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-1 w-full px-2">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-semibold text-[#3D3D3D]">{learningPct}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden" role="img" aria-label={`Learning progress: ${learningPct}%`}>
            <div className="h-full rounded-full" style={{ width: `${learningPct}%`, backgroundColor: '#00A3E0' }} />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center text-gray-500 hover:text-[#00A3E0] transition-colors" aria-hidden="true">
        <SquareArrowOutUpRight className="w-3.5 h-3.5" />
      </div>
    </div>);

}

// ─── Mini Stacked Distribution Bar ───────────────────────────────────────────

function MiniDistBar({ users }) {
  if (!users.length) return null;
  let na = 0,foundational = 0,proficient = 0,advanced = 0;
  users.forEach((u) => {
    if (u.score < 1.5) na++;else
    if (u.score < 2.3) foundational++;else
    if (u.score < 2.75) proficient++;else
    advanced++;
  });
  const total = users.length;
  const segs = [
  { label: 'N/R', pct: Math.round(na / total * 100), color: '#D0D5DD' },
  { label: 'Found.', pct: Math.round(foundational / total * 100), color: '#FFD400' },
  { label: 'Prof.', pct: Math.round(proficient / total * 100), color: '#12B76A' },
  { label: 'Adv.', pct: Math.round(advanced / total * 100), color: '#2E90FA' }].
  filter((s) => s.pct > 0);
  const ariaDesc = segs.map((s) => `${s.label} ${s.pct}%`).join(', ');
  return (
    <div>
      <div className="flex h-2.5 w-full rounded-full overflow-hidden gap-px" role="img" aria-label={`Proficiency distribution: ${ariaDesc}`}>
        {segs.map((s, i) => <div key={i} style={{ width: `${s.pct}%`, backgroundColor: s.color }} aria-hidden="true" />)}
      </div>
      <div className="flex gap-3 mt-1.5 flex-wrap" aria-hidden="true">
        {segs.map((s, i) =>
        <div key={i} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-[9px] text-gray-600">{s.label} {s.pct}%</span>
          </div>
        )}
      </div>
    </div>);

}

// ─── Site Group (expandable) ──────────────────────────────────────────────────

function SiteGroup({ site, users, onUserClick }) {
  const [open, setOpen] = useState(false);

  // Deduplicate by name for metrics
  const uniqueUsers = Object.values(users.reduce((acc, u) => {if (!acc[u.name]) acc[u.name] = u;return acc;}, {}));
  const avgProficiency = uniqueUsers.length > 0 ?
  parseFloat((uniqueUsers.reduce((s, u) => s + u.score, 0) / uniqueUsers.length).toFixed(2)) : 0;
  const avgStandard = uniqueUsers.length > 0 ?
  parseFloat((uniqueUsers.reduce((s, u) => s + (ROLE_TARGETS[u.role] || 2.0), 0) / uniqueUsers.length).toFixed(2)) : 0;
  const distToStandard = parseFloat(Math.max(0, avgStandard - avgProficiency).toFixed(2));
  const notResponsiblePct = uniqueUsers.length > 0 ?
  Math.round(uniqueUsers.filter((u) => u.score < 1.5).length / uniqueUsers.length * 100) : 0;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`site-group-${site.replace(/\s+/g, '-')}`}
        className="w-full text-left px-5 pt-4 pb-3 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-inset">
        
        {/* Top row: chevron + site name + participant count */}
        <div className="flex items-center gap-3 mb-3">
          {open
            ? <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
            : <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#003DA5]">{site}</p>
            <p className="text-xs text-gray-600">{uniqueUsers.length} participants</p>
          </div>
        </div>

        {/* Distribution bar */}
        <div className="mb-3 pl-7">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-600 mb-1.5">Proficiency Distribution</p>
          <MiniDistBar users={uniqueUsers} />
        </div>

        {/* Mini metrics */}
        <div className="grid grid-cols-3 gap-3 pl-7">
          <div>
            <p className="text-[9px] uppercase tracking-wide text-gray-600 font-semibold mb-0.5">Avg. Response Value</p>
            <p className="text-sm font-bold text-[#3D3D3D]">{avgProficiency.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wide text-gray-600 font-semibold mb-0.5">Dist to National Average</p>
            <p className="text-sm font-bold" style={{ color: distToStandard > 0.5 ? '#DC2626' : distToStandard > 0.2 ? '#D97706' : '#059669' }}>
              {distToStandard > 0 ? `-${distToStandard.toFixed(2)}` : '0.00'}
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wide text-gray-600 font-semibold mb-0.5">% Not Responsible</p>
            <p className="text-sm font-bold text-[#6B7280]">{notResponsiblePct}%</p>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {open &&
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
            <div className="border-t border-gray-100" id={`site-group-${site.replace(/\s+/g, '-')}`}>
              {/* Column headers */}
              <div role="row" className="grid items-center px-5 py-2 bg-[#F8F9FB]" style={{ gridTemplateColumns: '1.5fr 0.8fr 0.8fr 0.8fr 1fr 36px' }}>
                <span role="columnheader" className="text-[10px] font-semibold text-gray-600 uppercase">Individual</span>
                <span role="columnheader" className="text-center text-[10px] font-semibold text-gray-600 uppercase">Results</span>
                <span role="columnheader" className="text-center text-[10px] font-semibold text-gray-600 uppercase">NAHQ Standard Role Target</span>
                <span role="columnheader" className="text-center text-[10px] font-semibold text-gray-600 uppercase">Distance</span>
                <span role="columnheader" className="text-center text-[10px] font-semibold text-gray-600 uppercase">Learning Progress</span>
                <span aria-hidden="true" />
              </div>
              <div role="rowgroup">
                {users.map((u, i) => <UserRow key={i} user={u} onUserClick={onUserClick} />)}
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CompetencyDetail() {
  React.useEffect(() => {window.scrollTo(0, 0);}, []);

  const params = new URLSearchParams(window.location.search);
  const domainName = params.get('domain') || 'Professional Engagement';
  const compName = params.get('competency') || '';

  const domainComps = COMPETENCY_DATA[domainName] || [];
  const comp = domainComps.find((c) => c.name === compName) || domainComps[0];
  const allUsers = comp ? comp.users : [];
  const domainColor = DOMAIN_COLORS[domainName] || '#00A3E0';

  // Site filter state
  const allSiteNames = useMemo(() => [...new Set(allUsers.map((u) => u.site))].sort(), [allUsers]);
  const [selectedSites, setSelectedSites] = useState([]);
  const [siteFilterSearch, setSiteFilterSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e) => {if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);};
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  const activeSites = selectedSites.length === 0 ? allSiteNames : selectedSites;
  const toggleSite = (site) => setSelectedSites((prev) => prev.includes(site) ? prev.filter((s) => s !== site) : [...prev, site]);
  const clearSites = () => {setSelectedSites([]);setSiteFilterSearch('');};
  const dropdownSites = useMemo(() => {
    if (!siteFilterSearch.trim()) return allSiteNames;
    return allSiteNames.filter((s) => s.toLowerCase().includes(siteFilterSearch.toLowerCase()));
  }, [allSiteNames, siteFilterSearch]);

  // Filtered users based on active sites
  const filteredUsers = useMemo(() => allUsers.filter((u) => activeSites.includes(u.site)), [allUsers, activeSites]);

  // Deduplicated users for metrics
  const uniqueUsers = useMemo(() => {
    const byName = {};
    filteredUsers.forEach((u) => {if (!byName[u.name]) byName[u.name] = u;});
    return Object.values(byName);
  }, [filteredUsers]);

  const { readiness, avgDist, metCount } = computeMetrics(uniqueUsers);
  const avgScore = uniqueUsers.length > 0 ?
  parseFloat((uniqueUsers.reduce((s, u) => s + u.score, 0) / uniqueUsers.length).toFixed(2)) : 0;
  const avgTarget = uniqueUsers.length > 0 ?
  parseFloat((uniqueUsers.reduce((s, u) => s + (ROLE_TARGETS[u.role] || 2.0), 0) / uniqueUsers.length).toFixed(2)) : 0;
  const notResponsibleCount = uniqueUsers.filter((u) => u.score < 1.5).length;
  const pctNotResponsible = uniqueUsers.length > 0 ? Math.round(notResponsibleCount / uniqueUsers.length * 100) : 0;

  // Group filtered users by site
  const bySite = useMemo(() => {
    const acc = {};
    filteredUsers.forEach((u) => {if (!acc[u.site]) acc[u.site] = [];acc[u.site].push(u);});
    return acc;
  }, [filteredUsers]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelType, setPanelType] = useState(null);
  const [panelName, setPanelName] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInitialSummary, setChatInitialSummary] = useState('');

  const handleOpenPanel = (type, name) => {setPanelType(type);setPanelName(name);setPanelOpen(true);};

  const handleChatOpen = (summary) => {
    setChatInitialSummary(summary);
    setChatOpen(true);
  };

  const aiPrompt = useMemo(() => {
    const bySite = {};
    filteredUsers.forEach((u) => {if (!bySite[u.site]) bySite[u.site] = [];bySite[u.site].push(u);});
    const siteStats = Object.entries(bySite).map(([site, sUsers]) => {
      const unique = Object.values(sUsers.reduce((acc, u) => {if (!acc[u.name]) acc[u.name] = u;return acc;}, {}));
      const avg = parseFloat((unique.reduce((s, u) => s + u.score, 0) / unique.length).toFixed(2));
      const target = parseFloat((unique.reduce((s, u) => s + (ROLE_TARGETS[u.role] || 2.0), 0) / unique.length).toFixed(2));
      const dist = Math.max(0, target - avg).toFixed(2);
      const pctAdv = Math.round(unique.filter((u) => u.score >= 2.75).length / unique.length * 100);
      return { site, avgScore: avg, nahqTarget: target, distToStandard: dist, pctAdvanced: pctAdv, participants: unique.length };
    });

    return `You are a senior healthcare quality workforce strategist writing for a C-suite executive audience.

Using the site-level self-assessment data below for the "${comp ? comp.name : ''}" competency within the "${domainName}" domain, write an executive summary as exactly 4–5 concise bullet points.

Guidelines:
- Each bullet should be one crisp sentence (max 30 words) capturing a distinct insight.
- Focus on patterns, contrasts, and capability composition across sites — not individual scores.
- Avoid repeating specific numeric values already visible in the page. Use relative language (e.g., "highest proficiency concentration," "narrowest gap to standard," "most evenly distributed").
- Do not use alarmist, evaluative, or prescriptive language. No "critical gaps," "alarming," "must," or recommendations.
- Frame insights around: where capability strength is concentrated across sites, how proficiency varies, and which sites show closest or widest alignment to role standards.
- Start each bullet with a short bold label (2–4 words) followed by a colon, then the insight. Example format: **Site Variation:** Main Campus shows the highest concentration of advanced proficiency across all assessed individuals.
- Output ONLY the bullet lines, one per line, each starting with "- **Label:** Insight text."

Data (JSON):
${JSON.stringify(siteStats, null, 2)}`;
  }, [comp?.name, domainName, activeSites.join(',')]);

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <Header currentPage="Executive" />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
            <Link to={createPageUrl('ExecutiveDashboard')} className="hover:text-[#00A3E0] transition-colors font-medium">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            <Link to={createPageUrl(`DomainDetail?domain=${encodeURIComponent(domainName)}`)} className="font-medium hover:opacity-80 transition-opacity" style={{ color: domainColor }}>{domainName}</Link>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="text-[#3D3D3D] font-semibold truncate" aria-current="page">{comp ? comp.name : ''}</span>
          </nav>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <button onClick={() => handleOpenPanel('domain', domainName)} aria-label={`View details for domain: ${domainName}`} className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded hover:opacity-80 transition-opacity cursor-pointer group" style={{ backgroundColor: `${domainColor}18`, color: domainColor }}>
                  {domainName}
                  <Info className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" aria-hidden="true" />
                </button>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-xl font-bold text-[#3D3D3D] leading-snug">{comp ? comp.name : 'Competency'}</h1>
                <button onClick={() => handleOpenPanel('competency', comp ? comp.name : '')} aria-label={`View framework details for ${comp ? comp.name : 'this competency'}`} className="p-0.5 hover:bg-gray-100 rounded transition-colors text-gray-500 hover:text-[#00A3E0] flex-shrink-0">
                  <Info className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              <p className="text-xs text-gray-600">{filteredUsers.length} participants · {Object.keys(bySite).length} sites</p>
            </div>
            <Link to={createPageUrl(`DomainDetail?domain=${encodeURIComponent(domainName)}`)} className="flex-shrink-0">
              <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#00A3E0] border border-gray-200 rounded-lg px-3 py-2 transition-colors bg-white hover:border-[#00A3E0]">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Domain
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Site Filter Bar */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide flex-shrink-0" aria-hidden="true">
              <Filter className="w-3.5 h-3.5" aria-hidden="true" />
              Filter Sites
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
                aria-label={selectedSites.length === 0 ? `Filter by site: all ${allSiteNames.length} sites selected` : `Filter by site: ${selectedSites.length} selected`}
                className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-lg px-3 py-1.5 hover:border-[#00A3E0] hover:text-[#00A3E0] transition-colors bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0]"
              >
                <Search className="w-3 h-3" aria-hidden="true" />
                {selectedSites.length === 0 ? `All ${allSiteNames.length} sites` : `${selectedSites.length} selected`}
                <ChevronDown className="w-3 h-3" aria-hidden="true" />
              </button>
              {dropdownOpen &&
              <div className="absolute left-0 top-full mt-1 z-30 bg-white border border-gray-200 rounded-xl shadow-lg w-64">
                  <div className="p-2 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                      <input autoFocus type="text" placeholder="Search sites..." value={siteFilterSearch} onChange={(e) => setSiteFilterSearch(e.target.value)}
                    className="w-full pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A3E0]" />
                    </div>
                  </div>
                  <div className="max-h-52 overflow-y-auto py-1" role="listbox" aria-multiselectable="true" aria-label="Select sites">
                    {dropdownSites.map((site) =>
                  <button key={site} onClick={() => toggleSite(site)}
                  role="option"
                  aria-selected={selectedSites.includes(site)}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:bg-gray-50 ${selectedSites.includes(site) ? 'text-[#00A3E0] font-semibold' : 'text-gray-700'}`}>
                        <span className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${selectedSites.includes(site) ? 'bg-[#00A3E0] border-[#00A3E0]' : 'border-gray-300'}`} aria-hidden="true">
                          {selectedSites.includes(site) && <span className="text-white text-[8px]">✓</span>}
                        </span>
                        {site}
                      </button>
                  )}
                    {dropdownSites.length === 0 && <p className="text-xs text-gray-600 text-center py-3">No sites found</p>}
                  </div>
                  <div className="p-2 border-t border-gray-100 flex justify-between">
                    <button onClick={clearSites} className="text-xs text-gray-600 hover:text-gray-800 transition-colors">Clear all</button>
                    <button onClick={() => {setDropdownOpen(false);setSiteFilterSearch('');}} className="text-xs text-[#00A3E0] font-semibold hover:underline">Done</button>
                  </div>
                </div>
              }
            </div>
            {selectedSites.map((site) =>
            <span key={site} className="inline-flex items-center gap-1 bg-[#00A3E0]/10 text-[#00A3E0] text-[11px] font-medium rounded-full px-2.5 py-0.5">
                {site}
                <button onClick={() => toggleSite(site)} aria-label={`Remove ${site} filter`} className="hover:text-[#0087bd] transition-colors"><X className="w-3 h-3" aria-hidden="true" /></button>
              </span>
            )}
            {selectedSites.length > 0 &&
            <button onClick={clearSites} className="text-xs text-gray-600 hover:text-gray-800 ml-auto transition-colors">Clear all</button>
            }
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-600 mb-3">[Parent Org] Competency Summary</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
             <MetricCard icon={TrendingUp} label="Competency Avg. Response Value" value={avgScore.toFixed(2)} sub="Self-assessed average score" color={domainColor} tooltip="The average self-assessed proficiency score across all individuals in this competency, on a 0–3 scale." />
             <MetricCard icon={BarChart2} label="Comparison to National Average" value={Math.max(0, avgTarget - avgScore).toFixed(2)} sub="Points below target" color="#F59E0B" tooltip="The average gap between an individual's score and their role-based NAHQ standard target. Lower is better." />
             <MetricCard icon={BookOpen} label="% Not Responsible" value={`${pctNotResponsible}%`} sub={`${notResponsibleCount} of ${uniqueUsers.length} individuals`} color="#D0D5DD" tooltip="The percentage of individuals scoring at the Not Responsible level (<1.5) in this competency." />
           </div>
        </motion.div>

        {/* AI Summary */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.05 }}>
          <AISummaryCard
            prompt={aiPrompt}
            title={`AI Insights — ${comp ? comp.name : 'Competency'}`}
            subtitle="Executive-level narrative based on site-level data for this competency"
            onChatOpen={handleChatOpen} />
          
        </motion.div>

        {/* Distribution Chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.08 }}>
          <CompetencyDistributionChart users={filteredUsers} domainColor={domainColor} />
        </motion.div>

        <hr className="border-gray-200" />

        {/* Individuals by Site */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.1 }}>
          <div className="mb-3">
            <h2 className="text-sm font-bold text-[#3D3D3D] uppercase tracking-wide">Breakdown by Site / Individual</h2>
            <p className="text-xs text-gray-600 mt-0.5">
              {filteredUsers.length} participants across {Object.keys(bySite).length} sites. Click a site to expand individual records.
              {selectedSites.length > 0 && ` Filtered to ${selectedSites.length} sites.`}
            </p>
          </div>
          <div className="space-y-3">
            {Object.entries(bySite).sort(([a], [b]) => a.localeCompare(b)).map(([site, siteUsers]) =>
            <SiteGroup key={site} site={site} users={siteUsers} onUserClick={setSelectedUser} />
            )}
            {Object.keys(bySite).length === 0 &&
            <p className="text-sm text-gray-600 text-center py-10 bg-white rounded-xl border border-gray-200">No participants match the selected filter.</p>
            }
          </div>
        </motion.div>
      </div>

      <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      <DomainCompetencyPanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} type={panelType} name={panelName} />
      <FloatingChatButton onClick={() => {setChatInitialSummary('');setChatOpen(true);}} />
      <ExecutiveAIChat
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        context="competency"
        initialSummary={chatInitialSummary}
        data={{
          organizationalScore: avgScore,
          benchmarkScore: avgTarget,
          domainName,
          competencyName: comp ? comp.name : '',
          totalUsers: uniqueUsers.length,
          pctNotResponsible,
          avgDist,
          siteStats: Object.entries(bySite).map(([site, sUsers]) => {
            const unique = Object.values(sUsers.reduce((acc, u) => {if (!acc[u.name]) acc[u.name] = u;return acc;}, {}));
            const avg = parseFloat((unique.reduce((s, u) => s + u.score, 0) / unique.length).toFixed(2));
            const target = parseFloat((unique.reduce((s, u) => s + (ROLE_TARGETS[u.role] || 2.0), 0) / unique.length).toFixed(2));
            return { site, avgScore: avg, nahqTarget: target, distToStandard: Math.max(0, target - avg).toFixed(2), pctAdvanced: Math.round(unique.filter((u) => u.score >= 2.75).length / unique.length * 100), participants: unique.length };
          })
        }} />
      
    </div>);

}