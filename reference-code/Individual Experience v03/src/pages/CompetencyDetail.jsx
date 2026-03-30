import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Users, Target, AlertTriangle, BookOpen, Sparkles, User, ArrowLeft, Info, Search, ChevronLeft, X, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Header from '@/components/shared/Header';
import UserDetailModal from '@/components/executive/UserDetailModal';
import CompetencyHeatmap from '@/components/executive/CompetencyHeatmap';
import DomainCompetencyPanel from '@/components/executive/DomainCompetencyPanel';

// ─── Shared data ────────────────────────────────────────────────────────────

const ROLE_TARGETS = {
  'Core Quality': 2.2,
  'Clinical Quality Bridge': 2.0,
  'D&T Clinical Support': 1.8,
  'Frontline Care Delivery': 1.7,
  'Senior Leadership': 2.3,
  'Ancillary & Operational Support': 1.6,
};

// Generate demo users across 18 sites for all competencies
const DEMO_SITES = [
  'Main Campus', 'North Campus', 'South Clinic', 'East Medical Center',
  'West Outpatient', 'Riverside Hospital', 'Lakewood Clinic', 'Hillside Medical',
  'Downtown Health', 'Suburban Care', 'Valley Regional', 'Northgate Clinic',
  'Harbor Medical', 'Eastside Community', 'Westfield Hospital', 'Central District',
  'Greenwood Medical', 'Pinecrest Clinic',
];

const DEMO_NAMES = [
  'Sarah Chen', 'James Rodriguez', 'Maria Garcia', 'David Kim', 'Jennifer Lee',
  'Michael Brown', 'Patricia Johnson', 'Robert Wilson', 'Linda Martinez', 'Christopher Davis',
  'Amanda Thompson', 'Daniel Harris', 'Michelle Clark', 'Kevin Lewis', 'Barbara Hall',
  'Steven Young', 'Nancy Allen', 'Jason Wright', 'Karen Scott', 'Brian Adams',
];

const DEMO_ROLES = [
  'Senior Leadership', 'Core Quality', 'Clinical Quality Bridge',
  'D&T Clinical Support', 'Frontline Care Delivery', 'Ancillary & Operational Support',
];

function makeDemoUsers(seed) {
  return DEMO_SITES.map((site, si) => {
    const nameIdx = (si * 3 + seed) % DEMO_NAMES.length;
    const roleIdx = (si + seed) % DEMO_ROLES.length;
    const scoreBase = 1.0 + ((si * 7 + seed * 13) % 16) / 10;
    const score = parseFloat(Math.min(3.0, Math.max(0.5, scoreBase)).toFixed(1));
    return { name: DEMO_NAMES[nameIdx], role: DEMO_ROLES[roleIdx], site, score };
  });
}

const COMPETENCY_DATA = {
  'Quality Leadership': [
    { name: 'Lead and sponsor quality initiatives', users: makeDemoUsers(1) },
    { name: 'Foster a culture of continuous improvement', users: makeDemoUsers(2) },
    { name: 'Build and sustain cross-functional teams', users: makeDemoUsers(3) },
  ],
  'Patient Safety': [
    { name: 'Create and maintain a safe environment', users: makeDemoUsers(4) },
    { name: 'Identify and mitigate patient safety risks', users: makeDemoUsers(5) },
  ],
  'Performance Improvement': [
    { name: 'Use data to identify improvement opportunities', users: makeDemoUsers(6) },
    { name: 'Plan and implement improvement initiatives', users: makeDemoUsers(7) },
  ],
  'Health Data Analytics': [
    { name: 'Apply procedures for governance of data assets', users: makeDemoUsers(8) },
    { name: 'Design data collection plans', users: makeDemoUsers(9) },
    { name: 'Acquire data from source systems', users: makeDemoUsers(10) },
  ],
  'Regulatory & Accreditation': [
    { name: 'Understand regulatory requirements', users: makeDemoUsers(11) },
    { name: 'Prepare for surveys and assessments', users: makeDemoUsers(12) },
  ],
};

