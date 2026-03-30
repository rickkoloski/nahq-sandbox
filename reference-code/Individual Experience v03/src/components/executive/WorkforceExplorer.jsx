import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, BarChart3, Users, Network, Settings, Globe, Shield, CheckSquare, ClipboardCheck, ExternalLink, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import DomainCompetencyPanel from './DomainCompetencyPanel';

const DOMAIN_ICONS = {
  'Quality Leadership': Network, 'Patient Safety': Shield, 'Professional Engagement': Users,
  'Performance Improvement': Settings, 'Population Health': Globe, 'Health Data Analytics': BarChart3,
  'Regulatory & Accreditation': CheckSquare, 'Quality Review & Accountability': ClipboardCheck
};

const ROLE_TARGETS = {
  'Director of Quality': 2.3, 'Quality Manager': 2.1, 'Quality Specialist': 1.8, 'Quality Analyst': 1.9
};

const WFA_BENCHMARK_PCT = 60;

const COMPETENCY_DATA = {
  'Quality Leadership': [
  { name: 'Lead and sponsor quality initiatives', users: [
    { name: 'Sarah Chen', role: 'Director of Quality', site: 'Main Campus', score: 2.0 }, { name: 'James Rodriguez', role: 'Quality Manager', site: 'Main Campus', score: 1.5 },
    { name: 'Maria Garcia', role: 'Director of Quality', site: 'North Campus', score: 2.2 }, { name: 'David Kim', role: 'Quality Specialist', site: 'North Campus', score: 1.8 },
    { name: 'Jennifer Lee', role: 'Director of Quality', site: 'South Clinic', score: 2.5 }, { name: 'Michael Brown', role: 'Quality Manager', site: 'South Clinic', score: 1.7 },
    { name: 'Patricia Johnson', role: 'Quality Manager', site: 'Main Campus', score: 2.3 }, { name: 'Robert Wilson', role: 'Quality Specialist', site: 'North Campus', score: 1.4 },
    { name: 'Linda Martinez', role: 'Director of Quality', site: 'South Clinic', score: 2.6 }, { name: 'Christopher Davis', role: 'Quality Manager', site: 'Main Campus', score: 1.9 }]
  },
  { name: 'Foster a culture of continuous improvement', users: [
    { name: 'Sarah Chen', role: 'Director of Quality', site: 'Main Campus', score: 2.1 }, { name: 'James Rodriguez', role: 'Quality Manager', site: 'Main Campus', score: 1.6 },
    { name: 'Maria Garcia', role: 'Director of Quality', site: 'North Campus', score: 2.4 }, { name: 'David Kim', role: 'Quality Specialist', site: 'North Campus', score: 2.0 },
    { name: 'Jennifer Lee', role: 'Director of Quality', site: 'South Clinic', score: 2.7 }, { name: 'Michael Brown', role: 'Quality Manager', site: 'South Clinic', score: 1.5 },
    { name: 'Patricia Johnson', role: 'Quality Manager', site: 'Main Campus', score: 2.2 }, { name: 'Robert Wilson', role: 'Quality Specialist', site: 'North Campus', score: 2.0 },
    { name: 'Linda Martinez', role: 'Director of Quality', site: 'South Clinic', score: 2.8 }, { name: 'Christopher Davis', role: 'Quality Manager', site: 'Main Campus', score: 2.1 }]
  },
  { name: 'Build and sustain cross-functional teams', users: [
    { name: 'Sarah Chen', role: 'Director of Quality', site: 'Main Campus', score: 1.8 }, { name: 'James Rodriguez', role: 'Quality Manager', site: 'Main Campus', score: 1.3 },
    { name: 'Maria Garcia', role: 'Director of Quality', site: 'North Campus', score: 1.9 }, { name: 'David Kim', role: 'Quality Specialist', site: 'North Campus', score: 1.6 },
    { name: 'Jennifer Lee', role: 'Director of Quality', site: 'South Clinic', score: 2.1 }, { name: 'Michael Brown', role: 'Quality Manager', site: 'South Clinic', score: 1.4 },
    { name: 'Patricia Johnson', role: 'Quality Manager', site: 'Main Campus', score: 1.7 }, { name: 'Robert Wilson', role: 'Quality Specialist', site: 'North Campus', score: 1.5 },
    { name: 'Linda Martinez', role: 'Director of Quality', site: 'South Clinic', score: 1.9 }, { name: 'Christopher Davis', role: 'Quality Manager', site: 'Main Campus', score: 1.7 }]
  }],

  'Patient Safety': [
  { name: 'Create and maintain a safe environment', users: [
    { name: 'Sarah Chen', role: 'Director of Quality', site: 'Main Campus', score: 2.1 }, { name: 'James Rodriguez', role: 'Quality Manager', site: 'Main Campus', score: 1.7 },
    { name: 'Maria Garcia', role: 'Director of Quality', site: 'North Campus', score: 2.2 }, { name: 'David Kim', role: 'Quality Specialist', site: 'North Campus', score: 2.0 },
    { name: 'Jennifer Lee', role: 'Director of Quality', site: 'South Clinic', score: 2.5 }, { name: 'Michael Brown', role: 'Quality Manager', site: 'South Clinic', score: 1.6 },
    { name: 'Patricia Johnson', role: 'Quality Manager', site: 'Main Campus', score: 2.0 }, { name: 'Robert Wilson', role: 'Quality Specialist', site: 'North Campus', score: 1.9 },
    { name: 'Linda Martinez', role: 'Director of Quality', site: 'South Clinic', score: 2.6 }, { name: 'Christopher Davis', role: 'Quality Manager', site: 'Main Campus', score: 1.8 }]
  },
  { name: 'Identify and mitigate patient safety risks', users: [
    { name: 'Sarah Chen', role: 'Director of Quality', site: 'Main Campus', score: 2.0 }, { name: 'James Rodriguez', role: 'Quality Manager', site: 'Main Campus', score: 1.5 },
    { name: 'Maria Garcia', role: 'Director of Quality', site: 'North Campus', score: 2.1 }, { name: 'David Kim', role: 'Quality Specialist', site: 'North Campus', score: 1.9 },
    { name: 'Jennifer Lee', role: 'Director of Quality', site: 'South Clinic', score: 2.4 }, { name: 'Michael Brown', role: 'Quality Manager', site: 'South Clinic', score: 1.6 },
    { name: 'Patricia Johnson', role: 'Quality Manager', site: 'Main Campus', score: 2.0 }, { name: 'Robert Wilson', role: 'Quality Specialist', site: 'North Campus', score: 1.8 },
    { name: 'Linda Martinez', role: 'Director of Quality', site: 'South Clinic', score: 2.5 }, { name: 'Christopher Davis', role: 'Quality Manager', site: 'Main Campus', score: 1.9 }]
  }],

  'Performance Improvement': [
  { name: 'Use data to identify improvement opportunities', users: [
    { name: 'Sarah Chen', role: 'Director of Quality', site: 'Main Campus', score: 1.8 }, { name: 'James Rodriguez', role: 'Quality Manager', site: 'Main Campus', score: 1.2 },
    { name: 'Maria Garcia', role: 'Director of Quality', site: 'North Campus', score: 1.9 }, { name: 'David Kim', role: 'Quality Specialist', site: 'North Campus', score: 1.5 },
    { name: 'Jennifer Lee', role: 'Director of Quality', site: 'South Clinic', score: 2.2 }, { name: 'Michael Brown', role: 'Quality Manager', site: 'South Clinic', score: 1.3 },
    { name: 'Patricia Johnson', role: 'Quality Manager', site: 'Main Campus', score: 1.6 }, { name: 'Robert Wilson', role: 'Quality Specialist', site: 'North Campus', score: 1.4 },
    { name: 'Linda Martinez', role: 'Director of Quality', site: 'South Clinic', score: 1.8 }, { name: 'Christopher Davis', role: 'Quality Manager', site: 'Main Campus', score: 1.7 }]
  },
  { name: 'Plan and implement improvement initiatives', users: [
    { name: 'Sarah Chen', role: 'Director of Quality', site: 'Main Campus', score: 1.9 }, { name: 'James Rodriguez', role: 'Quality Manager', site: 'Main Campus', score: 1.3 },
    { name: 'Maria Garcia', role: 'Director of Quality', site: 'North Campus', score: 2.0 }, { name: 'David Kim', role: 'Quality Specialist', site: 'North Campus', score: 1.6 },
    { name: 'Jennifer Lee', role: 'Director of Quality', site: 'South Clinic', score: 2.3 }, { name: 'Michael Brown', role: 'Quality Manager', site: 'South Clinic', score: 1.4 },
    { name: 'Patricia Johnson', role: 'Quality Manager', site: 'Main Campus', score: 1.7 }, { name: 'Robert Wilson', role: 'Quality Specialist', site: 'North Campus', score: 1.5 },
    { name: 'Linda Martinez', role: 'Director of Quality', site: 'South Clinic', score: 1.9 }, { name: 'Christopher Davis', role: 'Quality Manager', site: 'Main Campus', score: 1.8 }]
  }],

  'Health Data Analytics': [
  { name: 'Apply procedures for governance of data assets', users: [
    { name: 'Sarah Chen', role: 'Director of Quality', site: 'Main Campus', score: 1.7 }, { name: 'James Rodriguez', role: 'Quality Manager', site: 'Main Campus', score: 1.1 },
    { name: 'Maria Garcia', role: 'Director of Quality', site: 'North Campus', score: 1.8 }, { name: 'David Kim', role: 'Quality Specialist', site: 'North Campus', score: 1.4 },
    { name: 'Jennifer Lee', role: 'Director of Quality', site: 'South Clinic', score: 2.1 }, { name: 'Michael Brown', role: 'Quality Manager', site: 'South Clinic', score: 1.2 },
    { name: 'Patricia Johnson', role: 'Quality Manager', site: 'Main Campus', score: 1.9 }, { name: 'Robert Wilson', role: 'Quality Specialist', site: 'North Campus', score: 1.3 },
    { name: 'Linda Martinez', role: 'Director of Quality', site: 'South Clinic', score: 1.6 }, { name: 'Christopher Davis', role: 'Quality Manager', site: 'Main Campus', score: 1.5 }]
  },
  { name: 'Design data collection plans', users: [
    { name: 'Sarah Chen', role: 'Director of Quality', site: 'Main Campus', score: 1.6 }, { name: 'James Rodriguez', role: 'Quality Manager', site: 'Main Campus', score: 1.0 },
    { name: 'Maria Garcia', role: 'Director of Quality', site: 'North Campus', score: 1.7 }, { name: 'David Kim', role: 'Quality Specialist', site: 'North Campus', score: 1.3 },
    { name: 'Jennifer Lee', role: 'Director of Quality', site: 'South Clinic', score: 2.0 }, { name: 'Michael Brown', role: 'Quality Manager', site: 'South Clinic', score: 1.1 },
    { name: 'Patricia Johnson', role: 'Quality Manager', site: 'Main Campus', score: 1.8 }, { name: 'Robert Wilson', role: 'Quality Specialist', site: 'North Campus', score: 1.2 },
    { name: 'Linda Martinez', role: 'Director of Quality', site: 'South Clinic', score: 1.5 }, { name: 'Christopher Davis', role: 'Quality Manager', site: 'Main Campus', score: 1.4 }]
  },
  { name: 'Acquire data from source systems', users: [
    { name: 'Sarah Chen', role: 'Director of Quality', site: 'Main Campus', score: 1.5 }, { name: 'James Rodriguez', role: 'Quality Manager', site: 'Main Campus', score: 1.0 },
    { name: 'Maria Garcia', role: 'Director of Quality', site: 'North Campus', score: 1.6 }, { name: 'David Kim', role: 'Quality Specialist', site: 'North Campus', score: 1.2 },
    { name: 'Jennifer Lee', role: 'Director of Quality', site: 'South Clinic', score: 1.8 }, { name: 'Michael Brown', role: 'Quality Manager', site: 'South Clinic', score: 1.0 },
    { name: 'Patricia Johnson', role: 'Quality Manager', site: 'Main Campus', score: 1.3 }, { name: 'Robert Wilson', role: 'Quality Specialist', site: 'North Campus', score: 1.1 },
    { name: 'Linda Martinez', role: 'Director of Quality', site: 'South Clinic', score: 1.4 }, { name: 'Christopher Davis', role: 'Quality Manager', site: 'Main Campus', score: 1.2 }]
  }],

  'Regulatory & Accreditation': [
  { name: 'Understand regulatory requirements', users: [
    { name: 'Sarah Chen', role: 'Director of Quality', site: 'Main Campus', score: 2.1 }, { name: 'James Rodriguez', role: 'Quality Manager', site: 'Main Campus', score: 1.7 },
    { name: 'Maria Garcia', role: 'Director of Quality', site: 'North Campus', score: 2.0 }, { name: 'David Kim', role: 'Quality Specialist', site: 'North Campus', score: 1.9 },
    { name: 'Jennifer Lee', role: 'Director of Quality', site: 'South Clinic', score: 2.3 }, { name: 'Michael Brown', role: 'Quality Manager', site: 'South Clinic', score: 1.6 },
    { name: 'Patricia Johnson', role: 'Quality Manager', site: 'Main Campus', score: 1.9 }, { name: 'Robert Wilson', role: 'Quality Specialist', site: 'North Campus', score: 1.8 },
    { name: 'Linda Martinez', role: 'Director of Quality', site: 'South Clinic', score: 2.4 }, { name: 'Christopher Davis', role: 'Quality Manager', site: 'Main Campus', score: 1.9 }]
  },
  { name: 'Prepare for surveys and assessments', users: [
    { name: 'Sarah Chen', role: 'Director of Quality', site: 'Main Campus', score: 2.0 }, { name: 'James Rodriguez', role: 'Quality Manager', site: 'Main Campus', score: 1.6 },
    { name: 'Maria Garcia', role: 'Director of Quality', site: 'North Campus', score: 2.0 }, { name: 'David Kim', role: 'Quality Specialist', site: 'North Campus', score: 1.8 },
    { name: 'Jennifer Lee', role: 'Director of Quality', site: 'South Clinic', score: 2.2 }, { name: 'Michael Brown', role: 'Quality Manager', site: 'South Clinic', score: 1.5 },
    { name: 'Patricia Johnson', role: 'Quality Manager', site: 'Main Campus', score: 1.8 }, { name: 'Robert Wilson', role: 'Quality Specialist', site: 'North Campus', score: 1.7 },
    { name: 'Linda Martinez', role: 'Director of Quality', site: 'South Clinic', score: 2.3 }, { name: 'Christopher Davis', role: 'Quality Manager', site: 'Main Campus', score: 1.8 }]
  }]

};

