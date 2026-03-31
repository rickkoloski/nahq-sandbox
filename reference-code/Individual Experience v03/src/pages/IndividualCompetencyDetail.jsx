import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  ArrowLeft, Target, TrendingUp, Users, BarChart3,
  CheckCircle2, ArrowRight, ChevronDown, ExternalLink, Info, Clock
} from 'lucide-react';
import Header from '@/components/shared/Header';
import Breadcrumb from '@/components/shared/Breadcrumb';
import FloatingChatButton from '@/components/shared/FloatingChatButton';
import AIChatModal from '@/components/shared/AIChatModal';
import AISummaryCard from '@/components/individual/AISummaryCard';
import CourseDetailModal from '@/components/individual/CourseDetailModal';
import DomainCompetencyPanel from '@/components/executive/DomainCompetencyPanel';
import {
  COMPETENCIES, DOMAINS, COURSE_CATALOG,
  levelLabel, levelColor, severityConfig
} from '@/components/individual/individualMockData';

const PEER_GROUPS = ['All Respondents', 'Similar Job Level', 'Similar Setting'];

const FORMAT_COLORS = {
  'On-demand': { bg: '#EFF6FF', text: '#1D4ED8' },
  'Webinar':   { bg: '#F0FDF4', text: '#15803D' },
  'Guided':    { bg: '#FDF4FF', text: '#7E22CE' },
};

// Accessible tooltip — works on hover AND keyboard focus
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

