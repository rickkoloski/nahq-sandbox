import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ChevronDown, ChevronRight, BarChart3, Users, Network, Settings, Globe, Shield, CheckSquare, ClipboardCheck, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DOMAIN_ICONS = {
  'Quality Leadership': Network,
  'Patient Safety': Shield,
  'Professional Engagement': Users,
  'Performance Improvement': Settings,
  'Population Health': Globe,
  'Health Data Analytics': BarChart3,
  'Regulatory & Accreditation': CheckSquare,
  'Quality Review & Accountability': ClipboardCheck,
};

// Role-based targets per role group (NAHQ Standard)
const ROLE_TARGETS = {
  'Director of Quality': 2.3,
  'Quality Manager': 2.1,
  'Quality Specialist': 1.8,
  'Quality Analyst': 1.9,
};

const COMPETENCY_DATA = {
  'Quality Leadership': [
    { name: 'Lead and sponsor quality initiatives', users: [
      { name: 'Sarah Chen', role: 'Director of Quality', score: 2.0 },
      { name: 'James Rodriguez', role: 'Quality Manager', score: 1.5 },
      { name: 'Maria Garcia', role: 'Director of Quality', score: 2.2 },
      { name: 'David Kim', role: 'Quality Specialist', score: 1.8 },
      { name: 'Jennifer Lee', role: 'Director of Quality', score: 2.5 },
      { name: 'Michael Brown', role: 'Quality Manager', score: 1.7 },
      { name: 'Patricia Johnson', role: 'Quality Manager', score: 2.3 },
      { name: 'Robert Wilson', role: 'Quality Specialist', score: 1.4 },
      { name: 'Linda Martinez', role: 'Director of Quality', score: 2.6 },
      { name: 'Christopher Davis', role: 'Quality Manager', score: 1.9 },
    ]},
    { name: 'Foster a culture of continuous improvement', users: [
      { name: 'Sarah Chen', role: 'Director of Quality', score: 2.1 },
      { name: 'James Rodriguez', role: 'Quality Manager', score: 1.6 },
      { name: 'Maria Garcia', role: 'Director of Quality', score: 2.4 },
      { name: 'David Kim', role: 'Quality Specialist', score: 2.0 },
      { name: 'Jennifer Lee', role: 'Director of Quality', score: 2.7 },
      { name: 'Michael Brown', role: 'Quality Manager', score: 1.5 },
      { name: 'Patricia Johnson', role: 'Quality Manager', score: 2.2 },
      { name: 'Robert Wilson', role: 'Quality Specialist', score: 2.0 },
      { name: 'Linda Martinez', role: 'Director of Quality', score: 2.8 },
      { name: 'Christopher Davis', role: 'Quality Manager', score: 2.1 },
    ]},
    { name: 'Communicate quality priorities and results', users: [
      { name: 'Sarah Chen', role: 'Director of Quality', score: 1.9 },
      { name: 'James Rodriguez', role: 'Quality Manager', score: 1.4 },
      { name: 'Maria Garcia', role: 'Director of Quality', score: 2.0 },
      { name: 'David Kim', role: 'Quality Specialist', score: 1.7 },
      { name: 'Jennifer Lee', role: 'Director of Quality', score: 2.3 },
      { name: 'Michael Brown', role: 'Quality Manager', score: 1.5 },
      { name: 'Patricia Johnson', role: 'Quality Manager', score: 1.9 },
      { name: 'Robert Wilson', role: 'Quality Specialist', score: 1.6 },
      { name: 'Linda Martinez', role: 'Director of Quality', score: 2.1 },
      { name: 'Christopher Davis', role: 'Quality Manager', score: 1.8 },
    ]},
    { name: 'Build and sustain cross-functional teams', users: [
      { name: 'Sarah Chen', role: 'Director of Quality', score: 1.8 },
      { name: 'James Rodriguez', role: 'Quality Manager', score: 1.3 },
      { name: 'Maria Garcia', role: 'Director of Quality', score: 1.9 },
      { name: 'David Kim', role: 'Quality Specialist', score: 1.6 },
      { name: 'Jennifer Lee', role: 'Director of Quality', score: 2.1 },
      { name: 'Michael Brown', role: 'Quality Manager', score: 1.4 },
      { name: 'Patricia Johnson', role: 'Quality Manager', score: 1.7 },
      { name: 'Robert Wilson', role: 'Quality Specialist', score: 1.5 },
      { name: 'Linda Martinez', role: 'Director of Quality', score: 1.9 },
      { name: 'Christopher Davis', role: 'Quality Manager', score: 1.7 },
    ]},
  ],
  'Patient Safety': [
    { name: 'Create and maintain a safe environment', users: [
      { name: 'Sarah Chen', role: 'Director of Quality', score: 2.1 },
      { name: 'James Rodriguez', role: 'Quality Manager', score: 1.7 },
      { name: 'Maria Garcia', role: 'Director of Quality', score: 2.2 },
      { name: 'David Kim', role: 'Quality Specialist', score: 2.0 },
      { name: 'Jennifer Lee', role: 'Director of Quality', score: 2.5 },
      { name: 'Michael Brown', role: 'Quality Manager', score: 1.6 },
      { name: 'Patricia Johnson', role: 'Quality Manager', score: 2.0 },
      { name: 'Robert Wilson', role: 'Quality Specialist', score: 1.9 },
      { name: 'Linda Martinez', role: 'Director of Quality', score: 2.6 },
      { name: 'Christopher Davis', role: 'Quality Manager', score: 1.8 },
    ]},
    { name: 'Identify and mitigate patient safety risks', users: [
      { name: 'Sarah Chen', role: 'Director of Quality', score: 2.0 },
      { name: 'James Rodriguez', role: 'Quality Manager', score: 1.5 },
      { name: 'Maria Garcia', role: 'Director of Quality', score: 2.1 },
      { name: 'David Kim', role: 'Quality Specialist', score: 1.9 },
      { name: 'Jennifer Lee', role: 'Director of Quality', score: 2.4 },
      { name: 'Michael Brown', role: 'Quality Manager', score: 1.6 },
      { name: 'Patricia Johnson', role: 'Quality Manager', score: 2.0 },
      { name: 'Robert Wilson', role: 'Quality Specialist', score: 1.8 },
      { name: 'Linda Martinez', role: 'Director of Quality', score: 2.5 },
      { name: 'Christopher Davis', role: 'Quality Manager', score: 1.9 },
    ]},
    { name: 'Respond to and learn from safety events', users: [
      { name: 'Sarah Chen', role: 'Director of Quality', score: 2.2 },
      { name: 'James Rodriguez', role: 'Quality Manager', score: 1.8 },
      { name: 'Maria Garcia', role: 'Director of Quality', score: 2.3 },
      { name: 'David Kim', role: 'Quality Specialist', score: 2.1 },
      { name: 'Jennifer Lee', role: 'Director of Quality', score: 2.6 },
      { name: 'Michael Brown', role: 'Quality Manager', score: 2.0 },
      { name: 'Patricia Johnson', role: 'Quality Manager', score: 2.1 },
      { name: 'Robert Wilson', role: 'Quality Specialist', score: 1.9 },
      { name: 'Linda Martinez', role: 'Director of Quality', score: 2.7 },
      { name: 'Christopher Davis', role: 'Quality Manager', score: 2.0 },
    ]},
  ],
  'Performance Improvement': [
    { name: 'Use data to identify improvement opportunities', users: [
      { name: 'Sarah Chen', role: 'Director of Quality', score: 1.8 },
      { name: 'James Rodriguez', role: 'Quality Manager', score: 1.2 },
      { name: 'Maria Garcia', role: 'Director of Quality', score: 1.9 },
      { name: 'David Kim', role: 'Quality Specialist', score: 1.5 },
      { name: 'Jennifer Lee', role: 'Director of Quality', score: 2.2 },
      { name: 'Michael Brown', role: 'Quality Manager', score: 1.3 },
      { name: 'Patricia Johnson', role: 'Quality Manager', score: 1.6 },
      { name: 'Robert Wilson', role: 'Quality Specialist', score: 1.4 },
      { name: 'Linda Martinez', role: 'Director of Quality', score: 1.8 },
      { name: 'Christopher Davis', role: 'Quality Manager', score: 1.7 },
    ]},
    { name: 'Plan and implement improvement initiatives', users: [
      { name: 'Sarah Chen', role: 'Director of Quality', score: 1.9 },
      { name: 'James Rodriguez', role: 'Quality Manager', score: 1.3 },
      { name: 'Maria Garcia', role: 'Director of Quality', score: 2.0 },
      { name: 'David Kim', role: 'Quality Specialist', score: 1.6 },
      { name: 'Jennifer Lee', role: 'Director of Quality', score: 2.3 },
      { name: 'Michael Brown', role: 'Quality Manager', score: 1.4 },
      { name: 'Patricia Johnson', role: 'Quality Manager', score: 1.7 },
      { name: 'Robert Wilson', role: 'Quality Specialist', score: 1.5 },
      { name: 'Linda Martinez', role: 'Director of Quality', score: 1.9 },
      { name: 'Christopher Davis', role: 'Quality Manager', score: 1.8 },
    ]},
  ],
  'Health Data Analytics': [
    { name: 'Apply procedures for governance of data assets', users: [
      { name: 'Sarah Chen', role: 'Director of Quality', score: 1.7 },
      { name: 'James Rodriguez', role: 'Quality Manager', score: 1.1 },
      { name: 'Maria Garcia', role: 'Director of Quality', score: 1.8 },
      { name: 'David Kim', role: 'Quality Specialist', score: 1.4 },
      { name: 'Jennifer Lee', role: 'Director of Quality', score: 2.1 },
      { name: 'Michael Brown', role: 'Quality Manager', score: 1.2 },
      { name: 'Patricia Johnson', role: 'Quality Manager', score: 1.9 },
      { name: 'Robert Wilson', role: 'Quality Specialist', score: 1.3 },
      { name: 'Linda Martinez', role: 'Director of Quality', score: 1.6 },
      { name: 'Christopher Davis', role: 'Quality Manager', score: 1.5 },
    ]},
    { name: 'Design data collection plans', users: [
      { name: 'Sarah Chen', role: 'Director of Quality', score: 1.6 },
      { name: 'James Rodriguez', role: 'Quality Manager', score: 1.0 },
      { name: 'Maria Garcia', role: 'Director of Quality', score: 1.7 },
      { name: 'David Kim', role: 'Quality Specialist', score: 1.3 },
      { name: 'Jennifer Lee', role: 'Director of Quality', score: 2.0 },
      { name: 'Michael Brown', role: 'Quality Manager', score: 1.1 },
      { name: 'Patricia Johnson', role: 'Quality Manager', score: 1.8 },
      { name: 'Robert Wilson', role: 'Quality Specialist', score: 1.2 },
      { name: 'Linda Martinez', role: 'Director of Quality', score: 1.5 },
      { name: 'Christopher Davis', role: 'Quality Manager', score: 1.4 },
    ]},
    { name: 'Acquire data from source systems', users: [
      { name: 'Sarah Chen', role: 'Director of Quality', score: 1.5 },
      { name: 'James Rodriguez', role: 'Quality Manager', score: 1.0 },
      { name: 'Maria Garcia', role: 'Director of Quality', score: 1.6 },
      { name: 'David Kim', role: 'Quality Specialist', score: 1.2 },
      { name: 'Jennifer Lee', role: 'Director of Quality', score: 1.8 },
      { name: 'Michael Brown', role: 'Quality Manager', score: 1.0 },
      { name: 'Patricia Johnson', role: 'Quality Manager', score: 1.3 },
      { name: 'Robert Wilson', role: 'Quality Specialist', score: 1.1 },
      { name: 'Linda Martinez', role: 'Director of Quality', score: 1.4 },
      { name: 'Christopher Davis', role: 'Quality Manager', score: 1.2 },
    ]},
  ],
  'Regulatory & Accreditation': [
    { name: 'Understand regulatory and accreditation requirements', users: [
      { name: 'Sarah Chen', role: 'Director of Quality', score: 2.1 },
      { name: 'James Rodriguez', role: 'Quality Manager', score: 1.7 },
      { name: 'Maria Garcia', role: 'Director of Quality', score: 2.0 },
      { name: 'David Kim', role: 'Quality Specialist', score: 1.9 },
      { name: 'Jennifer Lee', role: 'Director of Quality', score: 2.3 },
      { name: 'Michael Brown', role: 'Quality Manager', score: 1.6 },
      { name: 'Patricia Johnson', role: 'Quality Manager', score: 1.9 },
      { name: 'Robert Wilson', role: 'Quality Specialist', score: 1.8 },
      { name: 'Linda Martinez', role: 'Director of Quality', score: 2.4 },
      { name: 'Christopher Davis', role: 'Quality Manager', score: 1.9 },
    ]},
    { name: 'Prepare for surveys and assessments', users: [
      { name: 'Sarah Chen', role: 'Director of Quality', score: 2.0 },
      { name: 'James Rodriguez', role: 'Quality Manager', score: 1.6 },
      { name: 'Maria Garcia', role: 'Director of Quality', score: 2.0 },
      { name: 'David Kim', role: 'Quality Specialist', score: 1.8 },
      { name: 'Jennifer Lee', role: 'Director of Quality', score: 2.2 },
      { name: 'Michael Brown', role: 'Quality Manager', score: 1.5 },
      { name: 'Patricia Johnson', role: 'Quality Manager', score: 1.8 },
      { name: 'Robert Wilson', role: 'Quality Specialist', score: 1.7 },
      { name: 'Linda Martinez', role: 'Director of Quality', score: 2.3 },
      { name: 'Christopher Davis', role: 'Quality Manager', score: 1.8 },
    ]},
  ]
};

