import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { createPageUrl } from '@/utils';
import {
  PLAN_COURSES,
  MOCK_STATUSES,
  DOMAINS,
  COMPETENCIES,
} from './upskillPlanData';

// Domain tag colors — ensure 4.5:1 contrast on white background
const DOMAIN_TAG = {
  'patient-safety':           { label: 'Patient Safety',       color: '#C85A00' },
  'quality-leadership':       { label: 'Quality Leadership',   color: '#2D2D7F' },
  'performance-improvement':  { label: 'Performance Improv.',  color: '#006B7A' },
  'health-data-analytics':    { label: 'Health Data',          color: '#7A5C2E' },
  'regulatory-accreditation': { label: 'Regulatory',           color: '#B01C1C' },
  'population-health':        { label: 'Population Health',    color: '#1A5C2A' },
  'healthcare-technology':    { label: 'Technology',           color: '#5B2D8E' },
  'professional-engagement':  { label: 'Prof. Engagement',     color: '#9C0070' },
};

function getDomainSlug(competencySlug) {
  const comp = COMPETENCIES.find(c => c.slug === competencySlug);
  return comp?.domainSlug || null;
}

export default function UpskillPlanSidebar() {
  const STATUS_ORDER = { in_progress: 0, not_started: 1, complete: 2 };
  const topCourses = PLAN_COURSES.slice(0, 6)
    .map(c => ({
      ...c,
      status: MOCK_STATUSES[c.id] || 'not_started',
      domainSlug: getDomainSlug(c.competencySlugs?.[0]),
    }))
    .sort((a, b) => (STATUS_ORDER[a.status] ?? 1) - (STATUS_ORDER[b.status] ?? 1))
    .slice(0, 4);

  return (
    <div
      className="rounded-xl flex flex-col"
      style={{
        background: 'white',
        border: '1px solid rgba(0, 163, 224, 0.35)',
        boxShadow: '0 0 24px rgba(0, 163, 224, 0.12), inset 0 0 20px rgba(0, 163, 224, 0.04)',
        borderRadius: '12px',
      }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-[#00A3E0]/15">
        <h2 className="text-sm font-bold text-[#3D3D3D]">Your Personalized Upskill Plan</h2>
        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
          This custom learning plan is designed to help you grow in areas where you'll have the greatest impact. These courses target your competency gaps and align with your professional development goals.
        </p>
      </div>

      {/* Course list */}
      <ul className="divide-y divide-gray-100 flex-1 list-none m-0 p-0">
        {topCourses.map((course) => {
          const tag = course.domainSlug ? DOMAIN_TAG[course.domainSlug] : null;
          const isInProgress = course.status === 'in_progress';
          const isComplete = course.status === 'complete';
          const btnLabel = isComplete ? 'Review' : isInProgress ? 'Continue' : 'Start';
          const statusLabel = isComplete ? 'Completed' : isInProgress ? 'In Progress' : 'Not Started';

          return (
            <li key={course.id} className="px-5 py-4">
              {/* Domain tag */}
              {tag && (
                <span
                  className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2"
                  style={{ color: tag.color, backgroundColor: tag.color + '18' }}
                >
                  {tag.label}
                </span>
              )}

              <div className="flex items-start justify-between gap-3">
                {/* Title + meta */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1A1A1A] leading-snug mb-1">{course.title}</p>
                  {course.priorityReasons && (
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      {course.priorityReasons.join(' · ')}
                    </p>
                  )}
                  <div className="flex items-center gap-1 text-[11px] text-gray-600 mt-1.5">
                    <Clock aria-hidden="true" className="w-3 h-3" />
                    <span>{course.hours} hours</span>
                  </div>
                </div>

                {/* CTA button */}
                <button
                  type="button"
                  aria-label={`${btnLabel} course: ${course.title} (${statusLabel})`}
                  className="flex items-center gap-1.5 text-xs font-bold text-white rounded-lg px-3 py-2 flex-shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                  style={{ backgroundColor: isComplete ? '#10B981' : isInProgress ? '#00A3E0' : '#1A1A1A' }}
                >
                  {isComplete
                    ? <><CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5" />{btnLabel}</>
                    : isInProgress
                    ? <><Loader2 aria-hidden="true" className="w-3.5 h-3.5" />{btnLabel}</>
                    : <>{btnLabel}<ArrowRight aria-hidden="true" className="w-3.5 h-3.5" /></>}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Footer CTA */}
      <div className="p-4">
        <Link
          to={createPageUrl('IndividualUpskillPlan')}
          className="block w-full text-center text-sm font-bold text-white bg-[#00A3E0] hover:bg-[#0082b3] rounded-xl py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-2"
        >
          Go To Your Upskill Plan
        </Link>
      </div>
    </div>
  );
}