import React, { useState, useId } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  PlayCircle, Clock, CheckCircle2, ChevronUp, ChevronDown,
  Target, BarChart3, BookOpen, RotateCcw, Info, Download
} from 'lucide-react';
import { downloadRoadmapPDF } from '@/lib/downloadRoadmapPDF';
import Header from '@/components/shared/Header';
import KPITile from '@/components/individual/KPITile';
import AISummaryCard from '@/components/individual/AISummaryCard';
import {
  getPrioritizedCompetencies, generatePlan, COURSE_CATALOG
} from '@/components/individual/individualMockData';
import { MOCK_STATUSES } from '@/components/individual/upskillPlanData';

const prioritized = getPrioritizedCompetencies();
const { courses: RAW_COURSES, totalHours } = generatePlan(prioritized, COURSE_CATALOG, 18);
const PLAN_COURSES = RAW_COURSES.map(c => ({
  ...c,
  status: MOCK_STATUSES[c.id] ?? c.status,
}));

const STATUS_SECTIONS = [
  { key: 'complete',    label: 'Completed',     dot: '#10B981' },
  { key: 'in_progress', label: 'In Progress',   dot: '#3B82F6' },
  { key: 'not_started', label: 'Next to Start', dot: '#9CA3AF' },
];

const FORMAT_COLORS = {
  'On-demand': { bg: '#EFF6FF', text: '#1D4ED8' },
  'Webinar':   { bg: '#F0FDF4', text: '#15803D' },
  'Guided':    { bg: '#FDF4FF', text: '#7E22CE' },
};

// Accessible tooltip (hover + keyboard focus)
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
          className="absolute right-0 top-6 z-30 w-52 bg-gray-900 text-white text-[11px] leading-relaxed rounded-lg px-3 py-2 shadow-lg pointer-events-none"
        >
          {text}
        </div>
      )}
    </div>
  );
}

