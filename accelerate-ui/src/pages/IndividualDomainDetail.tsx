/**
 * IndividualDomainDetail — domain drill-down showing competency breakdown.
 *
 * Ported from: Individual Experience v03 / IndividualDomainDetail.jsx
 * Key change: wired to live API data instead of mock data.
 *
 * Shows KPI tiles, competency bullet chart rows, and competency cards
 * with circular gauges for a single domain.
 */
import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Info } from 'lucide-react'
import { api } from '../api/client'
import { useAuth } from '../api/auth'
import { Header } from '../components/Header'
import { AiInsightsModal } from '../components/AiInsightsModal'
import { CompetencyProgressGauge } from '../components/individual/CompetencyProgressGauge'
import { getDomainConfig, levelColor, levelLabel } from '../components/individual/domainConfig'
import type { GapAnalysis, BenchmarkComparison, CompetencyGap, CompetencyBenchmark } from '../types/api'

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

const BANDS = [
  { from: 0, to: 1, color: '#F8FAFB', label: 'Foundational' },
  { from: 1, to: 2, color: '#F0F4F6', label: 'Proficient' },
  { from: 2, to: 3, color: '#E7EDF0', label: 'Advanced' },
]

function gapPillStyle(gap: number): { bg: string; text: string } {
  if (gap <= 0) return { bg: '#D1FAE5', text: '#065F46' }
  if (gap <= 0.4) return { bg: '#FEF3C7', text: '#92400E' }
  return { bg: '#FEE2E2', text: '#991B1B' }
}

function CompetencyBulletRow({
  comp,
  domainColor,
  roleTarget,
}: {
  comp: CompetencyGap
  domainColor: string
  roleTarget: number
}) {
  const score = comp.score
  const gap = parseFloat((roleTarget - score).toFixed(1))
  const pill = gapPillStyle(gap)
  const scorePct = (score / 3) * 100
  const targetPct = (roleTarget / 3) * 100
  const gapLabel = gap <= 0 ? 'Target met' : `${gap.toFixed(1)} below target`

  return (
    <div className="flex items-center gap-3 py-2">
      {/* Competency name */}
      <div className="w-52 flex-shrink-0">
        <span className="text-[11px] font-semibold text-[#3D3D3D] leading-snug block">
          {comp.competencyName}
        </span>
      </div>

      {/* Bullet bar */}
      <div
        aria-hidden="true"
        className="flex-1 relative h-6 rounded overflow-hidden flex border border-slate-200"
      >
        {BANDS.map((b) => (
          <div
            key={b.label}
            className="h-full flex-shrink-0"
            style={{
              width: `${((b.to - b.from) / 3) * 100}%`,
              backgroundColor: b.color,
            }}
          />
        ))}
        {/* Score fill bar */}
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded"
          style={{
            left: 0,
            width: `${scorePct}%`,
            height: '42%',
            backgroundColor: domainColor,
            minWidth: 4,
          }}
        />
        {/* Score dot */}
        <div
          className="absolute top-1/2 w-3 h-3 rounded-full border-2 border-white shadow-sm"
          style={{
            left: `${scorePct}%`,
            transform: 'translate(-50%, -50%)',
            backgroundColor: domainColor,
          }}
        />
        {/* Target marker */}
        <div
          className="absolute top-0 h-full"
          style={{
            left: `${targetPct}%`,
            width: 2.5,
            backgroundColor: '#00A3E0',
            transform: 'translateX(-50%)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 6,
              height: 3,
              backgroundColor: '#00A3E0',
              borderRadius: '0 0 2px 2px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 6,
              height: 3,
              backgroundColor: '#00A3E0',
              borderRadius: '2px 2px 0 0',
            }}
          />
        </div>
      </div>

      {/* Score + gap pill */}
      <div className="w-24 flex-shrink-0 flex items-center gap-1.5">
        <span className="text-sm font-bold text-[#3D3D3D]">{score.toFixed(1)}</span>
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: pill.bg, color: pill.text }}
          aria-label={gapLabel}
        >
          {gap <= 0 ? '\u2713 Met' : `\u2191${gap.toFixed(1)}`}
        </span>
      </div>
    </div>
  )
}

