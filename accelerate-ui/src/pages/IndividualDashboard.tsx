/**
 * IndividualDashboard — Tim's approved participant assessment results page.
 *
 * Ported from: Individual Experience v03 / IndividualDashboard.jsx
 * Key change: wired to live API data instead of mock data.
 *
 * This is the PRIMARY participant dashboard (Tim's approved UX).
 * For the original scaffold dashboard, see UserDashboard via the overflow menu.
 */
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Target, TrendingUp, Award, Users, Info } from 'lucide-react'
import { api } from '../api/client'
import { useAuth } from '../api/auth'
import { Header } from '../components/Header'
import { AiInsightsPanel } from '../components/AiInsightsPanel'
import { BellCurveChart } from '../components/individual/BellCurveChart'
import { DomainBreakdownCard } from '../components/individual/DomainBreakdownCard'
import { UpskillPlanSidebar } from '../components/individual/UpskillPlanSidebar'
import { getDomainConfig, levelLabel, levelColor } from '../components/individual/domainConfig'
import type { DomainBreakdownData } from '../components/individual/DomainBreakdownCard'
import type { UpskillCourse } from '../components/individual/UpskillPlanSidebar'
import type { GapAnalysis, BenchmarkComparison, CourseSimilarity } from '../types/api'

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

function buildDomainScores(gaps: GapAnalysis): DomainBreakdownData[] {
  const grouped: Record<string, { scores: number[]; targets: number[] }> = {}
  for (const g of gaps.gaps) {
    if (!grouped[g.domainName]) grouped[g.domainName] = { scores: [], targets: [] }
    grouped[g.domainName].scores.push(g.score)
    grouped[g.domainName].targets.push(g.target)
  }
  return Object.entries(grouped).map(([domainName, { scores, targets }]) => {
    const avgLevel = scores.reduce((s, v) => s + v, 0) / scores.length
    const roleTarget = targets.reduce((s, v) => s + v, 0) / targets.length
    const belowTarget = scores.filter((s, i) => s < targets[i]).length
    return { domainName, avgLevel, roleTarget, totalComps: scores.length, belowTarget }
  })
}

function buildCourses(courseSimilarity: CourseSimilarity | null): UpskillCourse[] {
  if (!courseSimilarity) return []
  return courseSimilarity.courses.slice(0, 6).map(c => ({
    id: c.courseId,
    title: c.title,
    hours: c.durationHours,
    status: 'not_started' as const,
    domainName: courseSimilarity.domainName || undefined,
    relevanceLabel: `${(c.relevanceScore * 100).toFixed(0)}% match${c.ceEligible ? ' · CE Eligible' : ''}`,
  }))
}

