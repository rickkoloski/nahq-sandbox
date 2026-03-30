import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Target, TrendingUp, Users, BarChart3,
  ChevronDown, Info, Award, ShieldAlert,
  Settings2, Globe, FileCheck, Cpu, ChevronRight, Info as InfoIcon } from 'lucide-react';
import Header from '@/components/shared/Header';
import Breadcrumb from '@/components/shared/Breadcrumb';
import FloatingChatButton from '@/components/shared/FloatingChatButton';
import AIChatModal from '@/components/shared/AIChatModal';
import AISummaryCard from '@/components/individual/AISummaryCard';
import DomainCompetencyPanel from '@/components/executive/DomainCompetencyPanel';
import CompetencyProgressGauge from '@/components/individual/CompetencyProgressGauge';
import {
  DOMAINS, COMPETENCIES, levelLabel, levelColor, severityConfig } from '@/components/individual/individualMockData';

const PEER_GROUPS = ['All Respondents', 'Similar Job Level', 'Similar Setting'];

const DOMAIN_ICONS = {
  'quality-leadership':      Award,
  'patient-safety':          ShieldAlert,
  'performance-improvement': Settings2,
  'health-data-analytics':   BarChart3,
  'regulatory-accreditation':FileCheck,
  'population-health':       Globe,
  'healthcare-technology':   Cpu,
  'professional-engagement': Users,
};

const BANDS = [
  { from: 0, to: 1, color: '#F8FAFB', label: 'Foundational' },
  { from: 1, to: 2, color: '#F0F4F6', label: 'Proficient' },
  { from: 2, to: 3, color: '#E7EDF0', label: 'Advanced' },
];

function gapPillStyle(gap) {
  if (gap <= 0) return { bg: '#D1FAE5', text: '#065F46' };
  if (gap <= 0.4) return { bg: '#FEF3C7', text: '#92400E' };
  return { bg: '#FEE2E2', text: '#991B1B' };
}

// Accessible tooltip — works on both hover and keyboard focus
function InfoTooltip({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex-shrink-0">
      <button
        type="button"
        aria-label={`More information: ${text}`}
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="p-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-1"
      >
        <Info aria-hidden="true" className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition-colors" />
      </button>
      {open && (
        <div
          role="tooltip"
          className="absolute right-0 top-6 z-30 w-56 bg-gray-900 text-white text-[11px] leading-relaxed rounded-lg px-3 py-2 shadow-lg pointer-events-none"
        >
          {text}
        </div>
      )}
    </div>
  );
}

function CompetencyBulletRow({ comp, domainColor, roleTarget }) {
  const score = comp.score ?? comp.currentLevel;
  const gap = parseFloat((roleTarget - score).toFixed(1));
  const pill = gapPillStyle(gap);
  const scorePct = score / 3 * 100;
  const targetPct = roleTarget / 3 * 100;
  const gapLabel = gap <= 0 ? 'Target met' : `${gap.toFixed(1)} below target`;

  return (
    <div className="flex items-center gap-3 py-2">
      {/* Competency name */}
      <div className="w-52 flex-shrink-0">
        <Link
          to={createPageUrl(`IndividualCompetencyDetail?competency=${comp.slug}&domain=${comp.domainSlug}`)}
          className="text-[11px] font-semibold text-[#3D3D3D] hover:text-[#00A3E0] transition-colors leading-snug block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-1 rounded"
        >
          {comp.name}
        </Link>
      </div>

      {/* Bullet bar — decorative, text alternative provided via score/gap */}
      <div
        aria-hidden="true"
        className="flex-1 relative h-6 rounded overflow-hidden flex border border-slate-200"
      >
        {BANDS.map((b) => (
          <div
            key={b.label}
            className="h-full flex-shrink-0"
            style={{ width: `${(b.to - b.from) / 3 * 100}%`, backgroundColor: b.color }}
          />
        ))}
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded"
          style={{ left: 0, width: `${scorePct}%`, height: '42%', backgroundColor: domainColor, minWidth: 4 }}
        />
        <div
          className="absolute top-1/2 w-3 h-3 rounded-full border-2 border-white shadow-sm"
          style={{ left: `${scorePct}%`, transform: 'translate(-50%, -50%)', backgroundColor: domainColor }}
        />
        <div
          className="absolute top-0 h-full"
          style={{ left: `${targetPct}%`, width: 2.5, backgroundColor: '#00A3E0', transform: 'translateX(-50%)' }}
        >
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 6, height: 3, backgroundColor: '#00A3E0', borderRadius: '0 0 2px 2px' }} />
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 6, height: 3, backgroundColor: '#00A3E0', borderRadius: '2px 2px 0 0' }} />
        </div>
      </div>

      {/* Score + gap — with screen-reader accessible labels */}
      <div className="w-24 flex-shrink-0 flex items-center gap-1.5">
        <span className="text-sm font-bold text-[#3D3D3D]">{score.toFixed(1)}</span>
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: pill.bg, color: pill.text }}
          aria-label={gapLabel}
        >
          {gap <= 0 ? '✓ Met' : `↑${gap.toFixed(1)}`}
        </span>
      </div>
    </div>
  );
}

