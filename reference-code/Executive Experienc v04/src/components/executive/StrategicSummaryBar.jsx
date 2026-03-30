import React, { useState, useMemo } from 'react';
import { MessageCircle, AlertTriangle, Sparkles, Zap, Info, TrendingUp, Target, BarChart2, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COMPETENCY_DATA, ROLE_TARGETS, computeDomainSummary, USERS } from '@/components/shared/workforceData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import WorkforceInsightsSummary from './WorkforceInsightsSummary';

// Compute staff with critical gaps and proficiency distribution
function computeStaffWithCriticalGaps() {
  const userWorstScore = {};
  const userProficiency = {};

  Object.values(COMPETENCY_DATA).forEach((comps) => {
    comps.forEach((comp) => {
      comp.users.forEach((u) => {
        const target = ROLE_TARGETS[u.role] || 2.0;
        const attainment = u.score / target * 100;
        if (!userWorstScore[u.name] || attainment < userWorstScore[u.name].attainment) {
          userWorstScore[u.name] = { ...u, attainment };
        }
        if (!userProficiency[u.name]) {
          userProficiency[u.name] = u.score;
        } else {
          userProficiency[u.name] = Math.max(userProficiency[u.name], u.score);
        }
      });
    });
  });

  const allUniqueUsers = Object.values(userWorstScore);
  const criticalCount = allUniqueUsers.filter((u) => u.attainment < 90).length;

  let advancedCount = 0,foundationalCount = 0;
  Object.values(userProficiency).forEach((score) => {
    if (score >= 2.8) advancedCount++;else
    if (score < 2.3) foundationalCount++;
  });

  return {
    criticalCount,
    totalUsers: allUniqueUsers.length,
    advancedCount,
    foundationalCount
  };
}

const { criticalCount: STAFF_WITH_CRITICAL_GAPS, totalUsers: TOTAL_ASSESSED, advancedCount: TOTAL_ADVANCED, foundationalCount: TOTAL_FOUNDATIONAL } = computeStaffWithCriticalGaps();

const TOTAL_COMPETENCIES = 28;
const CRITICAL_COMPETENCY_COUNT = 8;
const WFA_BENCHMARK_PCT = 60;

// Compute distribution by domain for stacked bar chart based on individual competency scores
const computeDomainDistribution = () => {
  const distribution = {};
  let totalAdvanced = 0,totalFoundational = 0,totalIndividuals = new Set();

  Object.entries(COMPETENCY_DATA).forEach(([domainName, competencies]) => {
    // Collect ALL individual competency scores (not averaged per user)
    const allScores = [];

    competencies.forEach((comp) => {
      comp.users.forEach((u) => {
        allScores.push(u.score);
        totalIndividuals.add(u.name);
      });
    });

    // Bucket individual scores into proficiency levels
    let notApplicable = 0,foundational = 0,proficient = 0,advanced = 0;

    allScores.forEach((score) => {
      if (score < 1.5) notApplicable++;else
      if (score < 2.3) foundational++;else
      if (score < 2.75) proficient++;else
      advanced++;
    });

    totalAdvanced += advanced;
    totalFoundational += foundational;

    const total = allScores.length;
    const naPercent = total > 0 ? notApplicable / total * 100 : 0;
    const foundPercent = total > 0 ? foundational / total * 100 : 0;
    const profPercent = total > 0 ? proficient / total * 100 : 0;
    const advPercent = total > 0 ? advanced / total * 100 : 0;

    distribution[domainName] = {
      name: domainName,
      'N/A': Math.round(naPercent * 100) / 100,
      'N/A_count': notApplicable,
      'Found.': Math.round(foundPercent * 100) / 100,
      'Found._count': foundational,
      'Proficient': Math.round(profPercent * 100) / 100,
      'Proficient_count': proficient,
      'Advanced': Math.round(advPercent * 100) / 100,
      'Advanced_count': advanced,
      total
    };
  });

  const totalCount = totalIndividuals.size;
  return {
    data: Object.values(distribution),
    totalAdvanced,
    totalFoundational,
    totalIndividuals: totalCount,
    advancedPct: totalCount > 0 ? Math.round(totalAdvanced / totalCount * 100) : 0,
    foundationalPct: totalCount > 0 ? Math.round(totalFoundational / totalCount * 100) : 0
  };
};

