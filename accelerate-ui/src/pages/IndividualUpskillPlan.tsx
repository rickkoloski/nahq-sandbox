/**
 * Ported from Tim's Base44 prototype: Individual Experience v03 / IndividualUpskillPlan
 *
 * Personalized upskill plan page showing recommended courses grouped by status.
 * Data sourced from API gap analysis and course similarity endpoints.
 * Score scale: 0-3 (NAHQ official). Uses "National Average" terminology.
 */
import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PlayCircle, Clock, CheckCircle2, ChevronUp, ChevronDown, Target, BarChart3, BookOpen, RotateCcw } from 'lucide-react'
import { api } from '../api/client'
import { useAuth } from '../api/auth'
import { Header } from '../components/Header'
import { AiInsightsModal } from '../components/AiInsightsModal'
import { KPITile } from '../components/individual/KPITile'
import type { GapAnalysis, CourseSimilarity } from '../types/api'

/* ─── Course card data shape ─── */
interface CourseCardData {
  id: number
  title: string
  description: string
  hours: number
  format: string
  competencyName?: string
  status: 'not_started' | 'in_progress' | 'complete'
  relevanceScore: number
  ceEligible: boolean
}

/* ─── Status sections ─── */
const STATUS_SECTIONS = [
  { key: 'complete' as const, label: 'Completed', dot: '#10B981' },
  { key: 'in_progress' as const, label: 'In Progress', dot: '#3B82F6' },
  { key: 'not_started' as const, label: 'Next to Start', dot: '#9CA3AF' },
]

/* ─── Format badge colors ─── */
const FORMAT_COLORS: Record<string, { bg: string; text: string }> = {
  'On-demand': { bg: '#EFF6FF', text: '#1D4ED8' },
  'Webinar': { bg: '#F0FDF4', text: '#15803D' },
  'Guided': { bg: '#FDF4FF', text: '#7E22CE' },
}

/* ─── CourseCard ─── */
function CourseCard({ course, dotColor }: { course: CourseCardData; dotColor: string }) {
  const fmt = FORMAT_COLORS[course.format] ?? { bg: '#F3F4F6', text: '#374151' }
  const isComplete = course.status === 'complete'
  const isInProgress = course.status === 'in_progress'
  const btnLabel = isComplete ? 'Completed' : isInProgress ? 'Continue' : 'Start'
  const btnIcon = isComplete
    ? <CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5" />
    : isInProgress
      ? <RotateCcw aria-hidden="true" className="w-3.5 h-3.5" />
      : <PlayCircle aria-hidden="true" className="w-3.5 h-3.5" />

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Left accent border */}
      <div className="flex">
        <div className="w-1 flex-shrink-0" style={{ backgroundColor: dotColor }} />
        <div className="flex-1 px-5 py-4">
          {/* Top row: format badge + relevance */}
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide"
              style={{ backgroundColor: fmt.bg, color: fmt.text }}
            >
              {course.format}
            </span>
            <span className="text-[11px] font-semibold text-gray-500">
              {Math.round(course.relevanceScore * 100)}% match
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-[#1A1A1A] leading-snug mb-1">{course.title}</h3>

          {/* Description */}
          <p className="text-[12px] text-gray-600 leading-relaxed line-clamp-2 mb-3">{course.description}</p>

          {/* Meta row */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1 text-[11px] text-gray-500">
              <Clock aria-hidden="true" className="w-3 h-3" />
              <span>{course.hours} hrs</span>
            </div>
            {course.ceEligible && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                CE Eligible
              </span>
            )}
            {course.competencyName && (
              <span className="text-[10px] text-gray-400 truncate">{course.competencyName}</span>
            )}
          </div>

          {/* Action button */}
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs font-bold text-white rounded-lg px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              backgroundColor: isComplete ? '#10B981' : isInProgress ? '#00A3E0' : '#1A1A1A',
            }}
          >
            {btnIcon}
            {btnLabel}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── PhaseSection ─── */
