/**
 * Ported from Tim's Base44 prototype: Executive Experience v04 / ExecutiveDashboard.jsx
 *
 * Preserved: page shell, breadcrumbs, tab navigation, KPI cards layout, domain distribution bars
 * Replaced: mock HOSPITAL_DATA → live API calls, createPageUrl → React Router
 * Simplified: WorkforceExplorer/FilterPanel/AIChat stubbed (complex sub-components, port later)
 */
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, ChevronRight, Eye, EyeOff, TrendingUp, AlertTriangle, Users, Calendar } from 'lucide-react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../api/auth'
import { api } from '../api/client'
import { AiInsightsPanel } from '../components/AiInsightsPanel'
import type { OrgCapabilitySummary, OrgStats, OrgSite } from '../types/api'

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

export function ExecutiveDashboardV2() {
  const [params] = useSearchParams()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const orgId = Number(params.get('orgId') || user?.organizationId || 1)

  const [orgData, setOrgData] = useState<OrgCapabilitySummary | null>(null)
  const [orgStats, setOrgStats] = useState<OrgStats | null>(null)
  const [sites, setSites] = useState<OrgSite[]>([])
  const [selectedHospital, setSelectedHospital] = useState('all')
  const [showKpiMetrics, setShowKpiMetrics] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.orgCapability(orgId),
      api.orgStats(orgId),
      api.orgSites(orgId),
    ]).then(([cap, stats, s]) => {
      setOrgData(cap); setOrgStats(stats); setSites(s); setLoading(false)
    }).catch(() => setLoading(false))
  }, [orgId])

  if (loading) return <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center text-gray-500">Loading dashboard...</div>
  if (!orgData || !orgStats) return <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center text-red-500">Failed to load data</div>

  const gapVsNational = orgData.overallOrgAvg - orgData.overallNationalAvg
  const domainsBelow = orgData.domains.filter(d => d.orgAvgScore < d.nationalMean)

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Header — Tim's pattern */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <img src="/images/nahq-logo.png" alt="NAHQ" className="h-10 w-auto" />
              <span className="hidden sm:block text-sm font-semibold text-[#3D3D3D] border-l border-gray-300 pl-3">
                Accelerate
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#00A3E0]/10 flex items-center justify-center">
                <span className="text-sm font-medium text-[#00A3E0]">{user?.firstName?.[0]}</span>
              </div>
              <span className="hidden sm:block font-medium text-sm text-gray-700">{user?.firstName}</span>
              <button onClick={() => { logout(); navigate('/login') }} className="ml-2 text-gray-400 hover:text-gray-600 text-sm">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Header — Tim's breadcrumb + title + tab pattern */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-3">
            <Link to="/" className="hover:text-[#00A3E0] transition-colors font-medium">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#3D3D3D] font-semibold">{orgData.organizationName}</span>
          </nav>

          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-xl font-bold text-[#3D3D3D]">Organizational Dashboard</h1>
              <p className="text-xs text-gray-600 mt-0.5">Workforce capability · Assessment results · Development insights</p>
            </div>
            <select
              value={selectedHospital}
              onChange={e => setSelectedHospital(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Hospitals</option>
              {sites.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Tab Navigation — Tim's pattern */}
          <div className="flex gap-1 -mb-px">
            <button className="px-4 py-2.5 text-sm font-medium border-b-2 border-[#00A3E0] text-[#00A3E0]">
              Workforce Explorer
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI Toggle — Tim's pattern */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowKpiMetrics(!showKpiMetrics)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-[#00A3E0] transition-colors px-3 py-1.5 border border-gray-200 rounded-lg hover:border-[#00A3E0]"
          >
            {showKpiMetrics ? <><Eye className="w-3.5 h-3.5" />Hide KPI Metrics</> : <><EyeOff className="w-3.5 h-3.5" />Show KPI Metrics</>}
          </button>
        </div>

        {/* Strategic Summary Bar — KPI cards, Tim's layout wired to live data */}
        <AnimatePresence>
          {showKpiMetrics && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-4 gap-4 mb-6"
            >
              {/* KPI 1: Completion */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00A3E0]/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-[#00A3E0]" />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assessment Completion</span>
                </div>
                <p className="text-3xl font-bold text-[#00A3E0]">{orgStats.completionPercent}%</p>
                <p className="text-xs text-gray-500 mt-1">{orgStats.assessmentsCompleted} of {orgStats.totalUsers} completed</p>
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#00A3E0]" style={{ width: `${orgStats.completionPercent}%` }} />
                </div>
              </div>

              {/* KPI 2: Org Score */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F68B1F]/10 flex items-center justify-center">
                    <Target className="w-4 h-4 text-[#F68B1F]" />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Organizational Score</span>
                </div>
                <p className="text-3xl font-bold text-[#3D3D3D]">{orgData.overallOrgAvg.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {orgData.overallOrgAvg >= 3.5 ? 'Advanced level' : orgData.overallOrgAvg >= 2.5 ? 'Proficient level' : 'Foundational level'}
                </p>
              </div>

              {/* KPI 3: Benchmark Gap */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${gapVsNational >= 0 ? 'bg-green-50' : 'bg-orange-50'}`}>
                    {gapVsNational >= 0
                      ? <TrendingUp className="w-4 h-4 text-green-600" />
                      : <AlertTriangle className="w-4 h-4 text-orange-500" />
                    }
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Benchmark Gap</span>
                </div>
                <p className={`text-3xl font-bold ${gapVsNational >= 0 ? 'text-green-600' : 'text-orange-500'}`}>
                  {gapVsNational >= 0 ? '+' : ''}{gapVsNational.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">vs NAHQ benchmark ({orgData.overallNationalAvg.toFixed(2)})</p>
              </div>

              {/* KPI 4: Last Assessment */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Assessment</span>
                </div>
                <p className="text-2xl font-bold text-[#3D3D3D]">
                  {orgStats.lastAssessmentDate
                    ? new Date(orgStats.lastAssessmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'No data'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Recommend reassessment in 6 months</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Domain Performance — Tim's distribution pattern, wired to live data */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#3D3D3D]">Domain Performance</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {orgData.totalParticipants} participants assessed · {domainsBelow.length === 0 ? 'All domains at or above national average' : `${domainsBelow.length} domain${domainsBelow.length > 1 ? 's' : ''} below national average`}
              </p>
            </div>
            <span className="text-xs text-gray-400">Query: {orgData.queryTimeMs}ms</span>
          </div>

          <div className="space-y-4">
            {orgData.domains.map(d => {
              const color = DOMAIN_COLORS[d.domainName] || '#999'
              const pct = (d.orgAvgScore / 5) * 100
              const natPct = (d.nationalMean / 5) * 100
              const isAbove = d.orgAvgScore >= d.nationalMean

              return (
                <div key={d.domainId} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-sm font-medium text-[#3D3D3D]">{d.domainName}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-gray-500">Org: <strong className="text-[#3D3D3D]">{d.orgAvgScore.toFixed(2)}</strong></span>
                      <span className="text-gray-500">National: <strong className="text-[#3D3D3D]">{d.nationalMean.toFixed(2)}</strong></span>
                      <span className={`font-medium ${isAbove ? 'text-green-600' : 'text-orange-500'}`}>
                        {isAbove ? '+' : ''}{(d.orgAvgScore - d.nationalMean).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {/* National benchmark marker */}
                    <div
                      className="absolute top-0 h-full w-0.5 bg-gray-400"
                      style={{ left: `${natPct}%` }}
                      title={`National avg: ${d.nationalMean.toFixed(2)}`}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-gray-400" />
              <span>National Average</span>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
          <h2 className="text-lg font-bold text-[#3D3D3D] mb-4">AI Strategic Insights</h2>
          <AiInsightsPanel
            title="Generate Organizational Recommendations"
            onGenerate={() => api.aiOrgInsights(orgId)}
          />
        </div>
      </div>
    </div>
  )
}
