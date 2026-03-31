/**
 * Ported from Tim's Base44 prototype: Individual Experience v03
 * Personalized upskill plan sidebar showing top recommended courses.
 * Adapted to use API course data instead of mock data.
 */
import { Clock, ArrowRight, CheckCircle2 } from 'lucide-react'

export interface UpskillCourse {
  id: number
  title: string
  hours: number
  status: 'not_started' | 'in_progress' | 'complete'
  domainName?: string
  relevanceLabel?: string
}

interface UpskillPlanSidebarProps {
  courses: UpskillCourse[]
  onViewPlan?: () => void
}

const DOMAIN_TAG: Record<string, { label: string; color: string }> = {
  'Quality Leadership and Integration':      { label: 'Quality Leadership',   color: '#003DA5' },
  'Patient Safety':                          { label: 'Patient Safety',       color: '#ED1C24' },
  'Performance and Process Improvement':     { label: 'Performance Improv.',  color: '#00B5E2' },
  'Health Data Analytics':                   { label: 'Health Data',          color: '#F68B1F' },
  'Regulatory and Accreditation':            { label: 'Regulatory',           color: '#6B4C9A' },
  'Population Health and Care Transitions':  { label: 'Population Health',    color: '#8BC53F' },
  'Healthcare Technology and Innovation':    { label: 'Technology',           color: '#5B2D8E' },
  'Professional Engagement':                 { label: 'Prof. Engagement',     color: '#00A3E0' },
  'Quality Review and Accountability':       { label: 'Quality Review',       color: '#99154B' },
}

export function UpskillPlanSidebar({ courses, onViewPlan }: UpskillPlanSidebarProps) {
  const STATUS_ORDER: Record<string, number> = { in_progress: 0, not_started: 1, complete: 2 }
  const sortedCourses = [...courses]
    .sort((a, b) => (STATUS_ORDER[a.status] ?? 1) - (STATUS_ORDER[b.status] ?? 1))
    .slice(0, 4)

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
          This custom learning plan targets your competency gaps and aligns with your professional development goals.
        </p>
      </div>

      {/* Course list */}
      <ul className="divide-y divide-gray-100 flex-1 list-none m-0 p-0">
        {sortedCourses.map((course) => {
          const tag = course.domainName ? DOMAIN_TAG[course.domainName] : null
          const isInProgress = course.status === 'in_progress'
          const isComplete = course.status === 'complete'
          const btnLabel = isComplete ? 'Review' : isInProgress ? 'Continue' : 'Start'
          const statusLabel = isComplete ? 'Completed' : isInProgress ? 'In Progress' : 'Not Started'

          return (
            <li key={course.id} className="px-5 py-4">
              {tag && (
                <span
                  className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2"
                  style={{ color: tag.color, backgroundColor: tag.color + '18' }}
                >
                  {tag.label}
                </span>
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1A1A1A] leading-snug mb-1">{course.title}</p>
                  {course.relevanceLabel && (
                    <p className="text-[11px] text-gray-600 leading-relaxed">{course.relevanceLabel}</p>
                  )}
                  <div className="flex items-center gap-1 text-[11px] text-gray-600 mt-1.5">
                    <Clock aria-hidden="true" className="w-3 h-3" />
                    <span>{course.hours} hours</span>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label={`${btnLabel} course: ${course.title} (${statusLabel})`}
                  className="flex items-center gap-1.5 text-xs font-bold text-white rounded-lg px-3 py-2 flex-shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                  style={{ backgroundColor: isComplete ? '#10B981' : isInProgress ? '#00A3E0' : '#1A1A1A' }}
                >
                  {isComplete
                    ? <><CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5" />{btnLabel}</>
                    : <>{btnLabel}<ArrowRight aria-hidden="true" className="w-3.5 h-3.5" /></>}
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      {/* Footer CTA */}
      {onViewPlan && (
        <div className="p-4">
          <button
            onClick={onViewPlan}
            className="block w-full text-center text-sm font-bold text-white bg-[#00A3E0] hover:bg-[#0082b3] rounded-xl py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-2"
          >
            Go To Your Upskill Plan
          </button>
        </div>
      )}
    </div>
  )
}