const DOMAIN_COLORS = {
  'Quality Leadership': '#1E5BB8', 'Patient Safety': '#E67E22',
  'Performance Improvement': '#0F6C74', 'Health Data Analytics': '#8A6D3B',
  'Regulatory & Accreditation': '#C62828',
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function computeMetrics(users) {
  if (!users || !users.length) return { readiness: 0, avgScore: 0, avgDist: 0, metCount: 0 };
  let met = 0, totalDist = 0, totalScore = 0;
  users.forEach(u => {
    const t = ROLE_TARGETS[u.role] || 2.0;
    if (u.score >= t) met++;
    totalDist += Math.max(0, t - u.score);
    totalScore += u.score;
  });
  return {
    readiness: Math.round((met / users.length) * 100),
    avgScore: parseFloat((totalScore / users.length).toFixed(2)),
    avgDist: parseFloat((totalDist / users.length).toFixed(2)),
    metCount: met,
  };
}

function gapStyle(dist) {
  if (dist <= 0.20) return { bg: '#D1FAE5', text: '#065F46', label: 'On Target' };
  if (dist <= 0.50) return { bg: '#FFF3E0', text: '#7C3D0A', label: 'Moderate' };
  return { bg: '#FEE2E2', text: '#991B1B', label: 'Critical' };
}

function GapChip({ dist }) {
  const s = gapStyle(dist);
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
  );
}

function levelBadge(score) {
  if (score < 1) return { label: 'N/A', bg: '#F3F4F6', color: '#6B7280' };
  if (score < 2) return { label: 'F', bg: '#FEF3C7', color: '#D97706' };
  if (score < 3) return { label: 'P', bg: '#D1FAE5', color: '#059669' };
  return { label: 'A', bg: '#DBEAFE', color: '#2563EB' };
}

// Deterministic pseudo values per user name for demo consistency
function seedVal(name, min, max) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return min + (Math.abs(h) % (max - min + 1));
}

// ─── User row inside a role group ───────────────────────────────────────────

