import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, TrendingUp, TrendingDown, AlertTriangle, Users, Target,
  MessageCircle, ChevronRight, Sparkles, ArrowUpRight, ArrowDownRight,
  BarChart2, Zap, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Header from '@/components/shared/Header';
import ExecutiveAIChat from '@/components/executive/ExecutiveAIChat';
import FloatingChatButton from '@/components/shared/FloatingChatButton';
import InsightMetricModal from '@/components/executive/InsightMetricModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// ─── Data ────────────────────────────────────────────────────────────────────

const INSIGHT_DATA = {
  overallGap: -0.35,
  belowTargetPercent: 68,
  totalWorkforce: 10,
  domains: [
    {
      name: 'Health Data Analytics',
      color: '#F68B1F',
      icon: Target,
      belowTargetPercent: 80,
      orgScore: 1.4,
      roleTarget: 2.0,
      gap: -0.6,
      liftOpportunity: 'High',
      peopleCount: 8,
      atRisk: 8,
      insight: 'Your largest capability gap. 80% of staff are below role expectations. Focus here will yield highest workforce impact.',
      recommendation: 'Deploy foundational analytics training program for all quality staff. Prioritize data governance and statistical methods.',
      competencies: [
        { name: 'Data governance procedures', belowTarget: 90, gap: -0.7 },
        { name: 'Design data collection plans', belowTarget: 80, gap: -0.7 },
        { name: 'Acquire data from source systems', belowTarget: 80, gap: -0.6 }
      ]
    },
    {
      name: 'Performance Improvement',
      color: '#00B5E2',
      icon: TrendingUp,
      belowTargetPercent: 70,
      orgScore: 1.55,
      roleTarget: 2.05,
      gap: -0.5,
      liftOpportunity: 'High',
      peopleCount: 10,
      atRisk: 7,
      insight: '70% of team members need development. Foundational skills in data-driven improvement are lacking.',
      recommendation: 'Implement PI methodology training. Focus on using data to identify opportunities and planning initiatives.',
      competencies: [
        { name: 'Use data to identify improvement opportunities', belowTarget: 60, gap: -0.5 },
        { name: 'Plan and implement improvement initiatives', belowTarget: 50, gap: -0.5 }
      ]
    },
    {
      name: 'Patient Safety',
      color: '#ED1C24',
      icon: AlertTriangle,
      belowTargetPercent: 60,
      orgScore: 1.9,
      roleTarget: 2.1,
      gap: -0.2,
      liftOpportunity: 'Medium',
      peopleCount: 10,
      atRisk: 6,
      insight: 'Moderate gap with 60% below target. Strong foundation exists but needs advancement.',
      recommendation: 'Targeted skill-building in risk identification and mitigation. Advance high performers to expert level.',
      competencies: [
        { name: 'Identify and mitigate patient safety risks', belowTarget: 70, gap: -0.3 }
      ]
    },
    {
      name: 'Quality Leadership',
      color: '#6B4C9A',
      icon: Users,
      belowTargetPercent: 65,
      orgScore: 1.75,
      roleTarget: 2.05,
      gap: -0.3,
      liftOpportunity: 'Medium',
      peopleCount: 10,
      atRisk: 6,
      insight: '65% need leadership capability development. Culture and team-building skills need strengthening.',
      recommendation: 'Leadership development program focusing on cross-functional collaboration and continuous improvement culture.',
      competencies: [
        { name: 'Lead and sponsor quality initiatives', belowTarget: 70, gap: -0.3 },
        { name: 'Build and sustain cross-functional teams', belowTarget: 70, gap: -0.3 }
      ]
    }
  ],
  peerComparison: {
    yourOrg: 1.75,
    peerAverage: 1.95,
    topQuartile: 2.2,
    percentile: 38
  }
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function Badge({ variant = 'neutral', children }) {
  const styles = {
    neutral: 'bg-gray-100 text-gray-700 border border-gray-200',
    high: 'bg-orange-50 text-orange-700 border border-orange-200',
    medium: 'bg-blue-50 text-blue-700 border border-blue-200',
    success: 'bg-green-50 text-green-700 border border-green-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}

function MetricCard({ label, value, unit, sub, change, onClick, icon: Icon, accent }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all text-left w-full group"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accent}18` }}
        >
          <Icon className="w-4 h-4" style={{ color: accent }} />
        </div>
      </div>
      <div className="flex items-end gap-2 mb-2">
        <span className="text-3xl font-semibold text-[#3D3D3D] leading-none">{value}</span>
        {unit && <span className="text-sm text-gray-400 mb-0.5">{unit}</span>}
      </div>
      {sub && <p className="text-xs text-gray-500 mb-3">{sub}</p>}
      {change && (
        <div className="flex items-center gap-1">
          <ArrowDownRight className="w-3 h-3 text-orange-500" />
          <span className="text-xs font-medium text-orange-600">{change}</span>
        </div>
      )}
      <div className="mt-3 flex items-center gap-1 text-xs text-gray-400 group-hover:text-[#3D3D3D] transition-colors">
        <span>View analysis</span>
        <ChevronRight className="w-3 h-3" />
      </div>
    </motion.button>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h2 className="text-base font-semibold text-[#3D3D3D]">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
        <p className="font-semibold text-[#3D3D3D] mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.value}{typeof p.value === 'number' && p.value < 5 ? '' : '%'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ExecutiveInsights() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState('insights');
  const [showPeerComparison, setShowPeerComparison] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);

  const handleChatOpen = (context = 'insights') => {
    setChatContext(context);
    setChatOpen(true);
  };

  const liftDomains = INSIGHT_DATA.domains.filter(d => d.liftOpportunity === 'High').sort((a, b) => a.gap - b.gap);

  const chartData = INSIGHT_DATA.domains.map(d => ({
    name: d.name.split(' ').slice(-1)[0],
    fullName: d.name,
    below: d.belowTargetPercent,
    score: d.orgScore,
    target: d.roleTarget,
    color: d.color
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="insights" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Page Header ─────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-[#3D3D3D]">Executive Insights</h1>
            <p className="text-sm text-gray-500 mt-1">Workforce competency intelligence for your quality program</p>
          </div>
          <Button
            onClick={() => handleChatOpen('insights')}
            className="bg-[#3D3D3D] hover:bg-[#2a2a2a] text-white text-sm gap-2 shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Discuss with AI
          </Button>
        </div>

        {/* ── AI Executive Brief ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#3D3D3D] flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <p className="text-sm font-semibold text-[#3D3D3D]">AI Executive Brief</p>
                <Badge variant="neutral">High confidence</Badge>
                <span className="text-xs text-gray-400 ml-auto hidden sm:block">
                  Based on {INSIGHT_DATA.totalWorkforce} assessments
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
                <p>
                  <span className="font-semibold text-[#3D3D3D]">{INSIGHT_DATA.belowTargetPercent}% of your quality workforce</span> is
                  currently performing below their role-based competency targets, creating a{' '}
                  <span className="font-semibold text-[#F68B1F]">{Math.abs(INSIGHT_DATA.overallGap).toFixed(2)}-point organizational gap</span>.
                </p>
                <p>
                  Your highest-impact opportunity is <span className="font-semibold text-[#3D3D3D]">Health Data Analytics</span> — where 80% of
                  staff need development. With focused investment in 2–3 key domains, you can close this gap within 12–18 months.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Metric Cards ────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <MetricCard
              label="Below Role Target"
              value={`${INSIGHT_DATA.belowTargetPercent}%`}
              sub={`${Math.round(INSIGHT_DATA.totalWorkforce * INSIGHT_DATA.belowTargetPercent / 100)} of ${INSIGHT_DATA.totalWorkforce} professionals need development`}
              change="Requires immediate attention"
              onClick={() => setSelectedMetric('belowTarget')}
              icon={Users}
              accent="#3D3D3D"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <MetricCard
              label="Organizational Gap"
              value={Math.abs(INSIGHT_DATA.overallGap).toFixed(2)}
              unit="pts"
              sub="Average distance from role-based targets across all domains"
              change="vs. 0.20 peer average gap"
              onClick={() => setSelectedMetric('orgGap')}
              icon={Target}
              accent="#F68B1F"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <MetricCard
              label="High-Lift Opportunities"
              value={liftDomains.length}
              unit="domains"
              sub="Focused investment here yields maximum workforce impact"
              onClick={() => setSelectedMetric('liftOpportunity')}
              icon={Zap}
              accent="#8BC53F"
            />
          </motion.div>
        </div>

        {/* ── Two-col layout: Chart + Peer ────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6"
          >
            <SectionHeader
              title="Workforce Below Target by Domain"
              subtitle="Percentage of staff performing below role expectations"
            />
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={28}>
                <CartesianGrid vertical={false} stroke="#F3F4F6" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  domain={[0, 100]}
                  unit="%"
                  width={36}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB' }} />
                <Bar dataKey="below" name="Below Target" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Peer Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-[#3D3D3D]">Peer Comparison</p>
                <p className="text-xs text-gray-500 mt-0.5">250–500 bed health systems</p>
              </div>
              <Switch checked={showPeerComparison} onCheckedChange={setShowPeerComparison} />
            </div>

            {showPeerComparison ? (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 space-y-3"
                >
                  {[
                    { label: 'Your Organization', value: INSIGHT_DATA.peerComparison.yourOrg, highlight: true },
                    { label: 'Peer Average', value: INSIGHT_DATA.peerComparison.peerAverage },
                    { label: 'Top Quartile', value: INSIGHT_DATA.peerComparison.topQuartile },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`rounded-lg px-4 py-3 border ${item.highlight ? 'border-[#3D3D3D] bg-[#3D3D3D]/5' : 'border-gray-100 bg-gray-50'}`}
                    >
                      <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                      <p className={`text-2xl font-semibold ${item.highlight ? 'text-[#3D3D3D]' : 'text-gray-600'}`}>
                        {item.value.toFixed(2)}
                      </p>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      You're at the <span className="font-semibold text-[#F68B1F]">{INSIGHT_DATA.peerComparison.percentile}th percentile</span>. Close the {(INSIGHT_DATA.peerComparison.topQuartile - INSIGHT_DATA.peerComparison.yourOrg).toFixed(2)}-pt gap to reach top quartile.
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                <BarChart2 className="w-8 h-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">Enable toggle to view peer benchmarks</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── High-Lift Opportunities ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6"
        >
          <SectionHeader
            title="High-Lift Opportunities"
            subtitle="Domains where focused investment yields maximum workforce impact"
          />

          <div className="space-y-3">
            {liftDomains.map((domain, idx) => {
              const Icon = domain.icon;
              return (
                <div
                  key={domain.name}
                  className="border border-gray-100 rounded-xl p-5 hover:border-gray-300 transition-colors"
                >
                  {/* Header row */}
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: `${domain.color}18` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: domain.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-[#3D3D3D]">{domain.name}</p>
                        <Badge variant="high">High lift</Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{domain.peopleCount} people assessed · {domain.belowTargetPercent}% below target</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-400 mb-0.5">Gap</p>
                      <p className="text-xl font-semibold text-[#F68B1F]">{Math.abs(domain.gap).toFixed(2)}</p>
                      <p className="text-xs text-gray-400">{domain.orgScore} → {domain.roleTarget}</p>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                      <span>Current: {domain.orgScore}</span>
                      <span>Target: {domain.roleTarget}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(domain.orgScore / domain.roleTarget) * 100}%`,
                          backgroundColor: domain.color
                        }}
                      />
                    </div>
                  </div>

                  {/* AI insight + recommendation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Bot className="w-3.5 h-3.5 text-[#3D3D3D]" />
                        <p className="text-xs font-semibold text-[#3D3D3D]">AI Insight</p>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{domain.insight}</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <p className="text-xs font-semibold text-amber-700">Recommended Action</p>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{domain.recommendation}</p>
                    </div>
                  </div>

                  {/* Competency table */}
                  <div className="border border-gray-100 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Competency Gaps</p>
                    </div>
                    {domain.competencies.map((comp, cIdx) => (
                      <div
                        key={cIdx}
                        className={`flex items-center justify-between px-4 py-3 text-xs ${cIdx !== domain.competencies.length - 1 ? 'border-b border-gray-100' : ''}`}
                      >
                        <span className="text-gray-700 flex-1 pr-4">{comp.name}</span>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <span className="text-gray-400">{comp.belowTarget}% below</span>
                          <span className="font-semibold text-[#F68B1F] w-10 text-right">−{Math.abs(comp.gap).toFixed(1)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── All Domains at a Glance ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
        >
          <SectionHeader
            title="All Domains"
            subtitle="Overview of workforce performance across the quality framework"
          />

          <div className="border border-gray-100 rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
              <p className="col-span-5 text-xs font-medium text-gray-500 uppercase tracking-wide">Domain</p>
              <p className="col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wide text-center hidden sm:block">Score</p>
              <p className="col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wide text-center hidden sm:block">Gap</p>
              <p className="col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wide text-center">Below Target</p>
              <p className="col-span-1 text-xs font-medium text-gray-500 uppercase tracking-wide text-right">Lift</p>
            </div>

            {INSIGHT_DATA.domains.map((domain, idx) => {
              const Icon = domain.icon;
              return (
                <div
                  key={domain.name}
                  className={`grid grid-cols-12 gap-4 px-4 py-3.5 items-center hover:bg-gray-50 transition-colors ${idx !== INSIGHT_DATA.domains.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${domain.color}18` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: domain.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#3D3D3D]">{domain.name}</p>
                      <p className="text-xs text-gray-400">{domain.peopleCount} assessed</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-center hidden sm:block">
                    <span className="text-sm font-semibold text-[#3D3D3D]">{domain.orgScore.toFixed(2)}</span>
                    <span className="text-xs text-gray-400"> / {domain.roleTarget.toFixed(2)}</span>
                  </div>
                  <div className="col-span-2 text-center hidden sm:block">
                    <span className="text-sm font-semibold text-[#F68B1F]">−{Math.abs(domain.gap).toFixed(2)}</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-semibold text-[#3D3D3D]">{domain.belowTargetPercent}%</span>
                      <div className="w-full max-w-[80px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${domain.belowTargetPercent}%`, backgroundColor: domain.color }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 text-right">
                    <Badge variant={domain.liftOpportunity === 'High' ? 'high' : 'medium'}>
                      {domain.liftOpportunity}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>

      {/* ── Modals & Chat ──────────────────────────────────────── */}
      <AnimatePresence>
        {chatOpen && (
          <ExecutiveAIChat onClose={() => setChatOpen(false)} context={chatContext} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedMetric && (
          <InsightMetricModal type={selectedMetric} onClose={() => setSelectedMetric(null)} />
        )}
      </AnimatePresence>

      <FloatingChatButton onClick={() => handleChatOpen('insights')} />
    </div>
  );
}