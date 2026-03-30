import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, MessageCircle, AlertCircle, ChevronDown, ChevronRight, ChevronUp, BarChart3, Network, Shield, Users, Settings, Globe, CheckSquare, ClipboardCheck } from 'lucide-react';
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
};

const WFA_BENCHMARK_PCT = 60;

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

function getGapInfo(dist) {
  if (dist === 0) return { label: 'Meets Target', color: '#10B981', bg: '#D1FAE5', textColor: '#065F46' };
  if (dist <= 0.20) return { label: 'Mild Shortfall', color: '#F59E0B', bg: '#FEF3C7', textColor: '#92400E' };
  if (dist <= 0.50) return { label: 'Dev. Opportunity', color: '#F68B1F', bg: '#FFF3E0', textColor: '#7C3D0A' };
  return { label: 'Significant Gap', color: '#EF4444', bg: '#FEE2E2', textColor: '#991B1B' };
}

function GapBadge({ distance }) {
  const info = getGapInfo(distance);
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold whitespace-nowrap"
      style={{ backgroundColor: info.bg, color: info.textColor }}>
      {info.label}
    </span>
  );
}

const DOMAIN_DATA = [
  { name: 'Quality Leadership', readiness: 60, dist: 0.18, color: '#003DA5' },
  { name: 'Patient Safety', readiness: 72, dist: 0.08, color: '#ED1C24' },
  { name: 'Performance Improvement', readiness: 35, dist: 0.44, color: '#00B5E2' },
  { name: 'Health Data Analytics', readiness: 20, dist: 0.61, color: '#F68B1F' },
  { name: 'Population Health', readiness: 40, dist: 0.38, color: '#8BC53F' },
  { name: 'Regulatory & Accreditation', readiness: 55, dist: 0.22, color: '#99154B' },
  { name: 'Quality Review & Accountability', readiness: 62, dist: 0.15, color: '#ED1C24' },
  { name: 'Professional Engagement', readiness: 58, dist: 0.20, color: '#6B4C9A' },
];

const PRIORITY_COMPETENCIES = [
  { name: 'Acquire data from source systems', domain: 'Health Data Analytics', dist: 0.72 },
  { name: 'Design data collection plans', domain: 'Health Data Analytics', dist: 0.61 },
  { name: 'Use data to identify improvement opp.', domain: 'Performance Improvement', dist: 0.48 },
  { name: 'Plan & implement improvement initiatives', domain: 'Performance Improvement', dist: 0.42 },
  { name: 'Build and sustain cross-functional teams', domain: 'Quality Leadership', dist: 0.28 },
];

const STRATEGIC_PRIORITIES = [
  {
    num: 1,
    title: 'Analytics Capability',
    color: '#F68B1F',
    bg: '#FFF3E0',
    text: '65% of staff at foundational level in Health Data Analytics. Prioritize data governance and visualization training for Specialists and Analysts.',
  },
  {
    num: 2,
    title: 'Leadership Development',
    color: '#003DA5',
    bg: '#EFF6FF',
    text: 'Strong foundation in Quality Leadership (avg 1.8). Advance Directors and VPs through strategic leadership content focused on staff with 3–5 years in role.',
  },
  {
    num: 3,
    title: 'Process Improvement',
    color: '#00B5E2',
    bg: '#F0FDFF',
    text: 'Performance Improvement domain at 1.65 vs 2.0 target. PI training for Managers/Supervisors spending 60%+ time in quality roles.',
  },
];

