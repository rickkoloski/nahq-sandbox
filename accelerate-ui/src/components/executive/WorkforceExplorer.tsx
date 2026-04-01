/**
 * WorkforceExplorer — domain card grid with bullet charts for executive dashboard.
 *
 * Each card shows per-domain metrics (avg score, distance to national, participants)
 * and a horizontal bullet chart comparing org average against the national average
 * on the NAHQ 0-3 competency scale.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { getDomainConfig } from '../individual/domainConfig'
import type { DomainSummary } from '../../types/api'

interface WorkforceExplorerProps {
  domains: DomainSummary[]
  selectedHospital: string
  filteredParticipants: number
}

/* ── Bullet Chart ─────────────────────────────────────────────── */

function BulletChart({ avgScore, nationalMean, color }: { avgScore: number; nationalMean: number; color: string }) {
  const maxScore = 3
  const scorePct = Math.min((avgScore / maxScore) * 100, 100)
  const natPct = Math.min((nationalMean / maxScore) * 100, 100)
  const ticks = [0, 1, 2, 3]
  const labels = ['Foundational', 'Proficient', 'Advanced']

  return (
    <div className="mt-3">
      {/* Bar track */}
      <div className="relative h-5 bg-gray-100 rounded">
        {/* Score fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${scorePct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-y-0 left-0 rounded"
          style={{ backgroundColor: color, opacity: 0.75 }}
        />
        {/* National average marker */}
        <div
          className="absolute top-0 h-full w-0.5 bg-gray-800 z-10"
          style={{ left: `${natPct}%` }}
        />
        {/* Tick marks */}
        {ticks.map(t => (
          <div
            key={t}
            className="absolute top-0 h-full w-px bg-gray-300"
            style={{ left: `${(t / maxScore) * 100}%` }}
          />
        ))}
      </div>
      {/* Tick labels */}
      <div className="relative h-4 mt-0.5">
        {ticks.map(t => (
          <span
            key={t}
            className="absolute text-[9px] text-gray-400 -translate-x-1/2"
            style={{ left: `${(t / maxScore) * 100}%` }}
          >
            {t}
          </span>
        ))}
      </div>
      {/* Level labels */}
      <div className="relative h-3">
        {labels.map((label, i) => (
          <span
            key={label}
            className="absolute text-[8px] text-gray-400 text-center"
            style={{
              left: `${((i * 1 + 0.5) / maxScore) * 100}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Domain Card ──────────────────────────────────────────────── */

function DomainCard({ domain }: { domain: DomainSummary }) {
  const [hovered, setHovered] = useState(false)
  const config = getDomainConfig(domain.domainName)
  const Icon = config.icon
  const color = config.color
  const delta = domain.orgAvgScore - domain.nationalMean
  const deltaPositive = delta >= 0

  return (
    <Link to={`/domain-detail?domain=${encodeURIComponent(domain.domainName)}`} className="block">
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer transition-shadow hover:shadow-md relative h-full"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <h3 className="text-sm font-semibold text-[#3D3D3D] leading-tight flex-1">
          {domain.domainName}
        </h3>
        <motion.div animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -4 }}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </motion.div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-2 text-center mb-1">
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Avg Results</p>
          <p className="text-base font-bold text-[#3D3D3D]">{domain.orgAvgScore.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Dist. to National</p>
          <p className={`text-base font-bold ${deltaPositive ? 'text-green-600' : 'text-red-500'}`}>
            {deltaPositive ? '+' : ''}{delta.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Participants</p>
          <p className="text-base font-bold text-[#3D3D3D]">{domain.participantCount}</p>
        </div>
      </div>

      {/* Bullet chart */}
      <BulletChart avgScore={domain.orgAvgScore} nationalMean={domain.nationalMean} color={color} />

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <span>Org Avg</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-gray-800 rounded" />
          <span>National Average ({domain.nationalMean.toFixed(1)})</span>
        </div>
      </div>
    </motion.div>
    </Link>
  )
}

/* ── Workforce Explorer ───────────────────────────────────────── */

export function WorkforceExplorer({ domains, selectedHospital, filteredParticipants }: WorkforceExplorerProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-[#3D3D3D]">Workforce Explorer</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {filteredParticipants} participants across {domains.length} domains
            {selectedHospital !== 'all' ? ' (filtered)' : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {domains.map(d => (
          <DomainCard key={d.domainId} domain={d} />
        ))}
      </div>
    </div>
  )
}
