import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, Target, BookOpen, TrendingUp, ChevronDown, ChevronRight } from 'lucide-react';
import AISummaryCard from '@/components/shared/AISummaryCard';

const COMPETENCY_DATA_ALL = {
  'Quality Leadership': [
    { name: 'Lead and sponsor quality initiatives' },
    { name: 'Foster a culture of continuous improvement' },
    { name: 'Build and sustain cross-functional teams' },
  ],
  'Patient Safety': [
    { name: 'Create and maintain a safe environment' },
    { name: 'Identify and mitigate patient safety risks' },
  ],
  'Performance Improvement': [
    { name: 'Use data to identify improvement opportunities' },
    { name: 'Plan and implement improvement initiatives' },
  ],
  'Health Data Analytics': [
    { name: 'Apply procedures for governance of data assets' },
    { name: 'Design data collection plans' },
    { name: 'Acquire data from source systems' },
  ],
  'Regulatory & Accreditation': [
    { name: 'Understand regulatory requirements' },
    { name: 'Prepare for surveys and assessments' },
  ],
};

const ROLE_TARGETS = {
  'Core Quality': 2.2,
  'Clinical Quality Bridge': 2.0,
  'D&T Clinical Support': 1.8,
  'Frontline Care Delivery': 1.7,
  'Senior Leadership': 2.3,
  'Ancillary & Operational Support': 1.6,
};



function getUserCompetencies(user, allCompData) {
  const results = [];
  Object.entries(allCompData).forEach(([domain, comps]) => {
    comps.forEach((comp, idx) => {
      const variance = ((user.name.charCodeAt(0) + comp.name.charCodeAt(0) + idx) % 7) * 0.1 - 0.3;
      const compScore = Math.max(0.5, Math.min(3.0, user.score + variance));
      results.push({ domain, compName: comp.name, score: parseFloat(compScore.toFixed(1)) });
    });
  });
  return results;
}

function DomainRow({ domain, comps, target }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex-shrink-0 text-gray-400">
          {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </div>
        <span className="text-xs font-semibold text-[#3D3D3D] flex-1">{domain}</span>
        <span className="text-[10px] text-gray-400">{comps.length} competencies</span>
        <span className="text-[10px] text-gray-400 font-semibold ml-2">
          {comps.filter(c => (target - c.score) > 0).length} below NAHQ standard
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="grid bg-white border-t border-b border-gray-100 px-4 py-1.5" style={{ gridTemplateColumns: '2fr 60px 100px 80px' }}>
               <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Competency</div>
               <div className="text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Current</div>
               <div className="text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wide">NAHQ Standard</div>
               <div className="text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Distance</div>
             </div>
             <div className="divide-y divide-gray-100">
               {comps.map((c, i) => {
                 const cDist = Math.max(0, target - c.score);
                 return (
                   <div key={i} className="grid items-center px-4 py-3 hover:bg-gray-50 transition-colors" style={{ gridTemplateColumns: '2fr 60px 100px 80px' }}>
                     <span className="text-xs text-gray-600 pr-3">{c.compName}</span>
                     <span className="text-xs font-semibold text-right text-[#3D3D3D]">{c.score.toFixed(1)}</span>
                     <span className="text-xs text-gray-400 text-right">{target.toFixed(1)}</span>
                     <span className="text-xs font-medium text-[#3D3D3D] text-right">{cDist > 0 ? cDist.toFixed(2) : '—'}</span>
                   </div>
                 );
               })}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function UserDetailModal({ user, onClose }) {
  if (!user) return null;

  const [aiSummary, setAiSummary] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const target = ROLE_TARGETS[user.role] || 2.0;
  const dist = Math.max(0, target - user.score);
  const met = user.score >= target;

  const competencies = getUserCompetencies(user, COMPETENCY_DATA_ALL);
  const belowTarget = competencies.filter(c => (target - c.score) > 0.2);
  const highestGap = competencies.reduce((max, c) => {
    const d = Math.max(0, target - c.score);
    return d > max.dist ? { dist: d, name: c.compName } : max;
  }, { dist: 0, name: '' });

  const attainmentPct = Math.round(((competencies.length - belowTarget.length) / competencies.length) * 100);
  const learningProgress = Math.round(Math.min(100, (user.score / 3.0) * 100 - 5 + ((user.name.charCodeAt(0)) % 15)));

  const aiPrompt = `You are a healthcare quality workforce strategist writing for a C-suite executive audience. Write a brief 3–4 sentence executive summary specific to ${user.name} (${user.role}) based on their assessment profile:

- Overall Score: ${user.score.toFixed(1)} / 3.0
- Role Target: ${target.toFixed(1)}
- Distance to Target: ${dist > 0 ? dist.toFixed(2) : 'Met'}
- Competencies Below Threshold: ${belowTarget.length} of ${competencies.length}
- Highest Gap: ${highestGap.name} (${highestGap.dist.toFixed(2)} points)

Write in a direct, analytical tone. Focus on their capability positioning relative to role standards and identify 1–2 priority development areas. Do NOT use alarmist language. Do NOT include recommendations or prescriptive language. Output ONLY the summary text.`;

  const byDomain = competencies.reduce((acc, c) => {
    if (!acc[c.domain]) acc[c.domain] = [];
    acc[c.domain].push(c);
    return acc;
  }, {});

  const metrics = [
    {
      label: 'Competency Results',
      value: Math.round(user.score),
      icon: TrendingUp,
      sub: 'Self-assessed score (0–3)',
    },
    {
      label: 'NAHQ Standard Role Target',
      value: target.toFixed(1),
      icon: Target,
      sub: `${user.role}`,
    },
    {
      label: 'Learning Progress',
      value: `${learningProgress}%`,
      icon: BookOpen,
      sub: 'pathway completion',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.18 }}
          className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-base font-bold text-[#3D3D3D]">{user.name}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{user.role}{user.site ? ` · ${user.site}` : ''}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-6">

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              {metrics.map(({ label, value, icon: Icon, sub }) => (
                <div key={label} className="border border-gray-200 rounded-lg px-4 py-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-md bg-[#00A3E0]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-[#00A3E0]" />
                    </div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium leading-tight">{label}</p>
                  </div>
                  <p className="text-2xl font-bold text-[#3D3D3D]">{value}</p>
                  {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
                </div>
              ))}
            </div>

            {/* AI Summary */}
             <AISummaryCard
               prompt={aiPrompt}
               title="AI-Generated Summary"
               subtitle="Narrative analysis based on assessment results."
               onChatOpen={() => {}}
             />

            {/* Domain & Competency Breakdown */}
            <div>
              <h3 className="text-xs font-bold text-[#3D3D3D] uppercase tracking-wide mb-3">Domain & Competency Breakdown</h3>
              <div className="space-y-2">
                {Object.entries(byDomain).map(([domain, comps]) => (
                  <DomainRow key={domain} domain={domain} comps={comps} target={target} />
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}