const { data: DOMAIN_DISTRIBUTION, totalAdvanced, totalFoundational, totalIndividuals, advancedPct, foundationalPct } = computeDomainDistribution();

const NATIONAL_BENCHMARK = 1.95;

function computeOrgKPIs() {
  const userMap = {};
  Object.values(COMPETENCY_DATA).forEach((comps) => {
    comps.forEach((comp) => {
      comp.users.forEach((u) => {
        if (!userMap[u.name]) userMap[u.name] = { ...u, scores: [], targets: [] };
        userMap[u.name].scores.push(u.score);
        userMap[u.name].targets.push(ROLE_TARGETS[u.role] || 2.0);
      });
    });
  });
  const users = Object.values(userMap);
  if (!users.length) return { avgScore: 0, avgTarget: 0, avgDist: 0 };
  const avgScore = users.reduce((s, u) => s + u.scores.reduce((a, b) => a + b, 0) / u.scores.length, 0) / users.length;
  const avgTarget = users.reduce((s, u) => s + u.targets.reduce((a, b) => a + b, 0) / u.targets.length, 0) / users.length;
  const avgDist = Math.max(0, avgTarget - avgScore);
  return { avgScore: parseFloat(avgScore.toFixed(2)), avgTarget: parseFloat(avgTarget.toFixed(2)), avgDist: parseFloat(avgDist.toFixed(2)) };
}

const ORG_KPIS = computeOrgKPIs();