export default function StateOfQualityPanel({ data, onChatOpen }) {
  const [expanded, setExpanded] = useState(true);
  const [expandedDomain, setExpandedDomain] = useState(null);

  return (
    <div className="space-y-4">
      {/* Panel Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#00A3E0]/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-[#00A3E0]" />
            </div>
            <div className="text-left">
              <h2 className="text-base font-bold text-[#3D3D3D]">State of Quality Overview</h2>
              <p className="text-xs text-gray-500 mt-0.5">AI-generated executive summary · January 27, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onChatOpen && (
              <Button
                onClick={(e) => { e.stopPropagation(); onChatOpen('overview'); }}
                variant="outline"
                size="sm"
                className="border-[#00A3E0] text-[#00A3E0] hover:bg-[#00A3E0]/5 text-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                Discuss Insights
              </Button>
            )}
            {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="border-t border-gray-100 p-6 space-y-8">

                {/* Q1: Workforce Readiness */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#00A3E0] bg-[#00A3E0]/8 px-2 py-0.5 rounded-full">Key Question 1</span>
                  </div>
                  <p className="text-sm font-semibold text-[#3D3D3D] mb-4">How much of my workforce is performing at expected competency levels?</p>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Workforce Readiness</p>
                      <p className="text-3xl font-bold text-[#3D3D3D] leading-none">48%</p>
                      <p className="text-xs text-gray-500 mt-2">Meeting role-based targets</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Avg Distance to Target</p>
                      <p className="text-3xl font-bold text-[#3D3D3D] leading-none">0.28</p>
                      <GapBadge distance={0.28} />
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">WFA Benchmark</p>
                      <p className="text-3xl font-bold text-[#3D3D3D] leading-none">60%</p>
                      <p className="text-xs font-semibold text-red-600 mt-2">12 pts below benchmark</p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                      <span>Workforce Readiness vs WFA Benchmark</span>
                      <span className="font-semibold text-red-600">−12 pts</span>
                    </div>
                    <div className="relative h-2 bg-gray-100 rounded-full">
                      <div className="absolute top-0 left-0 h-full rounded-full bg-[#00A3E0]" style={{ width: '48%' }} />
                      <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#3D3D3D] rounded-full" style={{ left: '60%' }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-400 mt-1.5">
                      <span>0%</span>
                      <span className="font-semibold text-[#3D3D3D]" style={{ marginLeft: '54%' }}>Benchmark 60%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* Q2 & Q3 side by side */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Q2 */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#00A3E0] bg-[#00A3E0]/8 px-2 py-0.5 rounded-full">Key Question 2</span>
                    </div>
                    <p className="text-sm font-semibold text-[#3D3D3D] mb-4">Is our workforce performing at the expected level in each capability area?</p>
                    <div className="space-y-3">
                      {[
                        { name: 'Health Data Analytics', readiness: 20, color: '#F68B1F' },
                        { name: 'Performance Improvement', readiness: 35, color: '#00B5E2' },
                        { name: 'Population Health', readiness: 40, color: '#8BC53F' },
                        { name: 'Quality Leadership', readiness: 60, color: '#003DA5' },
                        { name: 'Patient Safety', readiness: 72, color: '#ED1C24' },
                      ].map(d => (
                        <div key={d.name}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-gray-700 font-medium">{d.name}</span>
                            <span className="text-xs font-bold text-[#3D3D3D]">{d.readiness}%</span>
                          </div>
                          <div className="relative h-1.5 bg-gray-100 rounded-full">
                            <div className="absolute inset-y-0 left-0 rounded-full transition-all" style={{ width: `${d.readiness}%`, backgroundColor: d.color }} />
                            <div className="absolute top-1/2 -translate-y-1/2 w-px h-3.5 bg-gray-400" style={{ left: `${WFA_BENCHMARK_PCT}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-3">Gray line = WFA benchmark ({WFA_BENCHMARK_PCT}%)</p>
                  </div>

                  {/* Q3 */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#00A3E0] bg-[#00A3E0]/8 px-2 py-0.5 rounded-full">Key Question 3</span>
                    </div>
                    <p className="text-sm font-semibold text-[#3D3D3D] mb-4">Which specific capabilities are underperforming — and how severe is the gap?</p>
                    <div className="divide-y divide-gray-100">
                      {PRIORITY_COMPETENCIES.map((c, i) => {
                        const gap = getGapInfo(c.dist);
                        return (
                          <div key={i} className="flex items-start justify-between gap-3 py-2.5">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-800 leading-snug">{c.name}</p>
                              <p className="text-[11px] text-gray-400 mt-0.5">{c.domain}</p>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <p className="text-xs font-bold text-[#3D3D3D]">{c.dist.toFixed(2)}</p>
                              <GapBadge distance={c.dist} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2">Avg Distance to Target — sorted by severity</p>
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* Strategic Priorities */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-4 h-4 text-[#3D3D3D]" />
                    <h3 className="text-sm font-bold text-[#3D3D3D]">Strategic Priorities Alignment</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {STRATEGIC_PRIORITIES.map(p => (
                      <div key={p.num} className="rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center gap-2.5 mb-2.5">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ backgroundColor: p.color }}>
                            {p.num}
                          </div>
                          <p className="text-sm font-bold text-[#3D3D3D]">{p.title}</p>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{p.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Domain Workforce Attainment */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-sm font-bold text-[#3D3D3D]">Domain Workforce Attainment</h3>
          <p className="text-xs text-gray-500 mt-0.5">Readiness vs. WFA Benchmark by capability domain</p>
        </div>
        <div className="divide-y divide-gray-100">
          {DOMAIN_DATA.map((domain) => {
            const isExpanded = expandedDomain === domain.name;
            const comps = COMPETENCY_DATA[domain.name];
            const Icon = DOMAIN_ICONS[domain.name] || BarChart3;
            const gapInfo = getGapInfo(domain.dist);
            const vsBenchmark = domain.readiness - WFA_BENCHMARK_PCT;

            return (
              <div key={domain.name}>
                <button
                  onClick={() => setExpandedDomain(isExpanded ? null : domain.name)}
                  className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                >
                  {/* Icon */}
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${domain.color}15` }}>
                    <Icon className="w-4 h-4" style={{ color: domain.color }} />
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#3D3D3D] truncate">{domain.name}</p>
                  </div>

                  {/* Readiness */}
                  <div className="hidden sm:block w-48">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Readiness</span>
                      <span className="text-xs font-bold text-[#3D3D3D]">{domain.readiness}%</span>
                    </div>
                    <div className="relative h-1.5 bg-gray-100 rounded-full">
                      <div className="absolute inset-y-0 left-0 rounded-full"
                        style={{ width: `${domain.readiness}%`, backgroundColor: domain.color }} />
                      <div className="absolute top-1/2 -translate-y-1/2 w-px h-3 bg-gray-400"
                        style={{ left: `${WFA_BENCHMARK_PCT}%` }} />
                    </div>
                  </div>

                  {/* Avg Distance */}
                  <div className="text-right w-28 flex-shrink-0">
                    <p className="text-[11px] text-gray-500 mb-1">Avg Distance</p>
                    <p className="text-sm font-bold text-[#3D3D3D]">{domain.dist.toFixed(2)}</p>
                    <GapBadge distance={domain.dist} />
                  </div>

                  {/* vs Benchmark */}
                  <div className="text-right w-24 flex-shrink-0 hidden md:block">
                    <p className="text-[11px] text-gray-500 mb-1">vs Benchmark</p>
                    <p className={`text-sm font-bold ${vsBenchmark >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {vsBenchmark >= 0 ? `+${vsBenchmark}` : vsBenchmark}%
                    </p>
                  </div>

                  {/* Expand chevron */}
                  <div className="flex-shrink-0 ml-2">
                    {comps ? (
                      isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {/* Competency drill-down */}
                <AnimatePresence>
                  {isExpanded && comps && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-gray-50 border-t border-gray-100 px-6 py-4">
                        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Competency Breakdown</p>
                        <div className="space-y-0 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white overflow-hidden">
                          {/* Header */}
                          <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50">
                            <div className="col-span-6 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Competency</div>
                            <div className="col-span-2 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Readiness</div>
                            <div className="col-span-2 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Avg Distance</div>
                            <div className="col-span-2 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Gap</div>
                          </div>
                          {comps.map((comp, idx) => {
                            const { attainmentPct, avgDistance } = computeAttainmentMetrics(comp.users);
                            return (
                              <div key={idx} className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-gray-50 transition-colors">
                                <div className="col-span-6 text-xs text-gray-700">{comp.name}</div>
                                <div className="col-span-2 text-center text-xs font-semibold text-[#3D3D3D]">{attainmentPct}%</div>
                                <div className="col-span-2 text-center text-xs font-semibold text-[#3D3D3D]">{avgDistance.toFixed(2)}</div>
                                <div className="col-span-2 flex justify-center"><GapBadge distance={avgDistance} /></div>
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
          })}
        </div>
      </div>
    </div>
  );
}