export function IndividualDashboard() {
  const [params] = useSearchParams()
  const { user } = useAuth()
  const userId = Number(params.get('userId') || user?.userId || 2)

  const [gaps, setGaps] = useState<GapAnalysis | null>(null)
  const [benchmarks, setBenchmarks] = useState<BenchmarkComparison | null>(null)
  const [courses, setCourses] = useState<CourseSimilarity | null>(null)
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
      setCourses(c)
      const genMap: Record<string, Record<string, unknown>> = {}
      for (const gen of gens) {
        genMap[gen.generationType as string] = {
          mode: 'live', response: gen.response, model: gen.model,
          inputTokens: gen.inputTokens, outputTokens: gen.outputTokens, latencyMs: gen.latencyMs,
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
        <div className="max-w-7xl mx-auto px-6 py-12 text-center text-gray-500">
          Loading your assessment...
        </div>
      </div>
    )
  }

  if (!gaps || !benchmarks) {
    return (
      <div className="min-h-screen bg-[#F8F9FB]">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-12 text-center text-red-600">
          Failed to load assessment data.
        </div>
      </div>
    )
  }

  const firstName = user?.firstName || gaps.userName?.split(' ')[0] || 'there'
  const avgScore = gaps.overallScore
  const growthPriorities = gaps.gaps.filter(g => g.gap < 0).length

  // Compute bell curve params from benchmark data
  const nationalMean = benchmarks.competencies.length > 0
    ? benchmarks.competencies.reduce((s, c) => s + c.nationalMean, 0) / benchmarks.competencies.length
    : 1.75
  const avgP25 = benchmarks.competencies.length > 0
    ? benchmarks.competencies.reduce((s, c) => s + c.nationalP25, 0) / benchmarks.competencies.length
    : 1.33
  const avgP75 = benchmarks.competencies.length > 0
    ? benchmarks.competencies.reduce((s, c) => s + c.nationalP75, 0) / benchmarks.competencies.length
    : 2.17
  const estimatedStd = Math.max(0.2, (avgP75 - avgP25) / 1.35)

  const domainScores = buildDomainScores(gaps)
  const upskillCourses = buildCourses(courses)
  // Determine scale max from the data (highest target or score, rounded up)
  const scaleMax = Math.ceil(Math.max(
    ...gaps.gaps.map(g => g.target),
    ...gaps.gaps.map(g => g.score),
    gaps.overallTarget,
  ))
  const scoreStyle = levelColor(avgScore / scaleMax * 3) // normalize to 0-3 for color

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-xs text-gray-500 mb-1">My Dashboard</div>
          <div className="flex items-start justify-between gap-4 mt-1">
            <div>
              <h1 className="text-xl font-bold text-[#3D3D3D]">Your Professional Assessment Overview</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-gray-600">
                  {gaps.roleName}
                </span>
                <span aria-hidden="true" className="text-gray-300 text-xs">·</span>
                <span className="text-xs text-gray-600">
                  Measured against <span className="font-semibold text-[#3D3D3D]">{gaps.frameworkVersion}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Two-column layout */}
        <div className="flex gap-6 items-start">

          {/* LEFT COLUMN */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Welcome Banner */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <div
                className="rounded-xl px-7 py-6 flex items-center justify-between overflow-hidden relative"
                style={{ background: 'linear-gradient(135deg, #009FE8 0%, #414042 100%)' }}
              >
                <div aria-hidden="true" className="absolute right-24 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-2 border-white/10 opacity-40" />
                <div aria-hidden="true" className="absolute right-12 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-2 border-white/10 opacity-30" />

                <div className="relative z-10 max-w-lg">
                  <h2 className="text-lg font-bold text-white mb-1.5">
                    Welcome to Your Results, {firstName}!
                  </h2>
                  <p className="text-sm text-white/90 leading-relaxed">
                    Your personalized assessment provides insights into your competencies across key quality improvement domains. Explore how you compare to national benchmarks and discover targeted learning opportunities.
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
                      <InfoTooltip text="Your average result across all competencies (0-3 scale)." />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <p className="text-2xl font-bold text-[#3D3D3D] leading-none">
                      {avgScore.toFixed(2)}<span className="text-sm text-gray-500 font-normal"> / {scaleMax}.0</span>
                    </p>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: scoreStyle.bg, color: scoreStyle.text }}
                    >
                      {levelLabel(avgScore / scaleMax * 3)}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-snug">Target: {gaps.overallTarget.toFixed(2)}</p>
                </div>

                {/* Growth Priorities */}
                <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 shadow-sm relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div aria-hidden="true" className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F59E0B18' }}>
                      <Target aria-hidden="true" className="w-4 h-4" style={{ color: '#F59E0B' }} />
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
                      <InfoTooltip text="Average overall result of professionals in the national NAHQ dataset." />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <p className="text-2xl font-bold text-[#3D3D3D] leading-none">
                      {nationalMean.toFixed(2)}<span className="text-sm text-gray-500 font-normal"> / {scaleMax}.0</span>
                    </p>
                  </div>
                  <p className="text-[11px] text-gray-600 mb-2">National average</p>
                </div>
              </div>
            </motion.div>

            {/* National Benchmark Comparison — Bell Curve */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.06 }}>
              <section aria-labelledby="benchmark-heading" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 id="benchmark-heading" className="text-sm font-bold text-[#00A3E0] uppercase tracking-wide">
                      National Benchmark Comparison
                    </h2>
                    <InfoTooltip text="This benchmark represents the typical level of work observed across NAHQ's national dataset." />
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{gaps.roleName} &bull; {gaps.frameworkVersion}</p>
                </div>
                <div className="p-6">
                  <BellCurveChart
                    userScore={avgScore}
                    mean={nationalMean}
                    std={estimatedStd}
                    peerLabel="National Benchmark"
                    scaleMin={Math.max(0, Math.floor(Math.min(avgScore, nationalMean) - 2 * estimatedStd))}
                    scaleMax={Math.ceil(Math.max(avgScore, nationalMean) + 2 * estimatedStd)}
                    maxScoreLabel="5.0"
                  />
                </div>
              </section>
            </motion.div>

            {/* AI Summary */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.08 }}>
              <AiInsightsPanel
                title={previousGenerations['individual_summary'] ? 'AI Assessment Summary' : 'Generate AI Assessment Summary'}
                onGenerate={() => api.aiSummary(userId)}
                initialResult={previousGenerations['individual_summary'] || null}
                defaultOpen={!!previousGenerations['individual_summary']}
              />
            </motion.div>
          </div>

          {/* RIGHT COLUMN */}
          <aside aria-label="Your Personalized Upskill Plan" className="w-80 flex-shrink-0">
            <UpskillPlanSidebar courses={upskillCourses} />
          </aside>
        </div>

        {/* Domain Breakdown */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.1 }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-[#3D3D3D] uppercase tracking-wide">Explore Your Domains</h2>
              <p className="text-xs text-gray-600 mt-0.5">Your performance across the NAHQ Competency Framework</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {domainScores.map((domain) => (
              <DomainBreakdownCard key={domain.domainName} domain={{ ...domain, scaleMax }} />
            ))}
          </div>
        </motion.div>

        {/* AI Upskill Plan */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.12 }}>
          <AiInsightsPanel
            title={previousGenerations['upskill_plan'] ? 'Your AI Upskill Plan' : 'Generate AI Upskill Plan'}
            onGenerate={() => api.aiUpskillPlan(userId)}
            initialResult={previousGenerations['upskill_plan'] || null}
            defaultOpen={false}
          />
        </motion.div>
      </main>
    </div>
  )
}