// WFA National Benchmark (% of all WFA participants meeting target)
const WFA_BENCHMARK_PCT = 60;

// Helper: compute workforce attainment % and avg distance to target from a list of {score, role}
function computeAttainmentMetrics(users) {
  if (!users || users.length === 0) return { attainmentPct: 0, avgDistance: 0 };
  let meetingCount = 0;
  let totalDistance = 0;
  users.forEach(u => {
    const target = ROLE_TARGETS[u.role] || 2.0;
    if (u.score >= target) meetingCount++;
    totalDistance += Math.max(0, target - u.score);
  });
  return {
    attainmentPct: Math.round((meetingCount / users.length) * 100),
    avgDistance: parseFloat((totalDistance / users.length).toFixed(2)),
  };
}

// Helper: get all users across all competencies in all domains
function getAllUsers() {
  const all = [];
  Object.values(COMPETENCY_DATA).forEach(comps => {
    comps.forEach(comp => {
      comp.users.forEach(u => {
        if (!all.find(x => x.name === u.name)) all.push(u);
      });
    });
  });
  return all;
}

function getDistanceLabel(d) {
  if (d === 0) return { label: 'On Target', color: '#10B981' };
  if (d <= 0.20) return { label: 'On Target', color: '#10B981' };
  if (d <= 0.50) return { label: 'Moderate', color: '#F68B1F' };
  return { label: 'Critical', color: '#ED1C24' };
}