export default function IndividualCompetencyDetail() {
  const params = new URLSearchParams(window.location.search);
  const domainSlug = params.get('domain') || 'patient-safety';
  const compSlug   = params.get('competency') || 'safety-risk-mitigation';

  const comp   = COMPETENCIES.find(c => c.slug === compSlug) || COMPETENCIES[4];
  const domain = DOMAINS.find(d => d.slug === (comp?.domainSlug || domainSlug));

  const [peerGroup, setPeerGroup] = useState('Similar Job Level');
  const [peerOpen, setPeerOpen] = useState(false);
  const [detailCourse, setDetailCourse] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelType, setPanelType] = useState(null);
  const [panelName, setPanelName] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const peerMenuRef = useRef(null);

  const handleOpenPanel = (type, name) => {
    setPanelType(type);
    setPanelName(name);
    setPanelOpen(true);
  };

  const currentLc = levelColor(comp.score ?? comp.currentLevel);
  const nextLc    = levelColor(domain?.roleTarget ?? comp.nextLevel);

  const benchmarkBase = parseFloat((comp.currentLevel * 0.85 + (comp.percentile / 100) * 0.4).toFixed(2));
  const benchmarkMap  = {
    'All Respondents':   benchmarkBase,
    'Similar Job Level': parseFloat(Math.min(3, benchmarkBase + 0.12).toFixed(2)),
    'Similar Setting':   parseFloat(Math.max(0, benchmarkBase - 0.08).toFixed(2)),
  };
  const displayBenchmark = benchmarkMap[peerGroup];
  const displayPercentile = comp.percentile;

  const roleTarget = Math.round(domain?.roleTarget ?? 2);
  const gap = Math.max(0, roleTarget - (comp.score ?? comp.currentLevel));
  const sev = severityConfig(gap);

  const matchingCourses = COURSE_CATALOG.filter(c => c.competencySlugs.includes(comp.slug));

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
              { label: domain?.name || 'Domain', href: createPageUrl(`IndividualDomainDetail?domain=${comp.domainSlug}`), color: domain?.color },
              { label: comp.name },
            ]}
          />

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <button
                  type="button"
                  onClick={() => handleOpenPanel('domain', domain?.name)}
                  aria-label={`${domain?.name} domain — click to view domain details`}
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded hover:opacity-80 transition-opacity cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-1"
                  style={{ backgroundColor: `${domain?.color || '#00A3E0'}18`, color: domain?.color || '#00A3E0' }}
                >
                  {domain?.name}
                  <Info aria-hidden="true" className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </button>
              </div>
              <div className="flex items-start gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenPanel('competency', comp.name)}
                  aria-label={`${comp.name} — click to view competency details`}
                  className="text-lg md:text-xl font-bold text-[#3D3D3D] leading-snug hover:text-[#00A3E0] transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-2 rounded"
                >
                  {comp.name}
                </button>
                {/* Accessible icon button — separate from title button */}
                <button
                  type="button"
                  onClick={() => handleOpenPanel('competency', comp.name)}
                  aria-label={`View details for ${comp.name}`}
                  className="mt-1 p-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-1"
                >
                  <Info aria-hidden="true" className="w-5 h-5 text-gray-300 hover:text-[#00A3E0] transition-colors flex-shrink-0" />
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-1">Your personal competency detail · results and recommended actions</p>
            </div>
          </div>
        </div>
      </div>

      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Section A — KPI Tiles */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Your Results */}
            <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div aria-hidden="true" className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${domain?.color || '#00A3E0'}15` }}>
                  <BarChart3 aria-hidden="true" className="w-4 h-4" style={{ color: domain?.color || '#00A3E0' }} />
                </div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold leading-tight">Your Results</p>
                <div className="ml-auto">
                  <InfoTooltip text="Your current level of work for this competency based on your assessment response." />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-2xl font-bold text-[#3D3D3D] leading-none">
                  {comp.score ?? comp.currentLevel}<span className="text-sm text-gray-500 font-normal"> / 3</span>
                </p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: currentLc.bg, color: currentLc.text }}>
                  {levelLabel(comp.currentLevel)}
                </span>
              </div>
              <p className="text-[11px] text-gray-600 leading-snug">Your self-assessed level for this competency</p>
            </div>

            {/* NAHQ Standard Role Target */}
            <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div aria-hidden="true" className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#05996915' }}>
                  <Target aria-hidden="true" className="w-4 h-4" style={{ color: '#059669' }} />
                </div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold leading-tight">NAHQ Standard Role Target</p>
                <div className="ml-auto">
                  <InfoTooltip text="Expected level of work for this competency based on NAHQ standards for your role." />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-2xl font-bold text-[#3D3D3D] leading-none">
                  {Math.round(domain?.roleTarget ?? 2)}<span className="text-sm text-gray-500 font-normal"> / 3</span>
                </p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: nextLc.bg, color: nextLc.text }}>
                  {levelLabel(roleTarget)}
                </span>
              </div>
              <p className="text-[11px] text-gray-600 leading-snug">The behavior level expected for your role</p>
            </div>

            {/* Distance to NAHQ Standard */}
            <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div aria-hidden="true" className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FF6B6B15' }}>
                  <TrendingUp aria-hidden="true" className="w-4 h-4" style={{ color: '#FF6B6B' }} />
                </div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold leading-tight">Distance to NAHQ Standard Role Target</p>
                <div className="ml-auto">
                  <InfoTooltip text="The number of levels between your current result and the expected level for your role." />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-2xl font-bold text-[#3D3D3D] leading-none">
                  {gap.toFixed(2)}<span className="text-sm text-gray-500 font-normal"> levels</span>
                </p>
              </div>
              <p className="text-[11px] text-gray-600 leading-snug">Gap between your results and NAHQ target</p>
            </div>

            {/* National Benchmark */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-5">
              <div className="flex items-center gap-2 mb-3">
                <div aria-hidden="true" className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#6B4C9A18' }}>
                  <Users aria-hidden="true" className="w-4 h-4" style={{ color: '#6B4C9A' }} />
                </div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold leading-tight">National Benchmark</p>
                <div className="ml-auto">
                  <InfoTooltip text="Average score for professionals at a similar job level based on NAHQ national assessment data." />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#3D3D3D] leading-none">
                {displayBenchmark}<span className="text-sm text-gray-500 font-normal"> / 3.0</span>
              </p>
              {/* Live region announces peer group changes to screen readers */}
              <p
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="text-[11px] text-gray-600 mt-1"
              >
                Compared to {peerGroup.toLowerCase()}
              </p>
              <div className="relative mt-2" ref={peerMenuRef}>
                <button
                  type="button"
                  onClick={() => setPeerOpen(o => !o)}
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
                    {PEER_GROUPS.map(g => (
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

        {/* Section B — AI Summary */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.04 }}>
          <AISummaryCard
            text={`You're currently at the ${levelLabel(comp.currentLevel)} level for "${comp.name}", placing you in the ${displayPercentile}th percentile among ${peerGroup.toLowerCase()}. Your role target is ${roleTarget}/3. Closing the gap of ${gap.toFixed(2)} levels would meaningfully strengthen your impact in this area. Start your recommended courses to begin building next-level behaviors.`}
            ctaLabel="Start your recommended courses"
            ctaHref={createPageUrl('IndividualDashboard?tab=plan')}
            context={{
              competency: comp.name,
              domain: domain?.name || 'Healthcare Quality',
              currentLevel: comp.score ?? comp.currentLevel,
              percentile: displayPercentile,
              roleTarget,
              gap,
              peerGroup,
              currentBehaviors: comp.behaviors?.current || [],
              nextBehaviors: comp.behaviors?.next || [],
            }}
          />
        </motion.div>

        <hr className="border-gray-200" />

        {/* Section C — Behavior Ladder */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.06 }}>
          <section aria-labelledby="behavior-ladder-heading" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 id="behavior-ladder-heading" className="text-sm font-bold text-[#3D3D3D] uppercase tracking-wide">
                What This Means in Practice
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">Behaviors at your current level vs. your next-level target.</p>
            </div>
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {/* Current level */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: currentLc.bg, color: currentLc.text }}
                  >
                    Currently Operating At: {levelLabel(comp.currentLevel)}
                  </span>
                </div>
                <ul aria-label={`Current behaviors at ${levelLabel(comp.currentLevel)} level`} className="space-y-2.5">
                  {comp.behaviors.current.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: currentLc.text }} />
                      <span className="text-sm text-gray-700">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next level */}
              <div className="p-6" style={{ backgroundColor: '#FAFAFA' }}>
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: nextLc.bg, color: nextLc.text }}
                  >
                    Growing Into: {levelLabel(domain?.roleTarget ?? comp.nextLevel)}
                  </span>
                </div>
                <ul aria-label={`Target behaviors at ${levelLabel(domain?.roleTarget ?? comp.nextLevel)} level`} className="space-y-2.5">
                  {comp.behaviors.next.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ArrowRight aria-hidden="true" className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#00A3E0]" />
                      <span className="text-sm text-gray-700 font-medium">{b}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-gray-600 mt-4 border-t border-gray-200 pt-3">
                  This plan targets the behaviors needed for your next level.
                </p>
              </div>
            </div>
          </section>
        </motion.div>

        {/* Section D — Course Recommendations */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.08 }}>
          <section aria-labelledby="courses-heading" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 id="courses-heading" className="text-sm font-bold text-[#3D3D3D] uppercase tracking-wide">Recommended Courses</h2>
              <p className="text-xs text-gray-600 mt-0.5">Selected automatically based on your gap and next-level behaviors.</p>
            </div>
            <div className="divide-y divide-gray-200 px-6">
              {(matchingCourses.length ? matchingCourses : COURSE_CATALOG.slice(0, 3)).map((course, i) => {
                const fmtStyle = FORMAT_COLORS[course.format] || { bg: '#F3F4F6', text: '#6B7280' };
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.05 }}
                    className="py-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: fmtStyle.bg, color: fmtStyle.text }}>
                            {course.format}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-gray-600">
                            <Clock aria-hidden="true" className="w-3 h-3" />
                            <span>{course.hours}h</span>
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-[#3D3D3D]">{course.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{course.behaviors?.[0] || ''}</p>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                          type="button"
                          aria-label={`Go to course: ${course.title}`}
                          className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-white bg-[#00A3E0] hover:bg-[#0087bd] rounded-lg px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-2"
                        >
                          <ExternalLink aria-hidden="true" className="w-3 h-3" />
                          Go to Course
                        </button>
                        <button
                          type="button"
                          onClick={() => setDetailCourse(course)}
                          aria-label={`View details for: ${course.title}`}
                          className="text-[11px] font-semibold text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-2"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </motion.div>

      </main>

      <CourseDetailModal course={detailCourse} onClose={() => setDetailCourse(null)} />
      <DomainCompetencyPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        type={panelType}
        name={panelName}
      />
      <AIChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        context={{
          competency: comp.name,
          domain: domain?.name || 'Healthcare Quality',
          currentLevel: comp.score ?? comp.currentLevel,
          percentile: displayPercentile,
          roleTarget,
          gap,
          peerGroup,
          currentBehaviors: comp.behaviors?.current || [],
          nextBehaviors: comp.behaviors?.next || [],
        }}
      />
    </div>
  );
}