// Domain rows sorted worst-first
const DOMAIN_ROWS = [
{ name: 'Health Data Analytics', readiness: 20, dist: 0.61, color: '#8A6D3B', dist_by_level: { na: 2, foundational: 6, proficient: 2, advanced: 0 } },
{ name: 'Performance Improvement', readiness: 35, dist: 0.44, color: '#0F6C74', dist_by_level: { na: 0, foundational: 4, proficient: 5, advanced: 1 } },
{ name: 'Population Health', readiness: 40, dist: 0.38, color: '#2E7D32', dist_by_level: { na: 1, foundational: 3, proficient: 4, advanced: 2 } },
{ name: 'Regulatory & Accreditation', readiness: 55, dist: 0.22, color: '#C62828', dist_by_level: { na: 0, foundational: 2, proficient: 6, advanced: 2 } },
{ name: 'Professional Engagement', readiness: 58, dist: 0.20, color: '#7B1FA2', dist_by_level: { na: 0, foundational: 2, proficient: 5, advanced: 3 } },
{ name: 'Quality Leadership', readiness: 60, dist: 0.18, color: '#1E5BB8', dist_by_level: { na: 0, foundational: 2, proficient: 5, advanced: 3 } },
{ name: 'Quality Review & Accountability', readiness: 62, dist: 0.15, color: '#AD1457', dist_by_level: { na: 0, foundational: 1, proficient: 6, advanced: 3 } },
{ name: 'Patient Safety', readiness: 72, dist: 0.08, color: '#E67E22', dist_by_level: { na: 0, foundational: 1, proficient: 4, advanced: 5 } }];


