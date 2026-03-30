import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, Target, AlertTriangle, BookOpen, ChevronDown, ChevronRight } from 'lucide-react';

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

function statusInfo(dist) {
  if (dist <= 0.20) return { label: 'On Target', color: '#059669' };
  if (dist <= 0.50) return { label: 'Moderate', color: '#B45309' };
  return { label: 'Critical', color: '#DC2626' };
}

function StatusLabel({ dist }) {
  const s = statusInfo(dist);
  return <span className="text-[10px] font-semibold" style={{ color: s.color }}>{s.label}</span>;
}

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
  const domainAvgDist = comps.reduce((sum, c) => sum + Math.max(0, target - c.score), 0) / comps.length;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Domain header — clickable */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex-shrink-0 text-gray-400">
          {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </div>
        <span className="text-xs font-semibold text-[#3D3D3D] flex-1">{domain}</span>
        <span className="text-[10px] text-gray-400 mr-3">{comps.length} competencies</span>
        <StatusLabel dist={domainAvgDist} />
      </button>

      {/* Competency rows */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            {/* Column headers */}
            <div className="grid bg-white border-t border-b border-gray-100 px-4 py-1.5" style={{ gridTemplateColumns: '1fr 52px 52px 60px 64px' }}>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Competency</div>
              <div className="text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Results</div>
              <div className="text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Target</div>
              <div className="text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Distance</div>
              <div className="text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Status</div>
            </div>
            <div className="divide-y divide-gray-100">
              {comps.map((c, i) => {
                const cDist = Math.max(0, target - c.score);
                const cMet = c.score >= target;
                return (
                  <div key={i} className="grid items-center px-4 py-3 hover:bg-gray-50 transition-colors" style={{ gridTemplateColumns: '1fr 52px 52px 60px 64px' }}>
                    <span className="text-xs text-gray-600 pr-3">{c.compName}</span>
                    <span className={`text-xs font-semibold text-right ${cMet ? 'text-[#059669]' : 'text-[#3D3D3D]'}`}>{c.score.toFixed(1)}</span>
                    <span className="text-xs text-gray-400 text-right">{target.toFixed(1)}</span>
                    <span className="text-xs font-medium text-[#3D3D3D] text-right">{cMet ? '—' : cDist.toFixed(2)}</span>
                    <div className="text-right"><StatusLabel dist={cDist} /></div>
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

  const byDomain = competencies.reduce((acc, c) => {
    if (!acc[c.domain]) acc[c.domain] = [];
    acc[c.domain].push(c);
    return acc;
  }, {});

  const metrics = [
    {
      label: 'Role Target Attainment',
      value: `${attainmentPct}%`,
      icon: Target,
      sub: `${competencies.length - belowTarget.length} of ${competencies.length} met`,
    },
    {
      label: 'Competencies Below Target',
      value: belowTarget.length,
      icon: AlertTriangle,
      sub: `of ${competencies.length} total`,
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
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-3.5 h-3.5 text-[#00A3E0] flex-shrink-0" />
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#00A3E0]">AI Summary</p>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong className="text-[#3D3D3D]">{user.name}</strong> scores <strong className="text-[#3D3D3D]">{user.score.toFixed(1)}</strong> against a role target of <strong className="text-[#3D3D3D]">{target.toFixed(1)}</strong>.{' '}
                {met
                  ? `Meeting or exceeding role-based expectations with ${attainmentPct}% competency attainment.`
                  : `${dist.toFixed(2)} below role target — ${belowTarget.length} competencies below threshold.`
                }{' '}
                {highestGap.dist > 0.2 && <>Highest gap in <strong className="text-[#3D3D3D]">{highestGap.name}</strong> ({highestGap.dist.toFixed(2)}). </>}
                Targeted development in <strong className="text-[#3D3D3D]">Health Data Analytics</strong> could close this gap within 2 assessment cycles.
              </p>
            </div>

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