export default function IndividualDomainDetail() {
  const params = new URLSearchParams(window.location.search);
  const domainSlug = params.get('domain') || 'patient-safety';

  const domain = DOMAINS.find((d) => d.slug === domainSlug) || DOMAINS[0];
  const comps = COMPETENCIES.filter((c) => c.domainSlug === domainSlug);

  const [peerGroup, setPeerGroup] = useState('Similar Job Level');
  const [peerOpen, setPeerOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelType, setPanelType] = useState(null);
  const [panelName, setPanelName] = useState(null);
  const [infoIconCompetency, setInfoIconCompetency] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const peerMenuRef = useRef(null);

  const Icon = DOMAIN_ICONS[domainSlug] || Award;

  const avgScore = comps.length
    ? parseFloat((comps.reduce((s, c) => s + (c.score ?? c.currentLevel), 0) / comps.length).toFixed(2))
    : 0;

  const roleTarget = domain.roleTarget ?? 2;
  const gap = parseFloat((roleTarget - avgScore).toFixed(2));
  const belowTarget = comps.filter((c) => (c.score ?? c.currentLevel) < roleTarget).length;

  const lc = levelColor(Math.round(avgScore));

  const benchmarkMap = {
    'All Respondents':  parseFloat((avgScore * 0.88).toFixed(2)),
    'Similar Job Level':parseFloat((avgScore * 0.93).toFixed(2)),
    'Similar Setting':  parseFloat((avgScore * 0.90).toFixed(2)),
  };
  const displayBenchmark = benchmarkMap[peerGroup];

  // Close peer dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (peerMenuRef.current && !peerMenuRef.current.contains(e.target)) setPeerOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#00A3E0] focus:text-white focus:rounded-lg focus:font-semibold"
      >
        Skip to main content
      </a>

      <Header currentPage="Individual" />
      <FloatingChatButton onClick={() => setChatOpen(true)} />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb
            items={[
              { label: 'My Dashboard', href: createPageUrl('IndividualDashboard') },
              { label: domain.name, color: domain.color },
            ]}
          />
          <div className="flex items-start justify-between gap-4 mt-1">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                  style={{ backgroundColor: `${domain.color}18`, color: domain.color }}
                >
                  Domain Overview
                </span>
              </div>
              <button
                onClick={() => setPanelOpen(true)}
                aria-label={`${domain.name} — click to view domain details`}
                className="text-lg md:text-xl font-bold text-[#3D3D3D] hover:text-[#00A3E0] transition-colors text-left flex items-start gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-2 rounded"
              >
                {domain.name}
                <Info aria-hidden="true" className="w-5 h-5 text-gray-300 group-hover:text-[#00A3E0] transition-colors flex-shrink-0 mt-1" />
              </button>
              <p className="text-xs text-gray-600 mt-1">Domain performance · competency breakdown · growth targets</p>
            </div>
          </div>
        </div>
      </div>

      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* KPI Tiles */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.04 }}>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Avg Domain Results */}
            <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div aria-hidden="true" className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${domain.color}18` }}>
                  <Icon aria-hidden="true" className="w-4 h-4" style={{ color: domain.color }} />
                </div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold leading-tight">Avg. Domain Results</p>
                <div className="ml-auto">
                  <InfoTooltip text="Your average result across all competencies in this domain (0–3 scale)." />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-2xl font-bold text-[#3D3D3D] leading-none">
                  {avgScore}<span className="text-sm text-gray-500 font-normal"> / 3</span>
                </p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: lc.bg, color: lc.text }}>
                  {levelLabel(Math.round(avgScore))}
                </span>
              </div>
              <p className="text-[11px] text-gray-600 leading-snug">Your average results for this domain</p>
            </div>

            {/* Below Target */}
            <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div aria-hidden="true" className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FF6B6B15' }}>
                  <TrendingUp aria-hidden="true" className="w-4 h-4" style={{ color: '#FF6B6B' }} />
                </div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold leading-tight">Below Target</p>
                <div className="ml-auto">
                  <InfoTooltip text="Number of competencies in this domain where your level is below the NAHQ expected level for your role." />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-2xl font-bold text-[#3D3D3D] leading-none">{belowTarget}</p>
              </div>
              <p className="text-[11px] text-gray-600 leading-snug">Competencies below NAHQ standard</p>
            </div>

            {/* National Benchmark */}
            <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div aria-hidden="true" className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#6B4C9A18' }}>
                  <Users aria-hidden="true" className="w-4 h-4" style={{ color: '#6B4C9A' }} />
                </div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold leading-tight">National Benchmark</p>
                <div className="ml-auto">
                  <InfoTooltip text="Average overall result of professionals with a similar job level in the national NAHQ dataset." />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#3D3D3D] leading-none">
                {displayBenchmark}<span className="text-sm text-gray-500 font-normal"> / 3.0</span>
              </p>
              {/* Live region so peer group change is announced */}
              <p
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="text-[11px] text-gray-600 mt-1 mb-2"
              >
                Compared to {peerGroup.toLowerCase()}
              </p>
              <div className="relative" ref={peerMenuRef}>
                <button
                  type="button"
                  onClick={() => setPeerOpen((o) => !o)}
                  aria-haspopup="listbox"
                  aria-expanded={peerOpen}
                  aria-label={`Peer group: ${peerGroup}. Click to change.`}
                  className="flex items-center gap-1 text-[10px] font-semibold text-[#00A3E0] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-1 rounded"
                >
                  Change group <ChevronDown aria-hidden="true" className="w-3 h-3" />
                </button>
                {peerOpen && (
                  <ul
                    role="listbox"
                    aria-label="Select peer group"
                    className="absolute left-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg w-48 py-1"
                  >
                    {PEER_GROUPS.map((g) => (
                      <li key={g} role="option" aria-selected={g === peerGroup}>
                        <button
                          type="button"
                          onClick={() => { setPeerGroup(g); setPeerOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:bg-gray-50 ${g === peerGroup ? 'font-semibold text-[#00A3E0]' : 'text-gray-700'}`}
                        >
                          {g}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Competency Bullet Chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.08 }}>
          <section aria-labelledby="competency-results-heading" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 id="competency-results-heading" className="text-sm font-bold text-[#3D3D3D] uppercase tracking-wide">
                  Competency Results
                </h2>
                <InfoTooltip text="Your self-assessed level of work for competencies within the Domain on the 0–3 scale compared to the NAHQ Standard Role Target." />
              </div>
              <p className="text-xs text-gray-600 mt-0.5">Your results vs. NAHQ Standard Role Target (0–3 scale)</p>
            </div>

            {/* Legend */}
            <div className="px-6 pt-4 flex items-center gap-4 flex-wrap" aria-hidden="true">
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-3 rounded-sm" style={{ backgroundColor: domain.color }} />
                <span className="text-[10px] text-gray-600 font-semibold">Your Results</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-0.5 h-4" style={{ backgroundColor: '#00A3E0' }} />
                <span className="text-[10px] text-gray-600 font-semibold">NAHQ Role Target ({roleTarget})</span>
              </div>
              <div className="flex items-center gap-3 ml-auto text-[10px] text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#F8FAFB', border: '1px solid #D1D9DD' }} />
                  Foundational
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#F0F4F6', border: '1px solid #D1D9DD' }} />
                  Proficient
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#E7EDF0', border: '1px solid #C0CDD3' }} />
                  Advanced
                </span>
              </div>
            </div>

            <div className="px-6 py-4 space-y-1 divide-y divide-gray-50">
              {comps.map((comp) => (
                <CompetencyBulletRow
                  key={comp.slug}
                  comp={comp}
                  domainColor={domain.color}
                  roleTarget={roleTarget}
                />
              ))}
            </div>

            {/* Scale ticks */}
            <div className="px-6 pb-4" aria-hidden="true">
              <div className="ml-[calc(13rem+0.75rem)] mr-24 flex justify-between px-0">
                {[0, 1, 2, 3].map((v) => (
                  <span key={v} className="text-[9px] text-gray-500">{v}</span>
                ))}
              </div>
            </div>
          </section>
        </motion.div>

        {/* AI Summary */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.1 }}>
          <AISummaryCard
            text={`You're currently averaging ${avgScore}/3 across this domain. Your role target is ${roleTarget}/3, with ${belowTarget} competencies below standard. Your peers (${peerGroup.toLowerCase()}) average ${displayBenchmark}/3. Focus on the below-target competencies to strengthen your domain impact.`}
            ctaLabel="View recommended courses"
            ctaHref={createPageUrl('IndividualDashboard?tab=plan')}
            context={{
              domain: domain.name,
              currentLevel: avgScore,
              roleTarget,
              gap,
              peerGroup,
              belowTargetCount: belowTarget,
              displayBenchmark,
            }}
          />
        </motion.div>

        {/* Competency Cards Grid */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.12 }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-[#3D3D3D] uppercase tracking-wide">Competencies</h2>
              <p className="text-xs text-gray-600 mt-0.5">Click any competency to see details and recommended courses</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {comps.map((comp) => {
              const score = comp.score ?? comp.currentLevel;
              const coursesCount = Math.floor(Math.random() * 5) + 1;
              return (
                <div
                  key={comp.slug}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md hover:border-gray-300 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <Link
                      to={createPageUrl(`IndividualCompetencyDetail?domain=${domainSlug}&competency=${comp.slug}`)}
                      className="text-sm font-bold text-[#3D3D3D] leading-snug flex-1 min-w-0 hover:text-[#00A3E0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-1 rounded"
                    >
                      {comp.name}
                    </Link>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setInfoIconCompetency(comp.name);
                          setPanelOpen(true);
                          setPanelType('competency');
                          setPanelName(comp.name);
                        }}
                        aria-label={`View details for competency: ${comp.name}`}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-1"
                      >
                        <InfoIcon aria-hidden="true" className="w-4 h-4 text-gray-400 hover:text-[#00A3E0] transition-colors" />
                      </button>
                      <Link
                        to={createPageUrl(`IndividualCompetencyDetail?domain=${domainSlug}&competency=${comp.slug}`)}
                        aria-label={`View ${comp.name} competency detail`}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-1"
                      >
                        <ChevronRight aria-hidden="true" className="w-4 h-4 text-gray-400 group-hover:text-[#00A3E0] transition-colors mt-0.5" />
                      </Link>
                    </div>
                  </div>

                  <CompetencyProgressGauge
                    score={score}
                    roleTarget={roleTarget}
                    domainColor={domain.color}
                    coursesCount={coursesCount}
                  />

                  <Link
                    to={createPageUrl(`IndividualCompetencyDetail?domain=${domainSlug}&competency=${comp.slug}`)}
                    aria-label={`View details for ${comp.name}`}
                    className="block mt-4 text-[11px] font-semibold text-[#00A3E0] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-1 rounded"
                  >
                    View Details <span aria-hidden="true">→</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </motion.div>

      </main>

      <DomainCompetencyPanel
        isOpen={panelOpen}
        onClose={() => {
          setPanelOpen(false);
          setInfoIconCompetency(null);
        }}
        type={panelType || 'domain'}
        name={panelName || domain.name}
      />

      <AIChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        context={{
          domain: domain.name,
          avgScore,
          roleTarget,
          belowTargetCount: belowTarget,
          peerGroup,
          displayBenchmark,
        }}
      />
    </div>
  );
}