function DistanceBadge({ distance }) {
  const info = getDistanceLabel(distance);
  return (
    <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap" style={{ color: info.color, backgroundColor: `${info.color}18` }}>
      {info.label}
    </span>
  );
}

// Compute domain attainment from domain distribution using average score proxy
function computeDomainMetrics(domain) {
  // Use competency user data if available
  const comps = COMPETENCY_DATA[domain.name];
  if (comps) {
    const allUsers = [];
    comps.forEach(c => c.users.forEach(u => {
      const existing = allUsers.find(x => x.name === u.name);
      if (!existing) allUsers.push({ ...u });
    }));
    return computeAttainmentMetrics(allUsers);
  }
  // Fallback: use distribution
  const total = domain.foundational + domain.proficient + domain.advanced;
  const avgScore = (domain.foundational * 1 + domain.proficient * 2 + domain.advanced * 3) / total;
  return { attainmentPct: Math.round((domain.proficient + domain.advanced) / total * 100), avgDistance: parseFloat(Math.max(0, 2.0 - avgScore).toFixed(2)) };
}

export default function OrganizationalCapabilitySnapshot({ data, onChatOpen }) {
  const [expandedDomain, setExpandedDomain] = useState(null);
  const [expandedCompetency, setExpandedCompetency] = useState(null);
  const [expandedRoleGroups, setExpandedRoleGroups] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [expandedModalDomain, setExpandedModalDomain] = useState(null);

  const toggleRoleGroup = (key) => setExpandedRoleGroups(prev => ({ ...prev, [key]: !prev[key] }));

  const allUsers = getAllUsers();
  const { attainmentPct, avgDistance } = computeAttainmentMetrics(allUsers);
  const distanceInfo = getDistanceLabel(avgDistance);

  return (
    <div className="space-y-8">
      {/* AI Summary */}
      <div className="bg-white rounded-xl border-2 border-[#00A3E0] p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#00A3E0]/10 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-[#00A3E0]" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#3D3D3D]">AI Assessment Overview</h3>
          </div>
          {onChatOpen && (
            <Button onClick={() => onChatOpen('capability')} variant="ghost" size="sm" className="text-[#00A3E0] hover:bg-[#00A3E0]/10 text-xs gap-1">
              <MessageCircle className="w-3 h-3" />
              Chat with AI
            </Button>
          )}
        </div>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong className="text-[#00A3E0]">{attainmentPct}%</strong> of your workforce is meeting or exceeding their role-based expectations (NAHQ Standard), with an average distance to target of <strong style={{ color: distanceInfo.color }}>{avgDistance.toFixed(2)}</strong> — classified as <em style={{ color: distanceInfo.color }}>{distanceInfo.label}</em>. The WFA national benchmark for attainment is <strong>{WFA_BENCHMARK_PCT}%</strong>.
          </p>
          <p>
            <strong>Priority Development Area:</strong> Health Data Analytics shows the largest attainment gap, with most staff below their role-based target. Focused training in data governance, statistical methods, and visualization will have the highest impact.
          </p>
          <p>
            <strong>Recommended Action:</strong> Deploy analytics training across all roles while maintaining leadership strength through advanced coursework for senior staff.
          </p>
        </div>
      </div>

      {/* Overall Workforce Attainment Summary */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
        <h3 className="text-sm font-bold text-[#3D3D3D] mb-6 uppercase tracking-wider">Workforce Readiness — Overall</h3>

        <div className="grid grid-cols-3 gap-6">
          {/* Attainment % */}
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wide">Workforce Readiness</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-[#3D3D3D]">{attainmentPct}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Meeting role-based target</p>
          </div>

          {/* Avg Distance to Target */}
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wide">Avg Distance to Target</p>
            <span className="text-4xl font-bold text-[#3D3D3D]">{avgDistance.toFixed(2)}</span>
            <div className="mt-1"><DistanceBadge distance={avgDistance} /></div>
          </div>

          {/* WFA National Benchmark */}
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wide">WFA National Benchmark</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-[#3D3D3D]">{WFA_BENCHMARK_PCT}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {attainmentPct >= WFA_BENCHMARK_PCT ? `+${attainmentPct - WFA_BENCHMARK_PCT}% above` : `${WFA_BENCHMARK_PCT - attainmentPct}% below`} benchmark
            </p>
          </div>
        </div>

        {/* Full-width progress bar vs benchmark */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span className="font-semibold">Workforce Readiness vs WFA National Benchmark</span>
            <span className={attainmentPct >= WFA_BENCHMARK_PCT ? 'text-[#10B981] font-semibold' : 'text-[#F68B1F] font-semibold'}>
              {attainmentPct >= WFA_BENCHMARK_PCT ? `+${attainmentPct - WFA_BENCHMARK_PCT}% above benchmark` : `${WFA_BENCHMARK_PCT - attainmentPct}% below benchmark`}
            </span>
          </div>
          <div className="relative h-3 bg-gray-100 rounded-full overflow-visible">
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-[#00A3E0] transition-all"
              style={{ width: `${attainmentPct}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#3D3D3D] rounded-full"
              style={{ left: `${WFA_BENCHMARK_PCT}%` }}
              title={`Benchmark: ${WFA_BENCHMARK_PCT}%`}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0%</span>
            <span style={{ marginLeft: `${WFA_BENCHMARK_PCT}%`, transform: 'translateX(-50%)', position: 'relative' }} className="text-[#3D3D3D] font-semibold">Benchmark {WFA_BENCHMARK_PCT}%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Domain Breakdown */}
      <div className="space-y-3">
        <h3 className="font-semibold text-[#3D3D3D] text-sm">Domain Workforce Readiness</h3>
        {data.domainDistribution.map((domain) => {
          const isExpanded = expandedDomain === domain.name;
          const total = domain.foundational + domain.proficient + domain.advanced;
          const { attainmentPct: domAttainPct, avgDistance: domAvgDist } = computeDomainMetrics(domain);
          const domDistInfo = getDistanceLabel(domAvgDist);
          const foundationalPct = (domain.foundational / total) * 100;
          const proficientPct = (domain.proficient / total) * 100;
          const advancedPct = (domain.advanced / total) * 100;
          const IconComponent = DOMAIN_ICONS[domain.name] || Network;

          return (
            <motion.div
              key={domain.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-[#00A3E0]/50 transition-all"
            >
              <button
                onClick={() => setExpandedDomain(isExpanded ? null : domain.name)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0">
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${domain.color}15` }}>
                      <IconComponent className="w-5 h-5" style={{ color: domain.color }} />
                    </div>
                    <p className="font-semibold text-sm text-[#3D3D3D]">{domain.name}</p>
                  </div>
                </div>

                <div className="flex items-stretch justify-end gap-0 divide-x divide-gray-200">
                  <div className="text-right px-6 flex flex-col justify-center">
                    <p className="text-[10px] text-gray-400 mb-1 font-semibold uppercase tracking-wide">Workforce Readiness</p>
                    <p className="text-xl font-bold text-[#3D3D3D]">{domAttainPct}%</p>
                  </div>
                  <div className="text-right px-6 flex flex-col justify-center">
                    <p className="text-[10px] text-gray-400 mb-1 font-semibold uppercase tracking-wide">Avg Distance</p>
                    <p className="text-xl font-bold text-[#3D3D3D]">{domAvgDist.toFixed(2)}</p>
                    <div className="flex justify-end mt-1"><DistanceBadge distance={domAvgDist} /></div>
                  </div>
                  <div className="text-right px-6 flex flex-col justify-center hidden sm:flex">
                    <p className="text-[10px] text-gray-400 mb-1 font-semibold uppercase tracking-wide">WFA Benchmark</p>
                    <p className="text-xl font-bold text-[#3D3D3D]">{WFA_BENCHMARK_PCT}%</p>
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200 bg-gray-50 p-6 space-y-6"
                  >
                    {/* Distribution Visualization */}
                    <div>
                      <h4 className="font-semibold text-[#3D3D3D] mb-4">Domain Distribution</h4>
                      <div className="flex h-8 rounded-lg overflow-hidden gap-0.5 mb-4">
                        <div className="flex items-center justify-center bg-[#F59E0B]" style={{ width: `${foundationalPct}%` }}>
                          {foundationalPct > 12 && <span className="text-xs font-bold text-white">{foundationalPct.toFixed(0)}%</span>}
                        </div>
                        <div className="flex items-center justify-center bg-[#10B981]" style={{ width: `${proficientPct}%` }}>
                          {proficientPct > 12 && <span className="text-xs font-bold text-white">{proficientPct.toFixed(0)}%</span>}
                        </div>
                        <div className="flex items-center justify-center bg-[#00A3E0]" style={{ width: `${advancedPct}%` }}>
                          {advancedPct > 12 && <span className="text-xs font-bold text-white">{advancedPct.toFixed(0)}%</span>}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-200">
                        <div className="bg-white rounded-lg p-4 border border-gray-100">
                          <p className="text-xs text-gray-600 mb-2 font-medium">Foundational</p>
                          <p className="text-2xl font-bold text-[#F59E0B]">{domain.foundational}</p>
                          <p className="text-xs text-gray-500 mt-1">({foundationalPct.toFixed(0)}%)</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-100">
                          <p className="text-xs text-gray-600 mb-2 font-medium">Proficient</p>
                          <p className="text-2xl font-bold text-[#10B981]">{domain.proficient}</p>
                          <p className="text-xs text-gray-500 mt-1">({proficientPct.toFixed(0)}%)</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-100">
                          <p className="text-xs text-gray-600 mb-2 font-medium">Advanced</p>
                          <p className="text-2xl font-bold text-[#3B82F6]">{domain.advanced}</p>
                          <p className="text-xs text-gray-500 mt-1">({advancedPct.toFixed(0)}%)</p>
                        </div>
                      </div>
                    </div>

                    {/* Competency Table */}
                    {COMPETENCY_DATA[domain.name] && (
                      <div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b-2 border-gray-300">
                                <th className="text-left py-3 px-3 font-semibold text-gray-700">Competency</th>
                                <th className="text-center py-3 px-3 font-semibold text-gray-700">Workforce Readiness</th>
                                <th className="text-center py-3 px-3 font-semibold text-gray-700">Avg Distance to Target</th>
                                <th className="text-center py-3 px-3 font-semibold text-gray-700">WFA Benchmark</th>
                              </tr>
                            </thead>
                            <tbody>
                              {COMPETENCY_DATA[domain.name].map((comp, idx) => {
                                const compKey = `${domain.name}-${idx}`;
                                const isCompExpanded = expandedCompetency === compKey;
                                const { attainmentPct: cAttPct, avgDistance: cAvgDist } = computeAttainmentMetrics(comp.users);
                                const cDistInfo = getDistanceLabel(cAvgDist);
                                return (
                                  <React.Fragment key={idx}>
                                    <tr
                                      onClick={() => setExpandedCompetency(isCompExpanded ? null : compKey)}
                                      className="border-b border-gray-200 hover:bg-[#00A3E0]/5 transition-colors cursor-pointer"
                                    >
                                      <td className="py-4 px-3 text-gray-700 flex items-center gap-2">
                                        {isCompExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                                        {comp.name}
                                      </td>
                                      <td className="text-center py-4 px-3 font-bold text-[#3D3D3D]">{cAttPct}%</td>
                                      <td className="text-center py-4 px-3">
                                        <p className="font-semibold text-[#3D3D3D]">{cAvgDist.toFixed(2)}</p>
                                        <div className="flex justify-center mt-1"><DistanceBadge distance={cAvgDist} /></div>
                                      </td>
                                      <td className="text-center py-4 px-3 text-gray-500 font-semibold">{WFA_BENCHMARK_PCT}%</td>
                                    </tr>
                                    <AnimatePresence>
                                      {isCompExpanded && (
                                        <tr className="border-b border-gray-200">
                                          <td colSpan="4" className="py-4 px-3">
                                            <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="bg-white space-y-4 pt-2"
                                            >
                                            {/* Skill Level Distribution */}
                                            {(() => {
                                              const nCount = comp.users.filter(u => u.score < 1).length;
                                              const fCount = comp.users.filter(u => u.score >= 1 && u.score < 2).length;
                                              const pCount = comp.users.filter(u => u.score >= 2 && u.score < 3).length;
                                              const aCount = comp.users.filter(u => u.score >= 3).length;
                                              const total = comp.users.length;
                                              const bars = [
                                                { label: 'Not Demonstrated', short: 'N', count: nCount, color: '#9CA3AF', bg: '#F3F4F6' },
                                                { label: 'Foundational', short: 'F', count: fCount, color: '#D97706', bg: '#FEF3C7' },
                                                { label: 'Proficient', short: 'P', count: pCount, color: '#059669', bg: '#D1FAE5' },
                                                { label: 'Advanced', short: 'A', count: aCount, color: '#2563EB', bg: '#DBEAFE' },
                                              ];
                                              return (
                                                <div className="mb-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
                                                  <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">Skill Level Distribution</p>
                                                  <div className="flex h-6 rounded-md overflow-hidden gap-0.5 mb-3">
                                                    {bars.filter(b => b.count > 0).map(b => (
                                                      <div key={b.short} className="flex items-center justify-center" style={{ width: `${(b.count / total) * 100}%`, backgroundColor: b.color }}>
                                                        {(b.count / total) > 0.12 && <span className="text-xs font-bold text-white">{Math.round((b.count / total) * 100)}%</span>}
                                                      </div>
                                                    ))}
                                                  </div>
                                                  <div className="grid grid-cols-4 gap-2">
                                                    {bars.map(b => (
                                                      <div key={b.short} className="flex items-center gap-1.5">
                                                        <span className="w-5 h-5 rounded text-xs font-bold flex items-center justify-center flex-shrink-0" style={{ backgroundColor: b.bg, color: b.color }}>{b.short}</span>
                                                        <div>
                                                          <p className="text-[10px] text-gray-500 leading-tight">{b.label}</p>
                                                          <p className="text-xs font-bold text-gray-700">{b.count} <span className="font-normal text-gray-400">({Math.round((b.count/total)*100)}%)</span></p>
                                                        </div>
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              );
                                            })()}
                                            <p className="text-xs font-semibold text-gray-600 mb-3">Results by Role Group ({comp.users.length} participants)</p>
                                               <div className="space-y-2">
                                                  {(() => {
                                                    const usersByRole = comp.users.reduce((acc, u) => {
                                                      if (!acc[u.role]) acc[u.role] = [];
                                                      acc[u.role].push(u);
                                                      return acc;
                                                    }, {});
                                                    return Object.entries(usersByRole).map(([role, users]) => {
                                                      const roleGroupKey = `${domain.name}-${idx}-${role}`;
                                                      const isRoleExpanded = expandedRoleGroups[roleGroupKey];
                                                      const target = ROLE_TARGETS[role] || 2.0;
                                                      const { attainmentPct: rgAtt, avgDistance: rgDist } = computeAttainmentMetrics(users);
                                                      return (
                                                        <div key={role} className="border border-gray-200 rounded-lg overflow-hidden">
                                                          {/* Role Group Summary Row - collapsible */}
                                                          <button
                                                            onClick={() => toggleRoleGroup(roleGroupKey)}
                                                            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                                                          >
                                                            <div className="flex items-center gap-2">
                                                              {isRoleExpanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                                                              <p className="text-xs font-bold text-gray-700">{role}</p>
                                                              <span className="text-xs text-gray-400">({users.length})</span>
                                                            </div>
                                                            <div className="flex items-center gap-6">
                                                              <div className="text-right">
                                                                <p className="text-xs text-gray-400">Readiness</p>
                                                                <p className="text-sm font-bold text-[#3D3D3D]">{rgAtt}%</p>
                                                              </div>
                                                              <div className="text-right">
                                                               <p className="text-xs text-gray-400">Avg Distance</p>
                                                               <p className="text-sm font-bold text-[#3D3D3D]">{rgDist.toFixed(2)}</p>
                                                               <div className="flex justify-end mt-0.5"><DistanceBadge distance={rgDist} /></div>
                                                              </div>
                                                              <div className="text-right">
                                                                <p className="text-xs text-gray-400">Target</p>
                                                                <p className="text-sm font-semibold text-gray-600">{target.toFixed(1)}</p>
                                                              </div>
                                                            </div>
                                                          </button>
                                                          {/* Individual rows */}
                                                          <AnimatePresence>
                                                            {isRoleExpanded && (
                                                              <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="overflow-hidden"
                                                              >
                                                                <div className="bg-white">
                                                                  {/* Column headers */}
                                                                  <div className="grid grid-cols-12 gap-2 items-center px-4 py-2 bg-gray-50 border-b border-gray-200">
                                                                    <div className="col-span-5 pl-5">
                                                                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Individual</p>
                                                                    </div>
                                                                    <div className="col-span-2 text-center">
                                                                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Results</p>
                                                                    </div>
                                                                    <div className="col-span-2 text-center">
                                                                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">NAHQ Std</p>
                                                                    </div>
                                                                    <div className="col-span-2 text-center">
                                                                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Avg. Distance</p>
                                                                    </div>
                                                                    <div className="col-span-1 text-center">
                                                                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Level</p>
                                                                    </div>
                                                                  </div>
                                                                  <div className="divide-y divide-gray-100">
                                                                  {users.map((user, uIdx) => {
                                                                    const dist = Math.max(0, target - user.score);
                                                                    const meetingTarget = user.score >= target;
                                                                    // Determine level badge: score < 1 = N, 1–1.9 = F, 2–2.9 = P, 3+ = A
                                                                    let levelLabel, levelBg, levelColor;
                                                                    if (user.score < 1) {
                                                                      levelLabel = 'N'; levelBg = '#F3F4F6'; levelColor = '#6B7280';
                                                                    } else if (user.score < 2) {
                                                                      levelLabel = 'F'; levelBg = '#FEF3C7'; levelColor = '#D97706';
                                                                    } else if (user.score < 3) {
                                                                      levelLabel = 'P'; levelBg = '#D1FAE5'; levelColor = '#059669';
                                                                    } else {
                                                                      levelLabel = 'A'; levelBg = '#DBEAFE'; levelColor = '#2563EB';
                                                                    }
                                                                    return (
                                                                      <div key={uIdx} className="grid grid-cols-12 gap-2 items-center px-4 py-2.5 hover:bg-gray-50">
                                                                        <div className="col-span-5 pl-5">
                                                                          <p className="text-xs text-gray-700 truncate">{user.name}</p>
                                                                        </div>
                                                                        <div className="col-span-2 text-center">
                                                                          <p className="text-xs font-semibold text-[#3D3D3D]">{user.score.toFixed(1)}</p>
                                                                        </div>
                                                                        <div className="col-span-2 text-center">
                                                                          <p className="text-xs text-gray-500">{target.toFixed(1)}</p>
                                                                        </div>
                                                                        <div className="col-span-2 text-center">
                                                                          <p className="text-xs font-semibold text-[#3D3D3D]">{meetingTarget ? '0.00' : dist.toFixed(2)}</p>
                                                                          <DistanceBadge distance={meetingTarget ? 0 : dist} />
                                                                        </div>
                                                                        <div className="col-span-1 flex justify-center">
                                                                          <span className="text-xs font-bold w-6 h-6 rounded flex items-center justify-center"
                                                                            style={{ backgroundColor: levelBg, color: levelColor }}>
                                                                            {levelLabel}
                                                                          </span>
                                                                        </div>
                                                                      </div>
                                                                    );
                                                                  })}
                                                                  </div>
                                                                </div>
                                                              </motion.div>
                                                            )}
                                                          </AnimatePresence>
                                                        </div>
                                                      );
                                                    });
                                                  })()}
                                                </div>
                                            </motion.div>
                                          </td>
                                        </tr>
                                      )}
                                    </AnimatePresence>
                                  </React.Fragment>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#3D3D3D]">{selectedUser.name}</h2>
                <p className="text-gray-600 text-sm mt-0.5">{selectedUser.role}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              {(() => {
                const target = ROLE_TARGETS[selectedUser.role] || 2.0;
                const dist = Math.max(0, target - selectedUser.score);
                const meeting = selectedUser.score >= target;
                const dInfo = getDistanceLabel(dist);
                return (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-[#00A3E0]/5 rounded-xl p-4 border border-[#00A3E0]/20 text-center">
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Score</p>
                        <p className="text-3xl font-bold text-[#00A3E0]">{selectedUser.score.toFixed(1)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Role Target</p>
                        <p className="text-3xl font-bold text-[#3D3D3D]">{target.toFixed(1)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Distance</p>
                        <p className="text-3xl font-bold text-[#3D3D3D]">{dist.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="rounded-xl p-4 border border-gray-200 bg-gray-50">
                      <p className="text-sm font-semibold text-[#3D3D3D]">
                        {meeting ? '✓ Meeting or Exceeding Role-Based Expectations' : `↓ ${dist.toFixed(2)} below role target`}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}