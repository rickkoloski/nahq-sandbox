import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { api } from '../api/client'
import { useAuth } from '../api/auth'
import { KpiCard } from '../components/KpiCard'
import { AiInsightsPanel } from '../components/AiInsightsPanel'
import type { GapAnalysis, BenchmarkComparison, CourseSimilarity } from '../types/api'

const DOMAIN_COLORS: Record<string, string> = {
  'Quality Leadership and Integration': '#003DA5',
  'Performance and Process Improvement': '#00B5E2',
  'Population Health and Care Transitions': '#8BC53F',
  'Health Data Analytics': '#F68B1F',
  'Patient Safety': '#ED1C24',
  'Regulatory and Accreditation': '#6B4C9A',
  'Quality Review and Accountability': '#99154B',
  'Professional Engagement': '#00A3E0',
}

export function UserDashboard() {
  const [params] = useSearchParams()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
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
      setGaps(g); setBenchmarks(b); setCourses(c)
      // Index generations by type for quick lookup
      const genMap: Record<string, Record<string, unknown>> = {}
      for (const gen of gens) {
        genMap[gen.generationType as string] = { mode: 'live', response: gen.response, model: gen.model, inputTokens: gen.inputTokens, outputTokens: gen.outputTokens, latencyMs: gen.latencyMs }
      }
      setPreviousGenerations(genMap)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [userId])

  if (loading) return <div className="p-8 text-nahq-gray">Loading your assessment...</div>
  if (!gaps || !benchmarks) return <div className="p-8 text-red">Failed to load assessment data</div>

  const topGaps = gaps.gaps.filter(g => g.gap < 0).slice(0, 5)
  const strengths = gaps.gaps.filter(g => g.gap > 0)

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/images/nahq-logo.png" alt="NAHQ" className="h-10 w-auto" />
            <span className="text-sm font-medium text-nahq-charcoal">Accelerate</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-nahq-gray">{gaps.userName}</span>
            <button onClick={() => { logout(); navigate('/login') }} className="text-nahq-gray hover:text-nahq-charcoal">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <h1 className="text-3xl font-light text-nahq-charcoal mb-1">My Assessment Results</h1>
        <p className="text-nahq-gray mb-6">{gaps.roleName} &bull; {gaps.frameworkVersion}</p>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <KpiCard
            label="OVERALL SCORE"
            value={gaps.overallScore.toFixed(2)}
            subtitle={`Target: ${gaps.overallTarget.toFixed(2)}`}
          />
          <KpiCard
            label="OVERALL GAP"
            value={gaps.overallGap > 0 ? `+${gaps.overallGap.toFixed(2)}` : gaps.overallGap.toFixed(2)}
            subtitle="vs role target"
            color={gaps.overallGap >= 0 ? '#22C55E' : '#F68B1F'}
          />
          <KpiCard
            label="COMPETENCIES ASSESSED"
            value={gaps.gaps.length}
            subtitle={`${strengths.length} above target, ${topGaps.length} below`}
            color="var(--charcoal)"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Top Gaps */}
          <div>
            <h2 className="text-lg font-semibold text-nahq-charcoal mb-4">Priority Development Areas</h2>
            <div className="space-y-3">
              {topGaps.map(g => (
                <div key={g.competencyId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-nahq-charcoal">{g.competencyName}</div>
                      <div className="text-xs text-nahq-gray flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: DOMAIN_COLORS[g.domainName] || '#999' }} />
                        {g.domainName}
                      </div>
                    </div>
                    <span className="text-lg font-bold text-orange">{g.gap.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-4 text-sm text-nahq-gray">
                    <span>Score: <strong className="text-nahq-charcoal">{g.score.toFixed(2)}</strong></span>
                    <span>Target: <strong className="text-nahq-charcoal">{g.target.toFixed(2)}</strong></span>
                    <span>Level: {g.targetLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benchmark Comparison */}
          <div>
            <h2 className="text-lg font-semibold text-nahq-charcoal mb-4">National Benchmark Comparison</h2>
            <div className="space-y-2">
              {benchmarks.competencies.slice(0, 10).map(b => (
                <div key={b.competencyId} className="flex items-center gap-3 py-2 border-b border-gray-100">
                  <div className="flex-1 text-sm truncate">{b.competencyName}</div>
                  <div className="w-20 text-right text-sm font-medium">{b.userScore.toFixed(2)}</div>
                  <div className={`w-28 text-right text-xs font-medium ${
                    b.percentileLabel.includes('Top 10') ? 'text-green' :
                    b.percentileLabel.includes('Top 25') ? 'text-cyan' :
                    b.percentileLabel.includes('Bottom') ? 'text-orange' :
                    'text-nahq-gray'
                  }`}>
                    {b.percentileLabel}
                  </div>
                </div>
              ))}
              <p className="text-xs text-nahq-gray pt-2">
                Query time: {benchmarks.queryTimeMs}ms — PostgreSQL materialized views
              </p>
            </div>
          </div>
        </div>

        {/* Recommended Courses */}
        {courses && courses.courses.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-nahq-charcoal">Recommended Courses</h2>
              {previousGenerations['upskill_plan'] ? (
                <a
                  href="#ai-insights"
                  className="flex items-center gap-1.5 text-sm font-medium text-[#00A3E0] hover:text-[#0077B6] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  View Your Personalized Plan
                </a>
              ) : (
                <span className="text-xs text-nahq-gray">Based on your top competency gaps</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {courses.courses.slice(0, 6).map(c => (
                <div key={c.courseId} className="border border-gray-200 rounded-lg p-4 hover:border-cyan transition-colors">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-nahq-charcoal text-sm">{c.title}</h3>
                    {c.ceEligible && (
                      <span className="text-xs bg-green/10 text-green px-2 py-0.5 rounded font-medium">CE</span>
                    )}
                  </div>
                  <p className="text-xs text-nahq-gray mt-1 line-clamp-2">{c.description}</p>
                  <div className="flex gap-3 mt-2 text-xs text-nahq-gray">
                    <span>{c.durationHours} hrs</span>
                    <span>Relevance: {(c.relevanceScore * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Insights */}
        <div className="mt-8" id="ai-insights">
          <h2 className="text-lg font-semibold text-nahq-charcoal mb-4">AI Insights</h2>
          <div className="space-y-3">
            <AiInsightsPanel
              title={previousGenerations['individual_summary'] ? 'Assessment Summary' : 'Generate Assessment Summary'}
              onGenerate={() => api.aiSummary(userId)}
              initialResult={previousGenerations['individual_summary'] || null}
              defaultOpen={false}
            />
            <AiInsightsPanel
              title={previousGenerations['upskill_plan'] ? 'Your Personalized Upskill Plan' : 'Generate Upskill Plan'}
              onGenerate={() => api.aiUpskillPlan(userId)}
              initialResult={previousGenerations['upskill_plan'] || null}
              defaultOpen={false}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
