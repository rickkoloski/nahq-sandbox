import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Target, TrendingUp, CheckCircle2,
  Download, Users, Award, ChevronDown, Clock, Star,
  PlayCircle, Loader2, BarChart3, BookOpen, Info } from 'lucide-react';
import Header from '@/components/shared/Header';
import Breadcrumb from '@/components/shared/Breadcrumb';
import FloatingChatButton from '@/components/shared/FloatingChatButton';
import AIChatModal from '@/components/shared/AIChatModal';
import AISummaryCard from '@/components/individual/AISummaryCard';
import BellCurveChart from '@/components/individual/BellCurveChart';
import DomainCompetencyPanel from '@/components/executive/DomainCompetencyPanel';
import DomainBreakdownCard from '@/components/individual/DomainBreakdownCard';
import UpskillPlanSidebar from '@/components/individual/UpskillPlanSidebar';
import {
  DOMAINS, COMPETENCIES, levelLabel, levelColor } from '@/components/individual/individualMockData';
import { PLAN_COURSES, PLAN_TOTAL_HOURS, MOCK_STATUSES } from '@/components/individual/upskillPlanData';
import { downloadRoadmapPDF } from '@/lib/downloadRoadmapPDF';

const INDIVIDUAL_USER = {
  name: 'Sarah Mitchell',
  role: 'Quality Improvement Specialist',
  jobLevel: 'Specialist / Analyst',
  org: 'Regional Medical Center',
  assessmentDate: 'January 15, 2026',
  peerGroup: 'Similar Job Level'
};

const ASSESSMENTS = [
  { label: 'Baseline 2026', date: 'Jan 15, 2026' },
  { label: 'Mid-Year 2025', date: 'Jul 1, 2025' },
  { label: 'Baseline 2025', date: 'Jan 15, 2025' },
];

const PEER_GROUPS = ['All Respondents', 'Similar Job Level', 'Similar Setting'];
const PEER_MEANS = {
  'All Respondents':  { mean: 1.65, std: 0.44 },
  'Similar Job Level':{ mean: 1.75, std: 0.42 },
  'Similar Setting':  { mean: 1.70, std: 0.43 }
};

// Accessible tooltip that works on both hover and focus
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