function PhaseSection({ label, dot, courses }: { label: string; dot: string; courses: CourseCardData[] }) {
  const [collapsed, setCollapsed] = useState(false)

  if (courses.length === 0) return null

  return (
    <div className="mb-8">
      {/* Section header */}
      <button
        type="button"
        onClick={() => setCollapsed(c => !c)}
        className="w-full flex items-center gap-3 mb-4 group focus-visible:outline-none"
      >
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
        <h2 className="text-sm font-bold text-[#3D3D3D]">{label}</h2>
        <span className="text-xs text-gray-400 font-medium">({courses.length})</span>
        <div className="flex-1 h-px bg-gray-200" />
        {collapsed
          ? <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          : <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />}
      </button>

      {/* Course grid */}
      {!collapsed && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} dotColor={dot} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Page ─── */
export function IndividualUpskillPlan() {
  const [params] = useSearchParams()
  const { user } = useAuth()
  const userId = Number(params.get('userId') || user?.userId || 2)

  const [gaps, setGaps] = useState<GapAnalysis | null>(null)
  const [courseSimilarity, setCourseSimilarity] = useState<CourseSimilarity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.userGaps(userId),
      api.userCourses(userId, 5),
    ]).then(([g, c]) => {
      setGaps(g); setCourseSimilarity(c); setLoading(false)
    }).catch(() => setLoading(false))
  }, [userId])

  /* Map API data to course cards */
  const courses: CourseCardData[] = (courseSimilarity?.courses ?? []).map(c => ({
    id: c.courseId,
    title: c.title,
    description: c.description,
    hours: c.durationHours,
    format: c.matchType === 'semantic' ? 'On-demand' : c.matchType === 'domain' ? 'Guided' : 'Webinar',
    competencyName: courseSimilarity?.competencyName || undefined,
    status: 'not_started' as const,
    relevanceScore: c.relevanceScore,
    ceEligible: c.ceEligible,
  }))

  /* KPI values */
  const totalHours = courses.reduce((s, c) => s + c.hours, 0)
  const gapsBelow = gaps?.gaps.filter(g => g.gap > 0).length ?? 0
  const topGapName = gaps?.gaps[0]?.competencyName ?? 'N/A'

  /* AI Insights actions */
  const aiActions = [
    {
      label: 'Upskill Plan Summary',
      description: 'AI-generated summary of your personalized learning plan',
      onGenerate: () => api.aiUpskillPlan(userId),
    },
    {
      label: 'Gap Analysis Insights',
      description: 'AI analysis of your competency gaps and recommendations',
      onGenerate: () => api.aiSummary(userId),
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header variant="accelerate" />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb + header */}
        <div className="mb-8">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <Link to="/" className="hover:text-gray-600 transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium">Upskill Plan</span>
          </nav>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">Your Upskill Plan</h1>
              <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                A personalized learning path based on your competency gaps. Courses are ranked by relevance to help you
                focus on the areas with the greatest impact on your professional development.
              </p>
            </div>
            <AiInsightsModal generations={aiActions} />
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A3E0]" />
          </div>
        )}

        {!loading && (
          <>
            {/* KPI Tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <KPITile
                icon={BookOpen}
                label="Courses in Plan"
                value={courses.length}
                sub={`${courses.filter(c => c.status === 'complete').length} completed`}
                color="#059669"
                tooltip="Total number of recommended courses in your personalized plan"
              />
              <KPITile
                icon={Clock}
                label="Total Hours"
                value={totalHours}
                sub="Estimated learning time"
                color="#1E5BB8"
                tooltip="Combined duration of all courses in your plan"
              />
              <KPITile
                icon={BarChart3}
                label="Competencies Covered"
                value={gapsBelow}
                sub="Below target level"
                color="#6B4C9A"
                tooltip="Number of competencies where your score is below the target for your role"
              />
              {/* Custom focus tile */}
              <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div aria-hidden="true" className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E67E2215' }}>
                    <Target aria-hidden="true" className="w-4 h-4" style={{ color: '#E67E22' }} />
                  </div>
                  <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold leading-tight">Current Focus</p>
                </div>
                <p className="text-base font-bold text-[#3D3D3D] leading-snug">{topGapName}</p>
                <p className="text-[11px] text-gray-600 mt-1 leading-snug">Top priority competency gap</p>
              </div>
            </div>

            {/* Phase sections */}
            {STATUS_SECTIONS.map(section => {
              const sectionCourses = courses.filter(c => c.status === section.key)
              return (
                <PhaseSection
                  key={section.key}
                  label={section.label}
                  dot={section.dot}
                  courses={sectionCourses}
                />
              )
            })}

            {/* Empty state */}
            {courses.length === 0 && (
              <div className="text-center py-20">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h2 className="text-lg font-bold text-[#3D3D3D] mb-2">No courses yet</h2>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Complete your competency assessment to receive personalized course recommendations based on your gap analysis.
                </p>
                <Link
                  to="/individual-dashboard"
                  className="inline-flex items-center gap-2 mt-6 text-sm font-bold text-white bg-[#00A3E0] hover:bg-[#0082b3] rounded-xl px-6 py-3 transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
