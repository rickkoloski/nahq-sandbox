import React from 'react';
import { MessageCircle, AlertTriangle, TrendingDown, BarChart2, Target, Users, Activity, ClipboardList, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

const WFA_BENCHMARK_PCT = 60;

const Q2_DOMAINS = [
  { name: 'Health Data Analytics', readiness: 20, color: '#8A6D3B' },
  { name: 'Performance Improvement', readiness: 35, color: '#0F6C74' },
  { name: 'Population Health', readiness: 40, color: '#2E7D32' },
  { name: 'Professional Engagement', readiness: 58, color: '#7B1FA2' },
  { name: 'Regulatory & Accreditation', readiness: 55, color: '#C62828' },
  { name: 'Quality Leadership', readiness: 60, color: '#1E5BB8' },
  { name: 'Quality Review & Accountability', readiness: 62, color: '#AD1457' },
  { name: 'Patient Safety', readiness: 72, color: '#E67E22' },
];

const Q3_GAPS = [
  { name: 'Acquire data from source systems', domain: 'Health Data Analytics', dist: 0.72 },
  { name: 'Design data collection plans', domain: 'Health Data Analytics', dist: 0.61 },
  { name: 'Identify improvement opportunities', domain: 'Performance Improvement', dist: 0.48 },
  { name: 'Apply statistical process control methods', domain: 'Performance Improvement', dist: 0.38 },
  { name: 'Manage population health data & registries', domain: 'Population Health', dist: 0.29 },
];

function gapStyle(dist) {
  if (dist >= 0.5) return { bg: '#FEE2E2', text: '#991B1B', label: 'Critical' };
  if (dist >= 0.2) return { bg: '#FFF3E0', text: '#7C3D0A', label: 'Moderate' };
  return { bg: '#FEF3C7', text: '#92400E', label: 'Mild' };
}

export default function StrategicSummaryBar({ onChatOpen }) {
  return (
    <div className="space-y-4">
      {/* KEY QUESTION 1 — Full-width hero card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#00A3E0] bg-[#00A3E0]/8 px-2 py-0.5 rounded-full">Key Question 1</span>
            <p className="text-sm font-semibold text-[#3D3D3D] mt-2 leading-snug">How much of my workforce is performing at expected competency levels?</p>
          </div>
          {onChatOpen && (
            <Button onClick={() => onChatOpen('overview')} variant="outline" size="sm" className="border-[#00A3E0] text-[#00A3E0] hover:bg-[#00A3E0]/5 text-xs flex-shrink-0">
              <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
              Discuss Insights
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 items-start">
          {/* LEFT: Hero number + benchmark comparison bars */}
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold mb-1">Workforce Readiness</p>
            <div className="flex items-end gap-3 mb-1">
              <span className="text-3xl font-bold text-[#3D3D3D] leading-none tracking-tight">48%</span>
              <span className="mb-1 inline-flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                ↓ 12 pts below benchmark
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-4">of workforce meeting role-based competency targets (NAHQ Standard)</p>

            {/* Single combined bar with two markers */}
            <div>
              <div className="relative h-2 bg-gray-100 rounded-full overflow-visible mb-3">
                {/* Org fill */}
                <div className="absolute inset-y-0 left-0 rounded-full bg-[#00A3E0]" style={{ width: '48%' }} />
                {/* Org marker */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center" style={{ left: '48%' }}>
                  <div className="w-4.5 h-4.5 rounded-full bg-[#00A3E0] border-2 border-white shadow-md" style={{ width: '18px', height: '18px' }} />
                </div>
                {/* Benchmark marker */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center" style={{ left: '60%' }}>
                  <div className="w-4.5 h-4.5 rounded-full bg-[#3D3D3D] border-2 border-white shadow-md" style={{ width: '18px', height: '18px' }} />
                </div>
              </div>
              {/* Legend below bar */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00A3E0] flex-shrink-0" />
                  <span>Your Organization <strong className="text-[#00A3E0]">48%</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3D3D3D] flex-shrink-0" />
                  <span>WFA Benchmark <strong className="text-[#3D3D3D]">60%</strong></span>
                </div>
              </div>
            </div>

            {/* AI Summary */}
             <div className="mt-5 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-4">
               <div className="flex items-center gap-2 mb-2">
                 <Sparkles className="w-4 h-4 text-[#00A3E0] flex-shrink-0" />
                 <p className="text-[10px] font-bold uppercase tracking-wide text-[#00A3E0]">AI Analysis</p>
               </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                <strong className="text-[#3D3D3D]">48% of your workforce is meeting role-based competency targets</strong>, placing your organization 12 points below the WFA National Benchmark of 60%. Roughly <strong>18 of your 34 assessed staff</strong> have not yet reached the proficiency level expected for their role. The shortfall is most pronounced in <strong>Health Data Analytics</strong> and <strong>Performance Improvement</strong>, which together represent over 70% of the overall gap. The average distance to target across the workforce is 0.28, suggesting that most staff are relatively close to their role-based expectations.
              </p>
            </div>
          </div>

          {/* RIGHT: Supporting KPI icon cards */}
          <div className="flex flex-col gap-3">
            {/* Card 1 */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#F68B1F]/15 flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-[#F68B1F]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold leading-tight mb-1">Avg Distance to Target</p>
                <p className="text-2xl font-bold text-[#3D3D3D] leading-none">0.28</p>
                <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: '#FFF3E0', color: '#7C3D0A' }}>Dev. Opportunity</span>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold leading-tight mb-1">WFA Benchmark</p>
                <p className="text-2xl font-bold text-[#3D3D3D] leading-none">60%</p>
                <p className="text-xs text-red-500 mt-1 font-medium">−12 pts gap</p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#00A3E0]/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-[#00A3E0]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold leading-tight mb-1">Staff Assessed</p>
                <p className="text-2xl font-bold text-[#3D3D3D] leading-none">34</p>
                <p className="text-xs text-gray-400 mt-1">of 47 invited</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KEY QUESTIONS 2 & 3 — Side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Q2 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#00A3E0] bg-[#00A3E0]/8 px-2 py-0.5 rounded-full mb-2">Key Question 2</span>
          <p className="text-sm font-semibold text-[#3D3D3D] mb-4 leading-snug">Is each capability area performing at expected levels?</p>
          <div className="space-y-2.5">
            {Q2_DOMAINS.map(d => (
              <div key={d.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600 truncate flex-1 mr-2">{d.name}</span>
                  <span className="text-xs font-bold text-[#3D3D3D] flex-shrink-0">{d.readiness}%</span>
                </div>
                <div className="relative h-2 bg-gray-100 rounded-full">
                  <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${d.readiness}%`, backgroundColor: d.color }} />
                  {/* Benchmark marker — dark vertical tick */}
                  <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-gray-700 rounded-full z-10" style={{ left: `${WFA_BENCHMARK_PCT}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            <div className="w-0.5 h-3 bg-gray-700 rounded-full" />
            <p className="text-[10px] text-gray-500">WFA benchmark ({WFA_BENCHMARK_PCT}%)</p>
          </div>
        </div>

        {/* Q3 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#00A3E0] bg-[#00A3E0]/8 px-2 py-0.5 rounded-full mb-2">Key Question 3</span>
          <p className="text-sm font-semibold text-[#3D3D3D] mb-4 leading-snug">Which capabilities have the largest gaps and highest urgency?</p>
          <div className="space-y-2">
             {Q3_GAPS.map((g, i) => {
               const gc = gapStyle(g.dist);
               return (
                 <Link
                   key={i}
                   to={`${createPageUrl('CompetencyDetail')}?domain=${encodeURIComponent(g.domain)}&competency=${encodeURIComponent(g.name)}`}
                   className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-gray-100 hover:border-[#00A3E0] hover:bg-[#00A3E0]/5 transition-colors cursor-pointer group"
                 >
                   <div className="flex-1 min-w-0">
                     <p className="text-xs font-medium leading-snug text-gray-800 group-hover:text-[#00A3E0] transition-colors">{g.name}</p>
                     <p className="text-[10px] text-gray-400 mt-0.5">{g.domain}</p>
                   </div>
                   <div className="text-right flex-shrink-0 flex items-center gap-2">
                     <p className="text-sm font-bold text-[#3D3D3D]">{g.dist.toFixed(2)}</p>
                     <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap"
                       style={{ backgroundColor: gc.bg, color: gc.text }}>{gc.label}</span>
                   </div>
                 </Link>
               );
             })}
           </div>
          <p className="text-[10px] text-gray-400 mt-3">Avg Distance to Target — sorted by severity</p>
        </div>
      </div>


    </div>
  );
}