/* ── Main Page ── */

export function IndividualDomainDetail() {
  const [params] = useSearchParams()
  const { user } = useAuth()
  const userId = Number(params.get('userId') || user?.userId || 2)
  const domainName = params.get('domain') || ''

  const [gaps, setGaps] = useState<GapAnalysis | null>(null)
  const [benchmarks, setBenchmarks] = useState<BenchmarkComparison | null>(null)
  const [previousGenerations, setPreviousGenerations] = useState<Record<string, Record<string, unknown>>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.userGaps(userId),
      api.userBenchmarks(userId),
      api.aiGenerations(userId).catch(() => []),
    ]).then(([g, b, gens]) => {
      setGaps(g)
      setBenchmarks(b)
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
          Loading domain details...
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

  // Filter gaps and benchmarks to selected domain
  const domainGaps = gaps.gaps.filter((g) => g.domainName === domainName)
  const domainBenchmarks = benchmarks.competencies.filter(
    (c) => c.domainName === domainName
  )

  const config = getDomainConfig(domainName)
  const Icon = config.icon

  // KPI: average domain score
  const avgScore =
    domainGaps.length > 0
      ? parseFloat(
          (
            domainGaps.reduce((s, g) => s + g.score, 0) / domainGaps.length
          ).toFixed(2)
        )
      : 0

  // KPI: role target (average of targets in domain)
  const roleTarget =
    domainGaps.length > 0
      ? parseFloat(
          (
            domainGaps.reduce((s, g) => s + g.target, 0) / domainGaps.length
          ).toFixed(2)
        )
      : 2

  // KPI: below-target count
  const belowTarget = domainGaps.filter((g) => g.score < g.target).length

  // KPI: national average for domain (from benchmark data)
  const nationalAvg =
    domainBenchmarks.length > 0
      ? parseFloat(
          (
            domainBenchmarks.reduce((s, c) => s + c.nationalMean, 0) /
            domainBenchmarks.length
          ).toFixed(2)
        )
      : 0

  const lc = levelColor(avgScore)

  // Estimate courses count per competency (use 0 if no course data available)
  function coursesForCompetency(_compId: number): number {
    // In the future this can be wired to api.userCourses per competency.
    // For now use a deterministic placeholder based on gap magnitude.
    return 0
  }

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
              to={`/individual-dashboard${params.get('userId') ? `?userId=${params.get('userId')}` : ''}`}
              className="hover:text-[#00A3E0] transition-colors"
            >
              My Dashboard
            </Link>
            <span aria-hidden="true">&gt;</span>
            <span style={{ color: config.color }} className="font-semibold">
              {domainName}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 mt-1">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: `${config.color}18`,
                    color: config.color,
                  }}
                >
                  Domain Overview
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-bold text-[#3D3D3D]">
                {domainName}
              </h1>
              <p className="text-xs text-gray-600 mt-1">
                Domain performance &middot; competency breakdown &middot; growth
                targets
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
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Avg Domain Results */}
            <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div
                  aria-hidden="true"
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${config.color}18` }}
                >
                  <Icon
                    aria-hidden="true"
                    className="w-4 h-4"
                    style={{ color: config.color }}
                  />
                </div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold leading-tight">
                  Avg. Domain Results
                </p>
                <div className="ml-auto">
                  <InfoTooltip text="Your average result across all competencies in this domain (0-3 scale)." />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-2xl font-bold text-[#3D3D3D] leading-none">
                  {avgScore.toFixed(2)}
                  <span className="text-sm text-gray-500 font-normal">
                    {' '}
                    / 3
                  </span>
                </p>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: lc.bg, color: lc.text }}
                >
                  {levelLabel(avgScore)}
                </span>
              </div>
              <p className="text-[11px] text-gray-600 leading-snug">
                Your average results for this domain
              </p>
            </div>

            {/* Below Target */}
            <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div
                  aria-hidden="true"
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#FF6B6B15' }}
                >
                  <TrendingUp
                    aria-hidden="true"
                    className="w-4 h-4"
                    style={{ color: '#FF6B6B' }}
                  />
                </div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold leading-tight">
                  Below Target
                </p>
                <div className="ml-auto">
                  <InfoTooltip text="Number of competencies in this domain where your level is below the NAHQ expected level for your role." />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-2xl font-bold text-[#3D3D3D] leading-none">
                  {belowTarget}
                </p>
              </div>
              <p className="text-[11px] text-gray-600 leading-snug">
                Competencies below NAHQ standard
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
                  <InfoTooltip text="Average overall result of professionals in the national NAHQ dataset for this domain." />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#3D3D3D] leading-none">
                {nationalAvg.toFixed(2)}
                <span className="text-sm text-gray-500 font-normal">
                  {' '}
                  / 3.0
                </span>
              </p>
              <p className="text-[11px] text-gray-600 mt-1 mb-2">
                National average for this domain
              </p>
            </div>
          </div>
        </motion.div>

        {/* Competency Bullet Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.08 }}
        >
          <section
            aria-labelledby="competency-results-heading"
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2
                  id="competency-results-heading"
                  className="text-sm font-bold text-[#3D3D3D] uppercase tracking-wide"
                >
                  Competency Results
                </h2>
                <InfoTooltip text="Your self-assessed level of work for competencies within the Domain on the 0-3 scale compared to the NAHQ Standard Role Target." />
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                Your results vs. NAHQ Standard Role Target (0-3 scale)
              </p>
            </div>

            {/* Legend */}
            <div
              className="px-6 pt-4 flex items-center gap-4 flex-wrap"
              aria-hidden="true"
            >
              <div className="flex items-center gap-1.5">
                <div
                  className="w-8 h-3 rounded-sm"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-[10px] text-gray-600 font-semibold">
                  Your Results
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-0.5 h-4"
                  style={{ backgroundColor: '#00A3E0' }}
                />
                <span className="text-[10px] text-gray-600 font-semibold">
                  NAHQ Role Target ({roleTarget.toFixed(1)})
                </span>
              </div>
              <div className="flex items-center gap-3 ml-auto text-[10px] text-gray-600">
                <span className="flex items-center gap-1">
                  <span
                    className="w-2.5 h-2.5 rounded-sm inline-block"
                    style={{
                      backgroundColor: '#F8FAFB',
                      border: '1px solid #D1D9DD',
                    }}
                  />
                  Foundational
                </span>
                <span className="flex items-center gap-1">
                  <span
                    className="w-2.5 h-2.5 rounded-sm inline-block"
                    style={{
                      backgroundColor: '#F0F4F6',
                      border: '1px solid #D1D9DD',
                    }}
                  />
                  Proficient
                </span>
                <span className="flex items-center gap-1">
                  <span
                    className="w-2.5 h-2.5 rounded-sm inline-block"
                    style={{
                      backgroundColor: '#E7EDF0',
                      border: '1px solid #C0CDD3',
                    }}
                  />
                  Advanced
                </span>
              </div>
            </div>

            <div className="px-6 py-4 space-y-1 divide-y divide-gray-50">
              {domainGaps.map((comp) => (
                <CompetencyBulletRow
                  key={comp.competencyId}
                  comp={comp}
                  domainColor={config.color}
                  roleTarget={comp.target}
                />
              ))}
            </div>

            {/* Scale ticks */}
            <div className="px-6 pb-4" aria-hidden="true">
              <div className="ml-[calc(13rem+0.75rem)] mr-24 flex justify-between px-0">
                {[0, 1, 2, 3].map((v) => (
                  <span key={v} className="text-[9px] text-gray-500">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </motion.div>

        {/* Competency Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.12 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-[#3D3D3D] uppercase tracking-wide">
                Competencies
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                Detailed competency scores with NAHQ targets
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {domainGaps.map((comp) => {
              const score = comp.score
              const coursesCount = coursesForCompetency(comp.competencyId)
              return (
                <div
                  key={comp.competencyId}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md hover:border-gray-300 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <p className="text-sm font-bold text-[#3D3D3D] leading-snug flex-1 min-w-0">
                      {comp.competencyName}
                    </p>
                  </div>

                  <CompetencyProgressGauge
                    score={score}
                    roleTarget={comp.target}
                    domainColor={config.color}
                    coursesCount={coursesCount}
                  />
                </div>
              )
            })}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