function CourseCard({ course, accentColor }) {
  const fmtStyle = FORMAT_COLORS[course.format] || { bg: '#F3F4F6', text: '#6B7280' };
  const isInProgress = course.status === 'in_progress';
  const isComplete   = course.status === 'complete';
  const subtitle = (course.priorityReasons || []).join(' · ');

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col gap-4">
      {/* Format badge */}
      <div>
        <span
          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
          style={{ backgroundColor: fmtStyle.bg, color: fmtStyle.text }}
        >
          {course.format}
        </span>
      </div>

      {/* Title + subtitle */}
      <div className="border-l-2 pl-3" style={{ borderColor: accentColor }}>
        <p className="text-sm font-bold text-[#1A1A2E] leading-snug">{course.title}</p>
        {subtitle && (
          <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">{subtitle}</p>
        )}
      </div>

      {/* Bottom row: hours + skill + action button */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <div>
          <div className="flex items-center gap-1 text-[11px] text-gray-600">
            <Clock aria-hidden="true" className="w-3 h-3" />
            <span>{course.hours}h</span>
          </div>
          {course.competencyName && (
            <p className="text-[10px] text-gray-600 mt-0.5 leading-snug">{course.competencyName}</p>
          )}
        </div>

        {isComplete ? (
          <button
            type="button"
            aria-label={`${course.title} — Completed`}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-white bg-[#10B981] hover:bg-[#059669] rounded-full px-4 py-2 transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:ring-offset-2"
          >
            <CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5" /> Completed
          </button>
        ) : isInProgress ? (
          <button
            type="button"
            aria-label={`Continue: ${course.title}`}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-white bg-[#00A3E0] hover:bg-[#007DB0] rounded-full px-4 py-2 transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-2"
          >
            <RotateCcw aria-hidden="true" className="w-3.5 h-3.5" /> Continue
          </button>
        ) : (
          <button
            type="button"
            aria-label={`Start: ${course.title}`}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-white bg-[#1A1A2E] hover:bg-[#2d2d4e] rounded-full px-4 py-2 transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A2E] focus-visible:ring-offset-2"
          >
            <PlayCircle aria-hidden="true" className="w-3.5 h-3.5" /> Start
          </button>
        )}
      </div>
    </div>
  );
}

function PhaseSection({ label, dot, courses }) {
  const [collapsed, setCollapsed] = useState(false);
  const panelId = `phase-panel-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div>
      <button
        type="button"
        onClick={() => setCollapsed(c => !c)}
        aria-expanded={!collapsed}
        aria-controls={panelId}
        className="w-full flex items-center gap-3 py-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-1 rounded"
      >
        <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
        <span className="text-xs font-bold text-[#3D3D3D] uppercase tracking-wide">{label}</span>
        <span className="text-[11px] text-gray-600">
          {courses.length} {courses.length === 1 ? 'course' : 'courses'}
        </span>
        <div aria-hidden="true" className="flex-1 h-px bg-gray-200 mx-2" />
        {collapsed
          ? <ChevronDown aria-hidden="true" className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
          : <ChevronUp   aria-hidden="true" className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        }
      </button>

      <div id={panelId} hidden={collapsed}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} accentColor={dot} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function IndividualUpskillPlan() {
  const [downloading, setDownloading] = useState(false);
  const completedCount = PLAN_COURSES.filter(c => c.status === 'complete').length;
  const completedPct   = Math.round((completedCount / PLAN_COURSES.length) * 100) || 0;
  const completedHours = PLAN_COURSES.filter(c => c.status === 'complete').reduce((s, c) => s + c.hours, 0);
  const coveredComps   = new Set(PLAN_COURSES.map(c => c.competencySlug)).size;
  const focusArea      = prioritized[0]?.name || '—';

  const byPhase = STATUS_SECTIONS.map(({ key, label, dot }) => ({
    key, label, dot,
    courses: PLAN_COURSES.filter(c => (c.status ?? 'not_started') === key),
  })).filter(s => s.courses.length > 0);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    await downloadRoadmapPDF({
      userName: 'Sarah Mitchell',
      role: 'Quality Improvement Specialist',
      org: 'Regional Medical Center',
      assessmentDate: 'January 15, 2026',
      kpis: [
        { label: 'Completed', value: `${completedPct}%`, sub: `${completedCount} of ${PLAN_COURSES.length} courses` },
        { label: 'Hours Done', value: `${completedHours}h`, sub: `of ${totalHours.toFixed(0)}h total` },
        { label: 'Competencies', value: coveredComps, sub: 'Covered in plan' },
        { label: 'Focus Area', value: '—', sub: focusArea },
      ],
      sections: byPhase.map(s => ({
        label: s.label,
        courses: s.courses,
        accentRgb: s.dot === '#10B981' ? [16, 185, 129] : s.dot === '#3B82F6' ? [59, 130, 246] : [156, 163, 175],
      })),
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

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
            <Link
              to={createPageUrl('IndividualDashboard')}
              className="hover:text-[#00A3E0] transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-1 rounded"
            >
              Dashboard
            </Link>
            <span aria-hidden="true" className="text-gray-400">›</span>
            <span aria-current="page" className="text-[#3D3D3D] font-semibold">Upskill Plan</span>
          </nav>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#3D3D3D]">Your Upskill Plan</h1>
              <p className="text-sm text-gray-600 mt-1">Generated from your results · built to create momentum</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Live region announces PDF generation status */}
              <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                {downloading ? 'Generating PDF, please wait.' : ''}
              </div>
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={downloading}
                aria-busy={downloading}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#00A3E0] border border-[#00A3E0] rounded-lg px-4 py-2 transition-colors hover:bg-[#EBF8FF] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-2"
              >
                {downloading
                  ? <><Clock aria-hidden="true" className="w-3.5 h-3.5 animate-spin" /> Generating…</>
                  : <><Download aria-hidden="true" className="w-3.5 h-3.5" /> Download Roadmap PDF</>}
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#00A3E0] hover:bg-[#007DB0] rounded-lg px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-2"
              >
                <PlayCircle aria-hidden="true" className="w-3.5 h-3.5" /> Start Next Course
              </button>
            </div>
          </div>
        </div>
      </div>

      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* KPI Tiles */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPITile
              icon={BarChart3} label="Courses Completed" value={`${completedPct}%`}
              sub={`${completedCount} of ${PLAN_COURSES.length} courses done`}
              color="#059669"
              tooltip="The percentage of courses in your personalized plan that you have marked as complete."
            />
            <KPITile
              icon={Clock} label="Hours Completed" value={`${completedHours}h`}
              sub={`of ${totalHours.toFixed(0)}h total plan`}
              color="#1E5BB8"
              tooltip="Total learning hours accumulated from completed courses out of your full plan's estimated hours."
            />
            <KPITile
              icon={BookOpen} label="Competencies Covered" value={coveredComps}
              sub="Unique competencies in your plan"
              color="#6B4C9A"
              tooltip="The number of distinct competencies addressed by the courses in your upskill plan."
            />

            {/* Current Focus tile — accessible tooltip inline */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-5">
              <div className="flex items-center gap-2 mb-3">
                <div aria-hidden="true" className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E67E2215' }}>
                  <Target aria-hidden="true" className="w-4 h-4" style={{ color: '#E67E22' }} />
                </div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold leading-tight">Current Focus</p>
                <div className="ml-auto">
                  <InfoTooltip text="Your highest-priority competency based on your assessment gap and role target — the area where focused development will have the greatest impact." />
                </div>
              </div>
              <p className="text-sm font-bold text-[#3D3D3D] leading-snug">{focusArea}</p>
              <p className="text-[11px] text-gray-600 mt-1">Top priority competency</p>
            </div>
          </div>
        </motion.div>

        {/* AI Summary */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.04 }}>
          <AISummaryCard
            text={`You have ${PLAN_COURSES.length} courses ready to go — totaling ~${totalHours.toFixed(0)} hours of focused development across ${coveredComps} competencies. Your plan prioritizes your highest-gap areas first, so even completing the first 2–3 courses will create real, measurable progress.`}
            ctaLabel="Start your first course now"
            ctaHref="#plan-board"
          />
        </motion.div>

        {/* Plan Board */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.07 }}>
          <section id="plan-board" aria-labelledby="plan-board-heading">
            <h2 id="plan-board-heading" className="sr-only">Your course plan</h2>
            <div className="space-y-6">
              {byPhase.map(({ key, label, dot, courses }) => (
                <PhaseSection key={key} label={label} dot={dot} courses={courses} />
              ))}
            </div>
          </section>
        </motion.div>

      </main>
    </div>
  );
}