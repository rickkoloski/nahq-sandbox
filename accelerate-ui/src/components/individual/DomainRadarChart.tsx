/**
 * Ported from Tim's Base44 prototype: Individual Experience v03
 * Recharts radar chart showing all domains — user score vs role target.
 */
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend, Tooltip,
} from 'recharts'
import type { DomainBreakdownData } from './DomainBreakdownCard'

interface DomainRadarChartProps {
  domains: DomainBreakdownData[]
}

interface RadarDataPoint {
  domain: string
  fullName: string
  score: number
  target: number
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: RadarDataPoint }> }) {
  if (!active || !payload?.length) return null
  const item = payload[0]?.payload
  if (!item) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-[#3D3D3D] mb-1">{item.fullName}</p>
      <p className="text-[#1E5BB8]">Your score: <strong>{item.score}</strong></p>
      <p className="text-gray-500">Role target: <strong>{item.target}</strong></p>
    </div>
  )
}

export function DomainRadarChart({ domains }: DomainRadarChartProps) {
  const data: RadarDataPoint[] = domains.map(d => ({
    domain: d.domainName.split(' ').slice(0, 2).join(' '),
    fullName: d.domainName,
    score: parseFloat(d.avgLevel.toFixed(1)),
    target: parseFloat(d.roleTarget.toFixed(1)),
  }))

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 16, right: 30, bottom: 16, left: 30 }}>
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis
            dataKey="domain"
            tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 3]}
            tickCount={4}
            tick={{ fontSize: 9, fill: '#9CA3AF' }}
          />
          <Radar
            name="NAHQ Role Target"
            dataKey="target"
            stroke="#94A3B8"
            fill="#94A3B8"
            fillOpacity={0.08}
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
          <Radar
            name="Your Score"
            dataKey="score"
            stroke="#1E5BB8"
            fill="#1E5BB8"
            fillOpacity={0.18}
            strokeWidth={2}
            dot={{ r: 3, fill: '#1E5BB8', strokeWidth: 0 }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
            formatter={(value) => (
              <span style={{ color: '#6B7280', fontWeight: 600 }}>{value}</span>
            )}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
