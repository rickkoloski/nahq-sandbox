/**
 * IndividualCompetencyDetail — deepest drill-down: Dashboard > Domain > Competency.
 *
 * Shows KPI tiles for the specific competency, a behavior expectations placeholder,
 * and recommended courses from the API.
 *
 * URL: /competency-detail?domain=Patient%20Safety&competency=Error%20Prevention%20and%20Mitigation
 */
import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Target, TrendingUp, Users, BarChart3, Clock, ExternalLink, Info } from 'lucide-react'
import { api } from '../api/client'
import { useAuth } from '../api/auth'
import { Header } from '../components/Header'
import { AiInsightsModal } from '../components/AiInsightsModal'
import { getDomainConfig, levelLabel, levelColor } from '../components/individual/domainConfig'
import type { GapAnalysis, BenchmarkComparison, CourseSimilarity } from '../types/api'

/* ── Helpers ── */

function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
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
  )
}

const FORMAT_COLORS: Record<string, { bg: string; text: string }> = {
  'On-demand': { bg: '#EFF6FF', text: '#1D4ED8' },
  'Webinar': { bg: '#F0FDF4', text: '#15803D' },
  'Guided': { bg: '#FDF4FF', text: '#7E22CE' },
}

/* ── Main Page ── */

export function IndividualCompetencyDetail() {
  const [params] = useSearchParams()
  const { user } = useAuth()
  const userId = Number(params.get('userId') || user?.userId || 2)
  const domainName = params.get('domain') || ''
  const competencyName = params.get('competency') || ''

  const [gaps, setGaps] = useState<GapAnalysis | null>(null)
  const [benchmarks, setBenchmarks] = useState<BenchmarkComparison | null>(null)
  const [courseSimilarity, setCourseSimilarity] = useState<CourseSimilarity | null>(null)
  const [previousGenerations, setPreviousGenerations] = useState<Record<string, Record<string, unknown>>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.userGaps(userId),
      api.userBenchmarks(userId),
      api.userCourses(userId),
      api.aiGenerations(userId).catch(() => []),
    ]).then(([g, b, c, gens]) => {
      setGaps(g)
      setBenchmarks(b)
      setCourseSimilarity(c)
      const genMap: Record<string, Record<string, unknown>> = {}
      for (const gen of gens) {
        genMap[gen.generationType as string] = {
          mode: 'live',
          response: gen.response,
          model: gen.model,
          inputTokens: gen.inputTokens,
          outputTokens: gen.outputTokens,
          latencyMs: gen.latencyMs,
        }
      }
      setPreviousGenerations(genMap)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [userId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB]">
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-12 text-center text-gray-500">
          Loading competency details...
        </div>
      </div>
    )
  }

  if (!gaps || !benchmarks) {
    return (
      <div className="min-h-screen bg-[#F8F9FB]">
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-12 text-center text-red-600">
          Failed to load assessment data.
        </div>
      </div>
    )
  }

  // Find matching competency gap and benchmark
  const competencyGap = gaps.gaps.find(g => g.competencyName === competencyName)
  const competencyBenchmark = benchmarks.competencies.find(c => c.competencyName === competencyName)

  const config = getDomainConfig(domainName)

  const score = competencyGap?.score ?? 0
  const target = competencyGap?.target ?? 2
  const gap = parseFloat(Math.max(0, target - score).toFixed(2))
  const nationalAvg = competencyBenchmark?.nationalMean ?? 0

  const scoreLc = levelColor(score)
  const targetLc = levelColor(target)

  // Gap severity styling
  const gapStyle = gap <= 0
    ? { color: '#059669', label: 'Target met' }
    : gap <= 1
      ? { color: '#D97706', label: `${gap.toFixed(2)} below target` }
      : { color: '#DC2626', label: `${gap.toFixed(2)} below target` }

  // Courses — up to 4
  const courses = (courseSimilarity?.courses ?? []).slice(0, 4).map(c => ({
    id: c.courseId,
    title: c.title,
    description: c.description,
    hours: c.durationHours,
    format: c.matchType === 'semantic' ? 'On-demand' : c.matchType === 'domain' ? 'Guided' : 'Webinar',
    ceEligible: c.ceEligible,
  }))

  // userId param passthrough for admin context
  const userParam = params.get('userId') ? `?userId=${params.get('userId')}` : ''
  const userParamAmp = params.get('userId') ? `&userId=${params.get('userId')}` : ''

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#00A3E0] focus:text-white focus:rounded-lg focus:font-semibold"
      >
        Skip to main content
      </a>

      <Header />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
            <Link
              to={`/individual-dashboard${userParam}`}
              className="hover:text-[#00A3E0] transition-colors"
            >
              My Dashboard
            </Link>
            <span aria-hidden="true">&gt;</span>
            <Link
              to={`/domain-detail?domain=${encodeURIComponent(domainName)}${userParamAmp}`}
              className="hover:text-[#00A3E0] transition-colors"
              style={{ color: config.color }}
            >
              {domainName}
            </Link>
            <span aria-hidden="true">&gt;</span>
            <span className="font-semibold text-[#3D3D3D]">
              {competencyName}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 mt-1">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Link
                  to={`/domain-detail?domain=${encodeURIComponent(domainName)}${userParamAmp}`}
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: `${config.color}18`,
                    color: config.color,
                  }}
                >
                  {domainName}
                </Link>
              </div>
              <h1 className="text-lg md:text-xl font-bold text-[#3D3D3D]">
                {competencyName}
              </h1>
              <p className="text-xs text-gray-600 mt-1">
                Competency detail &middot; score breakdown &middot; learning resources
              </p>
            </div>
            <AiInsightsModal
              generations={[
                {
                  label: 'Assessment Summary',
                  description:
                    'Personalized analysis of your competency scores, strengths, and growth areas',
                  onGenerate: () => api.aiSummary(userId),
                  initialResult:
                    previousGenerations['individual_summary'] || null,
                },
                {
                  label: 'Upskill Plan',
                  description:
                    'Custom learning plan targeting your highest-impact competency gaps',
                  onGenerate: () => api.aiUpskillPlan(userId),
                  initialResult:
                    previousGenerations['upskill_plan'] || null,
                },
              ]}
              onAsk={(prompt) => api.aiAsk(prompt, userId)}
            />
          </div>
        </div>
      </div>

      <main
        id="main-content"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
      >
        {/* KPI Tiles */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.04 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Your Results */}
            <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div
                  aria-hidden="true"
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${config.color}18` }}
                >
                  <BarChart3
                    aria-hidden="true"
                    className="w-4 h-4"
                    style={{ color: config.color }}
                  />
                </div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold leading-tight">
                  Your Results
                </p>
                <div className="ml-auto">
                  <InfoTooltip text="Your self-assessed score for this competency on the 0-3 scale." />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-2xl font-bold text-[#3D3D3D] leading-none">
                  {score.toFixed(2)}
                  <span className="text-sm text-gray-500 font-normal"> / 3</span>
                </p>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: scoreLc.bg, color: scoreLc.text }}
                >
                  {levelLabel(score)}
                </span>
              </div>
              <p className="text-[11px] text-gray-600 leading-snug">
                Your assessed level for this competency
              </p>
            </div>

            {/* NAHQ Standard Role Target */}
            <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div
                  aria-hidden="true"
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#00A3E018' }}
                >
                  <Target
                    aria-hidden="true"
                    className="w-4 h-4"
                    style={{ color: '#00A3E0' }}
                  />
                </div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold leading-tight">
                  NAHQ Standard Role Target
                </p>
                <div className="ml-auto">
                  <InfoTooltip text="The expected competency level for your role as defined by the NAHQ framework." />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-2xl font-bold text-[#3D3D3D] leading-none">
                  {target.toFixed(2)}
                  <span className="text-sm text-gray-500 font-normal"> / 3</span>
                </p>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: targetLc.bg, color: targetLc.text }}
                >
                  {levelLabel(target)}
                </span>
              </div>
              <p className="text-[11px] text-gray-600 leading-snug">
                Expected level for your role
              </p>
            </div>

            {/* Distance to Standard */}
            <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div
                  aria-hidden="true"
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: gap <= 0 ? '#D1FAE518' : '#FF6B6B15' }}
                >
                  <TrendingUp
                    aria-hidden="true"
                    className="w-4 h-4"
                    style={{ color: gap <= 0 ? '#059669' : '#FF6B6B' }}
                  />
                </div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold leading-tight">
                  Distance to Standard
                </p>
                <div className="ml-auto">
                  <InfoTooltip text="The difference between the NAHQ standard and your current score. Zero means you have met or exceeded the target." />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-2xl font-bold leading-none" style={{ color: gapStyle.color }}>
                  {gap <= 0 ? '0.00' : gap.toFixed(2)}
                </p>
              </div>
              <p className="text-[11px] leading-snug" style={{ color: gapStyle.color }}>
                {gapStyle.label}
              </p>
            </div>

            {/* National Average */}
            <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div
                  aria-hidden="true"
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#6B4C9A18' }}
                >
                  <Users
                    aria-hidden="true"
                    className="w-4 h-4"
                    style={{ color: '#6B4C9A' }}
                  />
                </div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold leading-tight">
                  National Average
                </p>
                <div className="ml-auto">
                  <InfoTooltip text="Average score of professionals in the national NAHQ dataset for this competency." />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-2xl font-bold text-[#3D3D3D] leading-none">
                  {nationalAvg.toFixed(2)}
                  <span className="text-sm text-gray-500 font-normal"> / 3</span>
                </p>
              </div>
              <p className="text-[11px] text-gray-600 leading-snug">
                National average for this competency
              </p>
            </div>
          </div>
        </motion.div>

        {/* Behavior Expectations (placeholder) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.08 }}
        >
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-sm font-bold text-[#3D3D3D] uppercase tracking-wide">What This Means in Practice</h2>
              <p className="text-xs text-gray-600 mt-0.5">Behaviors at your current level vs. your next-level target</p>
            </div>
            <div className="px-6 py-8 text-center text-sm text-gray-400">
              <p>Behavioral expectations will be available when NAHQ provides skill statement data.</p>
              <p className="text-xs mt-1">This section will show current-level vs next-level behaviors for this competency.</p>
            </div>
          </section>
        </motion.div>

        {/* Recommended Courses */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.12 }}
        >
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#3D3D3D] uppercase tracking-wide">
                  Recommended Courses
                </h2>
                <InfoTooltip text="Courses recommended based on your competency gap analysis. Course matching will become competency-specific as data matures." />
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                Learning resources to support your development in this area
              </p>
            </div>

            {courses.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-gray-400">
                <p>No course recommendations available yet.</p>
                <p className="text-xs mt-1">Courses will appear once NAHQ course data is linked to competencies.</p>
              </div>
            ) : (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((course) => {
                  const fmt = FORMAT_COLORS[course.format] ?? { bg: '#F3F4F6', text: '#374151' }
                  return (
                    <div
                      key={course.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all"
                    >
                      {/* Format badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide"
                          style={{ backgroundColor: fmt.bg, color: fmt.text }}
                        >
                          {course.format}
                        </span>
                        {course.ceEligible && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                            CE Eligible
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-bold text-[#1A1A1A] leading-snug mb-1">
                        {course.title}
                      </h3>

                      {/* Description */}
                      <p className="text-[12px] text-gray-600 leading-relaxed line-clamp-2 mb-3">
                        {course.description}
                      </p>

                      {/* Meta row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[11px] text-gray-500">
                          <Clock aria-hidden="true" className="w-3 h-3" />
                          <span>{course.hours} hrs</span>
                        </div>
                        <button
                          type="button"
                          className="flex items-center gap-1.5 text-xs font-bold text-[#00A3E0] hover:text-[#0082b3] transition-colors"
                        >
                          Go to Course
                          <ExternalLink aria-hidden="true" className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </motion.div>
      </main>
    </div>
  )
}