function UserRow({ user, onUserClick }) {
   const target = ROLE_TARGETS[user.role] || 2.0;
   const dist = Math.max(0, target - user.score);

   // Calculate alignment status
   const attainmentPct = Math.round((user.score / target) * 100);
   let alignmentStatus, alignmentColor;

   if (attainmentPct >= 90) {
     alignmentStatus = 'Fully Aligned';
     alignmentColor = '#059669';
   } else if (attainmentPct >= 60) {
     alignmentStatus = 'Partially Aligned';
     alignmentColor = '#D97706';
   } else {
     alignmentStatus = 'At Risk';
     alignmentColor = '#DC2626';
   }

   // Simulated competencies below target and learning progress
   const compBelow = attainmentPct >= 90 ? 0 : seedVal(user.name, 1, 4);
   const learningPct = seedVal(user.name + 'lp', 10, 90);

   return (
     <div
       className="grid items-center px-5 py-3 hover:bg-[#00A3E0]/5 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
       style={{ gridTemplateColumns: '1fr 110px 110px 140px 110px' }}
       onClick={() => onUserClick(user)}
     >
       {/* Name */}
       <div className="flex items-center gap-2 min-w-0">
         <User className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
         <div className="min-w-0">
           <span className="text-sm text-gray-700 truncate block">{user.name}</span>
           <span className="text-[10px] text-gray-400">{user.site}</span>
         </div>
       </div>
       {/* Role Target Attainment */}
       <div className="text-center">
         <span className="text-sm font-bold" style={{ color: alignmentColor }}>
           {alignmentStatus}
         </span>
         <p className="text-[10px] text-gray-400">{attainmentPct}%</p>
       </div>
      {/* Avg Distance */}
      <div className="text-center">
        <span className="text-sm font-bold text-[#3D3D3D]">{attainmentPct >= 90 ? '—' : dist.toFixed(2)}</span>
        {attainmentPct < 90 && <p className="text-[10px] text-gray-400">below target</p>}
      </div>
      {/* Competencies Below Target */}
      <div className="text-center">
        <span className={`text-sm font-bold ${compBelow === 0 ? 'text-[#059669]' : compBelow <= 2 ? 'text-[#D97706]' : 'text-[#DC2626]'}`}>
          {compBelow}
        </span>
        <p className="text-[10px] text-gray-400">of domain comps</p>
      </div>
      {/* Learning Progress */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm font-bold text-[#3D3D3D]">{learningPct}%</span>
        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${learningPct}%`, backgroundColor: '#00A3E0' }} />
        </div>
      </div>
    </div>
  );
}

// ─── Role group row ──────────────────────────────────────────────────────────

function RoleGroupRow({ role, users, onUserClick }) {
  const [open, setOpen] = useState(false);
  const target = ROLE_TARGETS[role] || 2.0;
  const { readiness, avgDist, metCount } = computeMetrics(users);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        {open ? <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
        <span className="text-sm font-semibold text-[#3D3D3D] flex-1">{role}</span>
        <span className="text-[10px] bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 mr-2">{users.length} members</span>
        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase leading-none mb-0.5">Readiness</p>
            <p className="text-sm font-bold text-[#3D3D3D]">{readiness}%</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase leading-none mb-0.5">Avg Distance</p>
            <p className="text-sm font-bold text-[#3D3D3D]">{avgDist.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase leading-none mb-0.5">Target</p>
            <p className="text-sm font-semibold text-gray-500">{target.toFixed(1)}</p>
          </div>
          <GapChip dist={avgDist} />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
            {/* Column header */}
            <div className="grid px-5 py-2 bg-white border-t border-gray-100" style={{ gridTemplateColumns: '1fr 110px 110px 140px 110px' }}>
              <span className="text-[10px] font-semibold text-gray-400 uppercase">Individual</span>
              <span className="text-center text-[10px] font-semibold text-gray-400 uppercase">Role Target Attainment</span>
              <span className="text-center text-[10px] font-semibold text-gray-400 uppercase">Avg. Distance</span>
              <span className="text-center text-[10px] font-semibold text-gray-400 uppercase">Competencies Below Target</span>
              <span className="text-center text-[10px] font-semibold text-gray-400 uppercase">Learning Progress</span>
            </div>
            <div className="divide-y divide-gray-100">
              {users.map((u, i) => <UserRow key={i} user={u} onUserClick={onUserClick} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Site row ────────────────────────────────────────────────────────────────

function SiteRow({ site, users, onUserClick }) {
  const [open, setOpen] = useState(false);
  const { readiness, avgDist } = computeMetrics(users);
  const byRole = users.reduce((acc, u) => { if (!acc[u.role]) acc[u.role] = []; acc[u.role].push(u); return acc; }, {});

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        {open ? <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-[#003DA5]">{site}</p>
          <p className="text-xs text-gray-400 mt-0.5">{users.length} participants · {Object.keys(byRole).length} role groups</p>
        </div>
        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase leading-none mb-0.5">Workforce Readiness</p>
            <p className="text-base font-bold text-[#3D3D3D]">{readiness}%</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase leading-none mb-0.5">Avg Distance</p>
            <p className="text-base font-bold text-[#3D3D3D]">{avgDist.toFixed(2)}</p>
          </div>
          <GapChip dist={avgDist} />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="border-t border-gray-100 px-4 py-4 space-y-3 bg-[#F8F9FB]">
              <p className="text-[10px] font-semibold uppercase text-gray-400 px-1">Role Groups</p>
              {Object.entries(byRole).map(([role, roleUsers]) => (
                <RoleGroupRow key={role} role={role} users={roleUsers} onUserClick={onUserClick} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Overview metric card ────────────────────────────────────────────────────

function MetricCard({ icon: Icon, label, value, sub, color = '#00A3E0' }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-5 py-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium leading-tight">{label}</p>
      </div>
      <p className="text-2xl font-bold text-[#3D3D3D]">{value}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function CompetencyDetail() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const params = new URLSearchParams(window.location.search);
  const domainName = params.get('domain') || 'Quality Leadership';
  const compName = params.get('competency') || '';

  const domainComps = COMPETENCY_DATA[domainName] || [];
  const comp = domainComps.find(c => c.name === compName) || domainComps[0];
  const users = comp ? comp.users : [];

  const domainColor = DOMAIN_COLORS[domainName] || '#00A3E0';

  const { readiness, avgScore, avgDist, metCount } = computeMetrics(users);
  const critCount = users.filter(u => Math.max(0, (ROLE_TARGETS[u.role] || 2.0) - u.score) > 0.5).length;
  const bySite = users.reduce((acc, u) => { if (!acc[u.site]) acc[u.site] = []; acc[u.site].push(u); return acc; }, {});

  const PAGE_SIZE = 8;
  const allSiteNames = useMemo(() => Object.keys(bySite).sort(), [bySite]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelType, setPanelType] = useState(null);
  const [panelName, setPanelName] = useState(null);
  const [siteFilterSearch, setSiteFilterSearch] = useState('');
  const [selectedSites, setSelectedSites] = useState([]); // empty = all
  const [sitePage, setSitePage] = useState(0);

  const dropdownSites = useMemo(() => {
    if (!siteFilterSearch.trim()) return allSiteNames;
    return allSiteNames.filter(s => s.toLowerCase().includes(siteFilterSearch.toLowerCase()));
  }, [allSiteNames, siteFilterSearch]);

  const activeSites = selectedSites.length === 0 ? allSiteNames : selectedSites;

  const filteredSites = useMemo(() => {
    return activeSites.sort((a, b) => a.localeCompare(b)).map(site => [site, bySite[site]]).filter(([, v]) => v);
  }, [activeSites, bySite]);

  const totalPages = Math.ceil(filteredSites.length / PAGE_SIZE);
  const pagedSites = filteredSites.slice(sitePage * PAGE_SIZE, (sitePage + 1) * PAGE_SIZE);

  const toggleSite = (site) => {
    setSitePage(0);
    setSelectedSites(prev => {
      if (prev.includes(site)) return prev.filter(s => s !== site);
      return [...prev, site];
    });
  };

  const clearSites = () => { setSelectedSites([]); setSitePage(0); setSiteFilterSearch(''); };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = React.useRef(null);
  React.useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  const handleOpenPanel = (type, name) => {
    setPanelType(type);
    setPanelName(name);
    setPanelOpen(true);
  };

  const aiSummary = `${comp ? comp.name : ''} shows an organizational readiness of ${readiness}% with ${metCount} of ${users.length} individuals meeting their role target. Average distance to target is ${avgDist.toFixed(2)}. ${critCount > 0 ? `${critCount} individuals are in the critical range and require priority development attention.` : 'No individuals are in the critical range.'} Targeted learning pathways in this competency area could close the average gap within 1–2 assessment cycles.`;

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <Header currentPage="Executive" />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <Link to={createPageUrl('ExecutiveDashboard')} className="hover:text-[#00A3E0] transition-colors font-medium">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-medium" style={{ color: domainColor }}>{domainName}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#3D3D3D] font-semibold truncate">{comp ? comp.name : ''}</span>
          </nav>

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <button
                  onClick={() => handleOpenPanel('domain', domainName)}
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded hover:opacity-80 transition-opacity cursor-pointer group"
                  style={{ backgroundColor: `${domainColor}18`, color: domainColor }}
                >
                  {domainName}
                  <Info className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </button>
              </div>
              <div className="flex items-start gap-2 group">
                <button
                  onClick={() => handleOpenPanel('competency', comp ? comp.name : '')}
                  className="text-xl font-bold text-[#3D3D3D] leading-snug hover:text-[#00A3E0] transition-colors text-left flex-1"
                >
                  {comp ? comp.name : 'Competency'}
                </button>
                <Info className="w-5 h-5 text-gray-300 group-hover:text-[#00A3E0] transition-colors flex-shrink-0 mt-0.5" />
              </div>
              <p className="text-xs text-gray-500 mt-1">{users.length} participants · {Object.keys(bySite).length} sites</p>
            </div>
            <Link to={createPageUrl('ExecutiveDashboard')} className="flex-shrink-0">
              <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#00A3E0] border border-gray-200 rounded-lg px-3 py-2 transition-colors bg-white hover:border-[#00A3E0]">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Section label + Overview metrics */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">[Parent Org] Competency Summary</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard icon={Target} label="Workforce Readiness" value={`${readiness}%`} sub={`${metCount} of ${users.length} on target`} color={domainColor} />
            <MetricCard icon={Users} label="Participants" value={users.length} sub={`across ${Object.keys(bySite).length} sites`} color="#6B4C9A" />
            <MetricCard icon={AlertTriangle} label="Avg Distance to Target" value={avgDist.toFixed(2)} sub={`avg score ${avgScore.toFixed(1)}`} color={critCount > 0 ? '#DC2626' : '#059669'} />
            <MetricCard icon={BookOpen} label="Needs Priority Support" value={`${critCount} of ${users.length}`} sub="score >0.50 below role target" color="#DC2626" />
          </div>
        </motion.div>

        {/* AI Summary */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.05 }}
          className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#00A3E0]" />
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#00A3E0]">AI Summary</p>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{aiSummary}</p>
        </motion.div>

        <hr className="border-gray-200" />

        {/* Site Filter Bar */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide flex-shrink-0">
              <Filter className="w-3.5 h-3.5" />
              Filter Sites
            </div>

            {/* Dropdown trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(o => !o)}
                className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-lg px-3 py-1.5 hover:border-[#00A3E0] hover:text-[#00A3E0] transition-colors bg-white"
              >
                <Search className="w-3 h-3" />
                {selectedSites.length === 0 ? `All ${allSiteNames.length} sites` : `${selectedSites.length} selected`}
                <ChevronDown className="w-3 h-3" />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 top-full mt-1 z-30 bg-white border border-gray-200 rounded-xl shadow-lg w-64">
                  <div className="p-2 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search sites..."
                        value={siteFilterSearch}
                        onChange={e => setSiteFilterSearch(e.target.value)}
                        className="w-full pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A3E0]"
                      />
                    </div>
                  </div>
                  <div className="max-h-52 overflow-y-auto py-1">
                    {dropdownSites.map(site => (
                      <button
                        key={site}
                        onClick={() => toggleSite(site)}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-gray-50 transition-colors ${selectedSites.includes(site) ? 'text-[#00A3E0] font-semibold' : 'text-gray-700'}`}
                      >
                        <span className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${selectedSites.includes(site) ? 'bg-[#00A3E0] border-[#00A3E0]' : 'border-gray-300'}`}>
                          {selectedSites.includes(site) && <span className="text-white text-[8px]">✓</span>}
                        </span>
                        {site}
                      </button>
                    ))}
                    {dropdownSites.length === 0 && <p className="text-xs text-gray-400 text-center py-3">No sites found</p>}
                  </div>
                  <div className="p-2 border-t border-gray-100 flex justify-between">
                    <button onClick={clearSites} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Clear all</button>
                    <button onClick={() => { setDropdownOpen(false); setSiteFilterSearch(''); }} className="text-xs text-[#00A3E0] font-semibold hover:underline">Done</button>
                  </div>
                </div>
              )}
            </div>

            {/* Selected site chips */}
            {selectedSites.map(site => (
              <span key={site} className="inline-flex items-center gap-1 bg-[#00A3E0]/10 text-[#00A3E0] text-[11px] font-medium rounded-full px-2.5 py-0.5">
                {site}
                <button onClick={() => toggleSite(site)} className="hover:text-[#0087bd] transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {selectedSites.length > 0 && (
              <button onClick={clearSites} className="text-xs text-gray-400 hover:text-gray-600 ml-auto transition-colors">
                Clear all
              </button>
            )}
          </div>
        </motion.div>

        <hr className="border-gray-200" />

        {/* Heatmap */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.1 }}>
          <CompetencyHeatmap users={users} selectedSites={selectedSites.length > 0 ? selectedSites : null} />
        </motion.div>

        {/* Site breakdown */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.1 }}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <h2 className="text-sm font-bold text-[#3D3D3D] uppercase tracking-wide">Breakdown by Site</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {selectedSites.length > 0 ? `Showing ${filteredSites.length} of ${allSiteNames.length} sites` : `All ${allSiteNames.length} sites`} · Click a site to expand role groups.
              </p>
            </div>
          </div>

          {filteredSites.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10 bg-white rounded-xl border border-gray-200">No sites match the selected filter.</p>
          ) : (
            <>
              <div className="space-y-3">
                {pagedSites.map(([site, siteUsers]) => (
                  <SiteRow key={site} site={site} users={siteUsers} onUserClick={setSelectedUser} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-400">
                    Showing {sitePage * PAGE_SIZE + 1}–{Math.min((sitePage + 1) * PAGE_SIZE, filteredSites.length)} of {filteredSites.length} sites
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSitePage(p => Math.max(0, p - 1))}
                      disabled={sitePage === 0}
                      className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setSitePage(i)}
                        className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                          i === sitePage
                            ? 'bg-[#00A3E0] text-white'
                            : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setSitePage(p => Math.min(totalPages - 1, p + 1))}
                      disabled={sitePage === totalPages - 1}
                      className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      <DomainCompetencyPanel 
        isOpen={panelOpen} 
        onClose={() => setPanelOpen(false)} 
        type={panelType} 
        name={panelName} 
      />
    </div>
  );
}