export default function IndividualDashboard() {
  const [peerGroup, setPeerGroup] = useState('Similar Job Level');
  const [peerOpen, setPeerOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelType, setPanelType] = useState(null);
  const [panelName, setPanelName] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(ASSESSMENTS[0]);
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const peerMenuRef = useRef(null);
  const assessmentMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (peerMenuRef.current && !peerMenuRef.current.contains(e.target)) setPeerOpen(false);
      if (assessmentMenuRef.current && !assessmentMenuRef.current.contains(e.target)) setAssessmentOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Calculate KPI metrics from mock data
  const domainScores = DOMAINS.map((d) => {
    const domainComps = COMPETENCIES.filter((c) => c.domainSlug === d.slug);
    const avg = domainComps.length ?
      domainComps.reduce((s, c) => s + (c.score ?? c.currentLevel), 0) / domainComps.length : 0;
    return { ...d, avg, target: d.roleTarget ?? 2, comps: domainComps };
  });

  const avgScore = parseFloat(
    (domainScores.reduce((s, d) => s + d.avg, 0) / domainScores.length).toFixed(2)
  );

  const growthPriorities = COMPETENCIES.filter((c) => {
    const dom = DOMAINS.find((d) => d.slug === c.domainSlug);
    const target = dom?.roleTarget ?? 2;
    return (c.score ?? c.currentLevel) < target;
  }).length;

  const avgGap = parseFloat(
    (COMPETENCIES.reduce((s, c) => {
      const dom = DOMAINS.find((d) => d.slug === c.domainSlug);
      const target = dom?.roleTarget ?? 2;
      return s + Math.max(0, target - (c.score ?? c.currentLevel));
    }, 0) / COMPETENCIES.length).toFixed(2)
  );

  const handleDownloadPDF = async () => {
    setDownloading(true);
    const coursesWithStatus = PLAN_COURSES.map(c => ({
      ...c,
      status: MOCK_STATUSES[c.id] ?? c.status,
    }));
    await downloadRoadmapPDF({
      userName: INDIVIDUAL_USER.name,
      role: INDIVIDUAL_USER.role,
      org: INDIVIDUAL_USER.org,
      assessmentDate: INDIVIDUAL_USER.assessmentDate,
      kpis: [
        { label: 'Overall Score', value: `${avgScore}/3.0` },
        { label: 'Growth Priorities', value: growthPriorities, sub: 'Below NAHQ Standard' },
        { label: 'Avg Gap', value: avgGap, sub: 'Points to target' },
        { label: 'Benchmark', value: PEER_MEANS[peerGroup].mean.toFixed(2), sub: peerGroup },
      ],
      sections: [
        { label: 'Completed', courses: coursesWithStatus.filter(c => c.status === 'complete'), accentRgb: [16, 185, 129] },
        { label: 'In Progress', courses: coursesWithStatus.filter(c => c.status === 'in_progress'), accentRgb: [59, 130, 246] },
        { label: 'Next to Start', courses: coursesWithStatus.filter(c => (c.status ?? 'not_started') === 'not_started'), accentRgb: [156, 163, 175] },
      ],
    });
    setDownloading(false);
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'My Dashboard' }]} />
          <div className="flex items-start justify-between gap-4 mt-1">
            <div>
              <h1 className="text-xl font-bold text-[#3D3D3D]">Your Professional Assessment Overview</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-gray-600">
                  Showing workforce insights for <span className="font-semibold text-[#3D3D3D]">{selectedAssessment.label}</span>
                </span>
                <span aria-hidden="true" className="text-gray-300 text-xs">·</span>
                <span className="text-xs text-gray-600">
                  Measured against <span className="font-semibold text-[#3D3D3D]">NAHQ Competency Framework v2</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Assessment switcher */}
              <div className="relative" ref={assessmentMenuRef}>
                <button
                  type="button"
                  onClick={() => setAssessmentOpen(o => !o)}
                  aria-haspopup="listbox"
                  aria-expanded={assessmentOpen}
                  aria-label={`Selected assessment: ${selectedAssessment.label}. Click to change.`}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#3D3D3D] border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-1"
                >
                  {selectedAssessment.date}
                  <ChevronDown aria-hidden="true" className="w-3.5 h-3.5 text-gray-400" />
                </button>
                {assessmentOpen && (
                  <ul
                    role="listbox"
                    aria-label="Select assessment"
                    className="absolute right-0 top-full mt-1 z-30 bg-white border border-gray-200 rounded-xl shadow-lg w-52 py-1"
                  >
                    {ASSESSMENTS.map(a => (
                      <li key={a.label} role="option" aria-selected={a.label === selectedAssessment.label}>
                        <button
                          type="button"
                          onClick={() => { setSelectedAssessment(a); setAssessmentOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:bg-gray-50 ${a.label === selectedAssessment.label ? 'text-[#00A3E0] font-semibold' : 'text-gray-700'}`}
                        >
                          <p className="text-xs font-semibold">{a.date}</p>
                          <p className="text-[10px] text-gray-600 mt-0.5">{a.label}</p>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Download button */}
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={downloading}
                aria-disabled={downloading}
                aria-label={downloading ? 'Generating PDF, please wait' : 'Download PDF report'}
                className="flex items-center gap-2 text-xs font-semibold text-[#00A3E0] border border-[#00A3E0] rounded-lg px-3 py-1.5 hover:bg-[#EBF8FF] transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-1"
              >
                {downloading
                  ? <Loader2 aria-hidden="true" className="w-3.5 h-3.5 animate-spin" />
                  : <Download aria-hidden="true" className="w-3.5 h-3.5" />}
                <span>{downloading ? 'Generating…' : 'Download PDF'}</span>
              </button>
              {/* Live region for download status */}
              <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                {downloading ? 'Generating PDF report, please wait.' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Two-column layout */}
        <div className="flex gap-6 items-start">

          {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Welcome Banner */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <div
                className="rounded-xl px-7 py-6 flex items-center justify-between overflow-hidden relative"
                style={{ background: 'linear-gradient(135deg, #009FE8 0%, #414042 100%)' }}
              >
                {/* Decorative circles — hidden from AT */}
                <div aria-hidden="true" className="absolute right-24 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-2 border-white/10 opacity-40" />
                <div aria-hidden="true" className="absolute right-12 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-2 border-white/10 opacity-30" />

                <div className="relative z-10 max-w-lg">
                  <h2 className="text-lg font-bold text-white mb-1.5">
                    Welcome to Your Results, {INDIVIDUAL_USER.name.split(' ')[0]}!
                  </h2>
                  <p className="text-sm text-white/90 leading-relaxed">
                    Your personalized assessment provides insights into your competencies across key quality improvement domains. Explore how you compare to national benchmarks and discover targeted learning opportunities to advance your professional growth.
                  </p>
                </div>

                <div aria-hidden="true" className="relative z-10 flex-shrink-0 ml-6">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* KPI Cards */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.04 }}>
              <div className="grid grid-cols-3 gap-4">

                {/* Overall Score */}
                <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 shadow-sm relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div aria-hidden="true" className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#2D2D7F18' }}>
                      <Award aria-hidden="true" className="w-4 h-4" style={{ color: '#2D2D7F' }} />
                    </div>
                    <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold leading-tight">Your Overall Results</p>
                    <div className="ml-auto">
                      <InfoTooltip text="Your average result across all competencies (0–3 scale)." />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <p className="text-2xl font-bold text-[#3D3D3D] leading-none">
                      {avgScore}<span className="text-sm text-gray-500 font-normal"> / 3.0</span>
                    </p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={levelColor(Math.round(avgScore))}>
                      {levelLabel(Math.round(avgScore))}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-snug">Your overall results across all domains</p>
                </div>

                {/* Growth Priorities */}
                <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 shadow-sm relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div aria-hidden="true" className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F59E0B18' }}>
                      <TrendingUp aria-hidden="true" className="w-4 h-4" style={{ color: '#F59E0B' }} />
                    </div>
                    <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold leading-tight">Growth Priorities</p>
                    <div className="ml-auto">
                      <InfoTooltip text="Number of competencies where your current level is below the NAHQ expected level for your role." />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <p className="text-2xl font-bold text-[#3D3D3D] leading-none">{growthPriorities}</p>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-snug">Competencies below NAHQ Standard</p>
                </div>

                {/* National Benchmark */}
                <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 shadow-sm relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div aria-hidden="true" className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#6B4C9A18' }}>
                      <Users aria-hidden="true" className="w-4 h-4" style={{ color: '#6B4C9A' }} />
                    </div>
                    <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold leading-tight">National Benchmark</p>
                    <div className="ml-auto">
                      <InfoTooltip text="Average overall result of professionals with a similar job level in the national NAHQ dataset." />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <p className="text-2xl font-bold text-[#3D3D3D] leading-none">
                      {PEER_MEANS[peerGroup].mean.toFixed(2)}<span className="text-sm text-gray-500 font-normal"> / 3.0</span>
                    </p>
                  </div>
                  <p className="text-[11px] text-gray-600 mb-2">Compared to {peerGroup.toLowerCase()}</p>
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

            {/* National Benchmark Comparison */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.06 }}>
              <section aria-labelledby="benchmark-heading" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 id="benchmark-heading" className="text-sm font-bold text-[#00A3E0] uppercase tracking-wide">
                      National Benchmark Comparison
                    </h2>
                    <InfoTooltip text="This benchmark represents the typical level of work observed across NAHQ's national dataset." />
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">Assessment completed {INDIVIDUAL_USER.assessmentDate}</p>
                </div>
                <div className="p-6">
                  <BellCurveChart
                    userScore={avgScore}
                    mean={PEER_MEANS[peerGroup].mean}
                    std={PEER_MEANS[peerGroup].std}
                    peerLabel={peerGroup}
                  />
                </div>
              </section>
            </motion.div>

            {/* AI Summary */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.08 }}>
              <AISummaryCard
                text={`You're currently scoring ${avgScore}/3.0 across all competency domains, placing you among healthcare quality professionals. You have ${growthPriorities} competencies below the NAHQ Standard target. Focus on your highest-gap areas to accelerate your professional growth.`}
                context={{ avgScore, growthPriorities, avgGap, peerGroup }}
              />
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN ─────────────────────────────────────────── */}
          <aside aria-label="Your Personalized Upskill Plan" className="w-80 flex-shrink-0">
            <UpskillPlanSidebar />
          </aside>
        </div>

        {/* Domain Breakdown */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.1 }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-[#3D3D3D] uppercase tracking-wide">Explore Your Domains</h2>
              <p className="text-xs text-gray-600 mt-0.5">Click any domain to explore competencies</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {domainScores.map((domain) => (
              <DomainBreakdownCard
                key={domain.slug}
                domain={{ ...domain, avgLevel: domain.avg, roleTarget: domain.target }}
              />
            ))}
          </div>
        </motion.div>
      </main>

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
          avgScore,
          growthPriorities,
          avgGap,
          peerGroup,
          totalCourses: PLAN_COURSES.length,
          totalHours: PLAN_TOTAL_HOURS
        }}
      />
    </div>
  );
}