function OrgScoreProgressBar({ orgScore, nahqTarget, nationalBenchmark }) {
  const [tooltip, setTooltip] = useState(null);
  // tooltip: { label, value, color, x }

  const toPercent = (val) => `${val / 3 * 100}%`;

  const markers = [
  { key: 'org', label: 'Your Org.', value: orgScore, color: '#00A3E0', isBar: true },
  { key: 'nahq', label: 'NAHQ Standard', value: nahqTarget, color: '#6B4C9A' },
  { key: 'national', label: 'National Benchmark', value: nationalBenchmark, color: '#12B76A' }];


  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#00A3E0] bg-[#00A3E0]/8 px-2 py-0.5 rounded-full">Organizational Score vs. Benchmarks</span>
        <p className="text-sm font-semibold text-[#3D3D3D] mt-2 leading-snug">Your organization's average results plotted against NAHQ role standard and national benchmark.</p>
      </div>

      {/* Score value */}
      <div className="mb-3">
        <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold mb-0.5">Org. Avg. Score</p>
        <p className="text-3xl font-bold text-[#3D3D3D]">{orgScore.toFixed(2)}</p>
      </div>

      {/* Progress bar track */}
      <div
        className="relative h-5 rounded-full overflow-visible mt-3 mb-2"
        role="img"
        aria-label={`Organizational score ${orgScore.toFixed(2)} compared to NAHQ Standard ${nahqTarget.toFixed(2)} and National Benchmark ${nationalBenchmark.toFixed(2)}`}
        style={{ backgroundColor: '#EAECF0' }}
      >
        {/* Filled bar (Your Org) */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 cursor-pointer"
          style={{ width: toPercent(orgScore), background: 'linear-gradient(90deg, #00A3E0, #00B5E2)', opacity: 0.9 }}
          onMouseEnter={() => setTooltip({ key: 'org', label: 'Your Org.', value: orgScore, color: '#00A3E0' })}
          onMouseLeave={() => setTooltip(null)} />
        

        {/* Your Org marker pin (at end of bar) */}
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{ left: toPercent(orgScore) }}
          onMouseEnter={() => setTooltip({ key: 'org', label: 'Your Org.', value: orgScore, color: '#00A3E0' })}
          onMouseLeave={() => setTooltip(null)}>
          
          <div className="rounded-full flex items-center justify-center" style={{ width: 28, height: 28, backgroundColor: '#00A3E0', border: '3px solid white', boxShadow: '0 0 0 2px #00A3E0, 0 2px 6px rgba(0,0,0,0.2)' }}>
            <div className="rounded-full bg-white" style={{ width: 8, height: 8 }} />
          </div>
        </div>

        {/* NAHQ Standard marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 cursor-pointer"
          style={{ left: toPercent(nahqTarget) }}
          onMouseEnter={() => setTooltip({ key: 'nahq', label: 'NAHQ Standard', value: nahqTarget, color: '#6B4C9A' })}
          onMouseLeave={() => setTooltip(null)}>
          
          <div className="w-1 h-8 bg-[#6B4C9A] rounded-full shadow" />
        </div>

        {/* National Benchmark marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 cursor-pointer"
          style={{ left: toPercent(nationalBenchmark) }}
          onMouseEnter={() => setTooltip({ key: 'national', label: 'National Benchmark', value: nationalBenchmark, color: '#12B76A' })}
          onMouseLeave={() => setTooltip(null)}>
          
          <div className="w-1 h-8 bg-[#12B76A] rounded-full shadow" />
        </div>

        {/* Tooltip */}
        {tooltip &&
        <div
          className="absolute bottom-full mb-3 z-30 pointer-events-none"
          style={{ left: tooltip.key === 'org' ? toPercent(tooltip.value) : toPercent(tooltip.value), transform: 'translateX(-50%)' }}>
          
            <div className="bg-[#3D3D3D] text-xs rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
              <span className="font-semibold text-white">{tooltip.label}</span>
              <span className="ml-2 font-bold text-white">{tooltip.value.toFixed(2)}</span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[#3D3D3D] rotate-45 -mt-1" />
            </div>
          </div>
        }
      </div>

      {/* Scale labels */}
      <div className="flex justify-between text-[10px] text-gray-600 font-semibold mb-5" aria-hidden="true">
        <span>0</span>
        <span>1 — Foundational</span>
        <span>2 — Proficient</span>
        <span>3 — Advanced</span>
      </div>

      {/* Legend — bottom, Your Org first */}
      <div className="pt-3 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 rounded" style={{ backgroundColor: '#00A3E0', opacity: 0.85 }} />
            <span>Your Org. <strong className="text-[#3D3D3D]">{orgScore.toFixed(2)}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-[#6B4C9A]" />
            <span>NAHQ Standard <strong className="text-[#3D3D3D]">{nahqTarget.toFixed(2)}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-[#12B76A]" />
            <span>National Benchmark <strong className="text-[#3D3D3D]">{nationalBenchmark.toFixed(2)}</strong></span>
          </div>
        </div>
      </div>
    </div>);

}

function MetricCard({ icon: Icon, label, value, sub, color = '#00A3E0', tooltip }) {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 relative">
      {tooltip &&
      <div className="absolute top-3 right-3">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            aria-label={`More information about ${label}`}
            className="text-gray-400 hover:text-[#00A3E0] transition-colors"
          >
            <Info className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          {showTooltip &&
        <div role="tooltip" className="absolute right-0 top-full mt-2 z-30 w-60 bg-[#3D3D3D] text-white text-xs rounded-lg px-3 py-2.5 shadow-xl leading-relaxed pointer-events-none">
              {tooltip}
              <div className="absolute -top-1.5 right-3 w-3 h-3 bg-[#3D3D3D] rotate-45" aria-hidden="true" />
            </div>
        }
        </div>
      }
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-4 h-4" style={{ color }} aria-hidden="true" />
        </div>
        <p className="text-[10px] text-gray-600 uppercase tracking-wide font-medium leading-tight pr-5">{label}</p>
      </div>
      <p className="text-2xl font-bold text-[#3D3D3D]">{value}</p>
      {sub && <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>}
    </div>);

}

const TOTAL_PARTICIPANTS = 150; // Total roster size
const COMPLETION_RATE = TOTAL_PARTICIPANTS > 0 ? Math.round(TOTAL_ASSESSED / TOTAL_PARTICIPANTS * 100) : 0;

const KPI_DEFINITIONS = [
{
  icon: Info,
  iconBg: 'bg-blue-50',
  iconColor: 'text-blue-600',
  label: 'Assessment Completion Rate',
  value: `${COMPLETION_RATE}%`,
  sub: `${TOTAL_ASSESSED} of ${TOTAL_PARTICIPANTS} participants`
}];


function KpiCard({ card }) {
  const Icon = card.icon;
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
        <Icon className={`w-5 h-5 ${card.iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-600 font-semibold leading-tight mb-1">{card.label}</p>
        <p className="text-2xl font-bold text-[#3D3D3D] leading-none">
          {card.value}
        </p>
        <p className="text-xs mt-1 font-medium text-gray-500">{card.sub}</p>
      </div>
    </div>);

}

const RoundedBar = (props) => {
  const { fill, x, y, width, height } = props;
  const radius = 2;

  if (width <= 0 || height <= 0) return null;

  return (
    <path
      d={`M ${x + radius} ${y} L ${x + width - radius} ${y} Q ${x + width} ${y} ${x + width} ${y + radius} L ${x + width} ${y + height - radius} Q ${x + width} ${y + height} ${x + width - radius} ${y + height} L ${x + radius} ${y + height} Q ${x} ${y + height} ${x} ${y + height - radius} L ${x} ${y + radius} Q ${x} ${y} ${x + radius} ${y} Z`}
      fill={fill} />);


};

const abbreviateDomain = (name, maxLen = 20) => {
  return name.length > maxLen ? name.substring(0, maxLen) + '...' : name;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  return (
    <div className="bg-white border border-gray-300 rounded-md p-2 shadow-sm text-xs text-gray-900">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((entry, idx) => {
        const countKey = entry.dataKey + '_count';
        const count = data[countKey] || 0;
        const pct = data[entry.dataKey] || 0;
        return (
          <p key={idx} style={{ color: entry.color }}>
            {entry.dataKey}: {count} response{count !== 1 ? 's' : ''} ({pct}%)
          </p>);

      })}
    </div>);

};

const DistributionLabel = (props) => {
  const { x, y, width, height, value } = props;
  if (!value || width < 20) return null;

  return (
    <text
      x={x + width / 2}
      y={y + height / 2}
      textAnchor="middle"
      dy=".3em"
      className="text-xs font-semibold fill-white">

      {value > 5 ? `${value}%` : ''}
    </text>);

};

function InfoTooltip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex-shrink-0">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        aria-label="More information"
        aria-describedby={show ? 'info-tooltip' : undefined}
        className="text-gray-400 hover:text-[#00A3E0] transition-colors mt-0.5"
      >
        <Info className="w-4 h-4" aria-hidden="true" />
      </button>
      {show && (
        <div id="info-tooltip" role="tooltip" className="absolute right-0 top-full mt-2 z-30 w-64 bg-[#3D3D3D] text-white text-xs rounded-lg px-3 py-2.5 shadow-xl leading-relaxed pointer-events-none">
          {text}
          <div className="absolute -top-1.5 right-3 w-3 h-3 bg-[#3D3D3D] rotate-45" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

export default function StrategicSummaryBar({ onChatOpen, hideKpis = false }) {
  return (
    <div className="space-y-4">
      {/* KPI Cards and Benchmark — conditionally hidden */}
      {!hideKpis &&
      <>
          {/* KPI Cards */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">[Parent Org] Workforce Summary</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard icon={TrendingUp} label="Your Org. Avg. Results" value={ORG_KPIS.avgScore.toFixed(2)} sub="Self-assessed average score" color="#00A3E0" tooltip="The average self-assessed proficiency score across all individuals and domains in your organization, on a 0–3 scale." />
              <MetricCard icon={Target} label="NAHQ Standard Role Target (Avg.)" value={ORG_KPIS.avgTarget.toFixed(2)} sub="Avg. expected proficiency" color="#6B4C9A" tooltip="The weighted average NAHQ role-based standard target across all assessed individuals in your organization." />
              <MetricCard icon={BarChart2} label="Avg. Distance to NAHQ Standard" value={ORG_KPIS.avgDist.toFixed(2)} sub="Points below target" color="#F59E0B" tooltip="The average gap between individual scores and their role-based NAHQ standard targets across your organization." />
              <MetricCard icon={BarChart3} label="National Benchmark (Avg.)" value={NATIONAL_BENCHMARK.toFixed(2)} sub="Avg. across all organizations" color="#12B76A" tooltip="The national average proficiency score across all participating organizations in the NAHQ Workforce Accelerator." />
            </div>
          </div>

          {/* Org Score Progress Bar Section */}
          <OrgScoreProgressBar orgScore={ORG_KPIS.avgScore} nahqTarget={ORG_KPIS.avgTarget} nationalBenchmark={NATIONAL_BENCHMARK} />
        </>
      }

      {/* AI Workforce Insights Summary */}
      <WorkforceInsightsSummary onChatOpen={null} />

      {/* KEY QUESTION 1 — Full-width hero card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#00A3E0] bg-[#00A3E0]/8 px-2 py-0.5 rounded-full">COMPETENCY LEVEL DISTRIBUTION BY DOMAIN</span>
            <p className="text-sm font-semibold text-[#3D3D3D] mt-2 leading-snug">Displays how individuals are distributed across the levels of work by domain.</p>
          </div>
          <InfoTooltip text="Displays how individuals are distributed across the levels of work by domain." />
        </div>

        <div>
           {/* Stacked bar chart — full width */}
           <ResponsiveContainer width="100%" height={320} className="text-gray-600">
             <BarChart
              data={DOMAIN_DISTRIBUTION.map((d) => ({ ...d, name: abbreviateDomain(d.name) }))}
              margin={{ left: 0, right: 0, top: 16, bottom: 40 }}>

               <CartesianGrid vertical={false} stroke="currentColor" className="text-gray-100" />
               <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={70}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'currentColor', wordWrap: 'break-word' }}
                tickMargin={4}
                interval={0} />

               <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'currentColor' }}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]} />

               <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />

               <Bar dataKey="N/A" stackId="a" fill="#D0D5DD" isAnimationActive={false} shape={<RoundedBar />} />
               <Bar dataKey="Found." stackId="a" fill="#FFD400" isAnimationActive={false} shape={<RoundedBar />} />
               <Bar dataKey="Proficient" stackId="a" fill="#12B76A" isAnimationActive={false} shape={<RoundedBar />} />
               <Bar
                dataKey="Advanced"
                stackId="a"
                fill="#2E90FA"
                isAnimationActive={false}
                shape={<RoundedBar />} />

             </BarChart>
           </ResponsiveContainer>

           {/* Legend with KPI metric */}
           <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
             {/* Color Legend */}
             <div>
               <p className="text-xs font-semibold text-gray-700 mb-2">Selected Level</p>
               <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded" style={{ backgroundColor: '#D0D5DD' }}></div>
                   <span>0=Not Responsible</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded" style={{ backgroundColor: '#FFD400' }}></div>
                   <span>1=Foundational</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded" style={{ backgroundColor: '#12B76A' }}></div>
                   <span>2=Proficient</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded" style={{ backgroundColor: '#2E90FA' }}></div>
                   <span>3=Advanced</span>
                 </div>
               </div>
             </div>

             {/* Assessment Completion KPI */}
             <div className="pt-2 border-t border-gray-100">
               <div className="flex items-center justify-between">
                 <span className="text-xs font-semibold text-gray-700">Assessment Completion Rate</span>
                 <span className="text-lg font-bold text-[#3D3D3D]">{COMPLETION_RATE}%</span>
               </div>
               <p className="text-xs text-gray-500 mt-1">{TOTAL_ASSESSED} of {TOTAL_PARTICIPANTS} participants</p>
             </div>
           </div>
         </div>
      </div>
    </div>);

}