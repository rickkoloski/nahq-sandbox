import { useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronDown, ChevronRight, BarChart3, Target, TrendingUp, LogOut } from 'lucide-react'
import { api } from '../api/client'
import { useAuth } from '../api/auth'
import { KpiCard } from '../components/KpiCard'
import { ProgressBar } from '../components/ProgressBar'
import type { OrgCapabilitySummary, OrgStats } from '../types/api'

const DOMAIN_COLORS = [
  '#003DA5', '#00B5E2', '#8BC53F', '#F68B1F', '#ED1C24', '#6B4C9A', '#99154B', '#00A3E0'
]

export function ExecutiveDashboard() {
  const [params] = useSearchParams()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const orgId = Number(params.get('orgId') || user?.organizationId || 1)
  const [orgData, setOrgData] = useState<OrgCapabilitySummary | null>(null)
  const [orgStats, setOrgStats] = useState<OrgStats | null>(null)
  const [expandedSection, setExpandedSection] = useState<string | null>('participation')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.orgCapability(orgId),
      api.orgStats(orgId),
    ]).then(([cap, stats]) => {
      setOrgData(cap); setOrgStats(stats); setLoading(false)
    }).catch(() => setLoading(false))
  }, [orgId])

  if (loading) return <div className="p-8 text-nahq-gray">Loading dashboard...</div>
  if (!orgData) return <div className="p-8 text-red">Failed to load organization data</div>

  const gapVsNational = (orgData.overallOrgAvg - orgData.overallNationalAvg).toFixed(2)
  const gapColor = Number(gapVsNational) >= 0 ? 'var(--cyan-primary)' : '#F68B1F'

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold" style={{ color: 'var(--cyan-primary)' }}>NAHQ</span>
            <span className="text-sm font-medium text-nahq-charcoal">Accelerate</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to={`/user-dashboard`}
              className="px-4 py-2 border border-cyan rounded-md text-sm text-cyan hover:bg-cyan-light transition-colors"
            >
              My View
            </Link>
            <span className="text-sm text-nahq-gray">{user?.firstName}</span>
            <button onClick={() => { logout(); navigate('/login') }} className="text-nahq-gray hover:text-nahq-charcoal">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <Link to="/organizations" className="flex items-center gap-1 text-sm text-nahq-gray hover:text-cyan mb-4">
          <ChevronLeft size={16} />
          Back to Organization
        </Link>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-light text-nahq-charcoal">Organizational Dashboard</h1>
            <p className="text-nahq-gray">Workforce capability snapshot &bull; Professional assessment results &bull; Development insights</p>
          </div>
          <select className="border border-gray-200 rounded-md px-3 py-2 text-sm">
            <option>All Hospitals</option>
          </select>
        </div>

        {/* KPI Cards — matching Tim's 4-card layout */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <KpiCard
            label="ASSESSMENT COMPLETION"
            value={orgStats ? `${orgStats.completionPercent}%` : '...'}
            subtitle={orgStats ? `(${orgStats.assessmentsCompleted}/${orgStats.totalUsers})` : ''}
          />
          <KpiCard
            label="ORGANIZATIONAL SCORE"
            value={orgData.overallOrgAvg.toFixed(2)}
            subtitle={orgData.overallOrgAvg >= 3.5 ? 'Advanced level' : orgData.overallOrgAvg >= 2.5 ? 'Proficient level' : 'Foundational level'}
          />
          <KpiCard
            label="BENCHMARK GAP"
            value={Number(gapVsNational) > 0 ? `+${gapVsNational}` : gapVsNational}
            subtitle={`vs NAHQ benchmark (${orgData.overallNationalAvg.toFixed(2)})`}
            color={gapColor}
          />
          <KpiCard
            label="LAST ASSESSMENT"
            value={orgStats?.lastAssessmentDate ? new Date(orgStats.lastAssessmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No data'}
            subtitle="Recommend reassessment in 6 months"
            color="var(--charcoal)"
          />
        </div>

        {/* Collapsible Sections — matching Tim's accordion pattern */}
        <div className="space-y-4">
          {/* Assessment Participation */}
          <Section
            title="Assessment Participation & Adoption"
            subtitle={orgStats ? `${orgStats.completionPercent}% completion rate • Track by role & status` : 'Loading...'}
            icon={<BarChart3 size={24} className="text-cyan" />}
            expanded={expandedSection === 'participation'}
            onToggle={() => setExpandedSection(expandedSection === 'participation' ? null : 'participation')}
          >
            {orgStats && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-nahq-gray">Completed</div>
                    <div className="text-3xl font-bold text-cyan">{orgStats.assessmentsCompleted}</div>
                    <div className="text-sm text-nahq-gray">out of {orgStats.totalUsers} users</div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-nahq-gray">Not Started</div>
                    <div className="text-3xl font-bold text-nahq-charcoal">{orgStats.assessmentsNotStarted}</div>
                    <div className="text-sm text-nahq-gray">invitation sent</div>
                  </div>
                </div>
                <ProgressBar value={orgStats.assessmentsCompleted} max={orgStats.totalUsers} label="Completion Progress" />
              </>
            )}
          </Section>

          {/* Domain Performance */}
          <Section
            title="Organizational Assessment Results"
            subtitle="Domain distributions • Competency levels • Variation insights"
            icon={<Target size={24} className="text-orange" />}
            expanded={expandedSection === 'results'}
            onToggle={() => setExpandedSection(expandedSection === 'results' ? null : 'results')}
          >
            <div className="space-y-3">
              {orgData.domains.map((d, i) => (
                <div key={d.domainId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: DOMAIN_COLORS[i] }} />
                      <span className="font-medium">{d.domainName}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-nahq-gray">Org: <strong>{d.orgAvgScore.toFixed(2)}</strong></span>
                      <span className="text-sm text-nahq-gray">National: <strong>{d.nationalMean.toFixed(2)}</strong></span>
                      <span className={`text-sm font-medium ${
                        d.orgAvgScore >= d.nationalMean ? 'text-green' : 'text-orange'
                      }`}>
                        {d.vsNational}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(d.orgAvgScore / 5) * 100}%`,
                        backgroundColor: DOMAIN_COLORS[i]
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Benchmarking */}
          <Section
            title="Benchmarking & Comparative Views"
            subtitle="Contextual insights • Multiple benchmark views • Role comparisons"
            icon={<TrendingUp size={24} className="text-green" />}
            expanded={expandedSection === 'benchmarking'}
            onToggle={() => setExpandedSection(expandedSection === 'benchmarking' ? null : 'benchmarking')}
          >
            <div className="text-center py-8 text-nahq-gray">
              <p className="text-lg mb-2">Benchmark comparison data available</p>
              <p className="text-sm">Query time: {orgData.queryTimeMs}ms — powered by PostgreSQL materialized views</p>
            </div>
          </Section>
        </div>
      </main>
    </div>
  )
}

function Section({ title, subtitle, icon, expanded, onToggle, children }: {
  title: string
  subtitle: string
  icon: React.ReactNode
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={onToggle} className="w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
        {icon}
        <div className="text-left flex-1">
          <h3 className="font-semibold text-nahq-charcoal">{title}</h3>
          <p className="text-sm text-nahq-gray">{subtitle}</p>
        </div>
        {expanded ? <ChevronDown size={20} className="text-nahq-gray" /> : <ChevronRight size={20} className="text-nahq-gray" />}
      </button>
      {expanded && <div className="px-6 pb-6 pt-2">{children}</div>}
    </div>
  )
}