function computeMetrics(users) {
  if (!users || !users.length) return { readiness: 0, dist: 0 };
  let met = 0,totalDist = 0;
  users.forEach((u) => {
    const t = ROLE_TARGETS[u.role] || 2.0;
    if (u.score >= t) met++;
    totalDist += Math.max(0, t - u.score);
  });
  return { readiness: Math.round(met / users.length * 100), dist: parseFloat((totalDist / users.length).toFixed(2)) };
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
    style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>);

}

function levelBadge(score) {
  if (score < 1) return { label: 'N/A', bg: '#F3F4F6', color: '#6B7280' };
  if (score < 2) return { label: 'F', bg: '#FEF3C7', color: '#D97706' };
  if (score < 3) return { label: 'P', bg: '#D1FAE5', color: '#059669' };
  return { label: 'A', bg: '#DBEAFE', color: '#2563EB' };
}

// Skill level distribution stacked bar
function SkillDistributionBar({ levels }) {
  const total = levels.na + levels.foundational + levels.proficient + levels.advanced;
  if (total === 0) return null;
  const pct = (n) => Math.round(n / total * 100);
  const segments = [
  { label: 'N/A', pct: pct(levels.na), color: '#E5E7EB' },
  { label: 'Foundational', pct: pct(levels.foundational), color: '#FCD34D' },
  { label: 'Proficient', pct: pct(levels.proficient), color: '#34D399' },
  { label: 'Advanced', pct: pct(levels.advanced), color: '#60A5FA' }].
  filter((s) => s.pct > 0);

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Skill Level Distribution</p>
      <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
        {segments.map((s, i) =>
        <div key={i} title={`${s.label}: ${s.pct}%`}
        className="flex items-center justify-center text-[9px] font-bold text-white"
        style={{ width: `${s.pct}%`, backgroundColor: s.color, color: s.color === '#E5E7EB' ? '#9CA3AF' : 'white' }}>
            {s.pct >= 12 ? `${s.pct}%` : ''}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
        {[
        { label: 'N/A', color: '#E5E7EB', textColor: '#9CA3AF', count: levels.na },
        { label: 'Foundational', color: '#FCD34D', textColor: '#92400E', count: levels.foundational },
        { label: 'Proficient', color: '#34D399', textColor: '#065F46', count: levels.proficient },
        { label: 'Advanced', color: '#60A5FA', textColor: '#1E40AF', count: levels.advanced }].
        map((s) =>
        <div key={s.label} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-[10px] text-gray-500">{s.label} <strong style={{ color: s.textColor }}>{s.count}</strong></span>
          </div>
        )}
      </div>
    </div>);

}

// Competency row inside a domain — navigates to detail page on click
function CompetencyRow({ comp, domainName }) {
  const navigate = useNavigate();
  const { readiness, dist } = computeMetrics(comp.users);

  const handleClick = () => {
    navigate(createPageUrl(`CompetencyDetail?domain=${encodeURIComponent(domainName)}&competency=${encodeURIComponent(comp.name)}`));
  };

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={handleClick}
        className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#00A3E0]/5 transition-colors text-left group">

        <div className="flex-shrink-0 w-3.5" />
        <div className="flex-1 min-w-0">
          <span className="text-xs font-medium text-gray-700 group-hover:text-[#00A3E0] transition-colors">{comp.name}</span>
        </div>
        <div className="w-20 text-right pr-2">
          <span className="text-xs font-bold text-[#3D3D3D]">{readiness}%</span>
        </div>
        <div className="w-28 text-right pr-2">
          <span className="text-xs font-bold text-[#3D3D3D]">{dist.toFixed(2)}</span>
        </div>
        <div className="w-24 flex justify-end">
          <GapChip dist={dist} />
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#00A3E0] transition-colors flex-shrink-0" />
      </button>
    </div>);

}

// Domain row — top level
function DomainRow({ domain }) {
  const [open, setOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const comps = COMPETENCY_DATA[domain.name];
  const Icon = DOMAIN_ICONS[domain.name] || BarChart3;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => comps && setOpen(!open)}
        className={`w-full px-5 py-4 transition-colors text-left ${comps ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-default'}`}
        style={{ display: 'grid', gridTemplateColumns: '36px 1fr 100px 120px 110px 24px', alignItems: 'center', gap: '16px' }}>

        {/* Icon */}
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${domain.color}18` }}>
          <Icon className="w-4 h-4" style={{ color: domain.color }} />
        </div>

        {/* Name + mini bar */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 group">
            <p className="text-sm font-semibold text-[#3D3D3D] truncate">{domain.name}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPanelOpen(true);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            >
              <Info className="w-4 h-4 text-gray-400 hover:text-[#00A3E0]" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="relative w-32 h-1.5 bg-gray-100 rounded-full flex-shrink-0">
              <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${domain.readiness}%`, backgroundColor: domain.color }} />
              <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-gray-500 rounded-full" style={{ left: `${WFA_BENCHMARK_PCT}%` }} />
            </div>
            <span className="text-[10px] text-gray-400 flex-shrink-0">vs benchmark</span>
          </div>
        </div>

        {/* Workforce Readiness */}
         <div className="text-right">
           <p className="text-[10px] text-gray-400 uppercase mb-0.5">Workforce Readiness</p>
           <p className="text-base font-bold text-[#3D3D3D]">{domain.readiness}%</p>
         </div>

        {/* Avg Distance */}
        <div className="text-right">
          <p className="text-[10px] text-gray-400 uppercase mb-0.5">Avg Distance</p>
          <p className="text-base font-bold text-[#3D3D3D]">{domain.dist.toFixed(2)}</p>
        </div>

        {/* Gap chip */}
        <div className="flex justify-center">
          <GapChip dist={domain.dist} />
        </div>

        {/* Chevron */}
        <div className="flex justify-end">
          {comps && (open ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />)}
        </div>
      </button>

      <AnimatePresence>
       {open && comps &&
       <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
           <div className="border-t border-gray-100">
             {/* Skill level distribution */}
             <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
               <SkillDistributionBar levels={domain.dist_by_level} />
             </div>

             {/* Competency table header */}
             <div className="flex items-center gap-3 px-5 py-2 bg-gray-50 border-b border-gray-200">
                <div className="w-4 flex-shrink-0" />
                <div className="flex-1 text-[10px] font-semibold text-gray-500 uppercase">Competency</div>
                <div className="w-20 text-right pr-2 text-[10px] font-semibold text-gray-500 uppercase">Workforce Readiness</div>
                <div className="w-28 text-right pr-2 text-[10px] font-semibold text-gray-500 uppercase">Avg Distance</div>
                <div className="w-24 text-center text-[10px] font-semibold text-gray-500 uppercase">Gap</div>
              </div>
             {comps.map((comp, idx) =>
           <CompetencyRow key={idx} comp={comp} domainName={domain.name} />
           )}
           </div>
         </motion.div>
       }
      </AnimatePresence>

      <DomainCompetencyPanel 
       isOpen={panelOpen} 
       onClose={() => setPanelOpen(false)} 
       type="domain" 
       name={domain.name} 
      />
      </div>);

      }

export default function WorkforceExplorer({ data, onChatOpen }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#3D3D3D]">Domain Workforce Readiness</h3>
          <p className="text-xs text-gray-500 mt-0.5">Click a domain to see its competencies · Click a competency to open its full detail page</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-gray-400">
          
          
          
        </div>
      </div>

      <div className="space-y-2">
        {DOMAIN_ROWS.map((domain) =>
        <DomainRow key={domain.name} domain={domain} />
        )}
      </div>
    </div>);

}