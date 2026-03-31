/**
 * Ported from Tim's Base44 prototype: Individual Experience v03
 * Pure SVG bell curve visualization — no external charting dependency.
 * Shows user score position on a normal distribution relative to peer group.
 */
import { useMemo, useState, useRef, useCallback } from 'react'

function normalPDF(x: number, mean: number, std: number): number {
  return Math.exp(-0.5 * Math.pow((x - mean) / std, 2)) / (std * Math.sqrt(2 * Math.PI))
}

function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1
  x = Math.abs(x)
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741
  const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911
  const t = 1 / (1 + p * x)
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
  return sign * y
}

function normalCDF(x: number, mean: number, std: number): number {
  return 0.5 * (1 + erf((x - mean) / (std * Math.sqrt(2))))
}

function getPeerCount(x: number, mean: number, std: number, totalN = 1200): number {
  const density = normalPDF(x, mean, std)
  const maxDensity = normalPDF(mean, mean, std)
  return Math.round(density / maxDensity * totalN * 0.1)
}

interface BellCurveChartProps {
  userScore?: number
  mean?: number
  std?: number
  peerLabel?: string
}

export function BellCurveChart({ userScore = 1.48, mean = 1.75, std = 0.42, peerLabel = 'National Average' }: BellCurveChartProps) {
  const [tooltip, setTooltip] = useState<{
    x: number; y: number; dataX: number; count: number; pct: number
  } | null>(null)
  const [userTooltip, setUserTooltip] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  const W = 560, H = 190
  const PL = 36, PR = 16, PT = 24, PB = 44
  const chartW = W - PL - PR
  const chartH = H - PT - PB
  const xMin = 0, xMax = 3, steps = 300

  const points = useMemo(() => {
    const pts: { x: number; y: number }[] = []
    for (let i = 0; i <= steps; i++) {
      const x = xMin + i / steps * (xMax - xMin)
      pts.push({ x, y: normalPDF(x, mean, std) })
    }
    return pts
  }, [mean, std])

  const maxY = Math.max(...points.map((p) => p.y))

  const toX = (x: number) => PL + (x - xMin) / (xMax - xMin) * chartW
  const toY = (y: number) => PT + (1 - y / maxY) * chartH
  const bottomY = PT + chartH

  const curvePath = points.map((p, i) =>
    `${i === 0 ? 'M' : 'L'}${toX(p.x).toFixed(1)},${toY(p.y).toFixed(1)}`
  ).join(' ')

  const fillPath = `${curvePath} L${toX(xMax).toFixed(1)},${bottomY} L${toX(xMin).toFixed(1)},${bottomY} Z`

  const bandPts = points.filter((p) => p.x >= mean - std && p.x <= mean + std)
  const bandPath = bandPts.length > 1
    ? bandPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.x).toFixed(1)},${toY(p.y).toFixed(1)}`).join(' ') +
      ` L${toX(mean + std).toFixed(1)},${bottomY} L${toX(mean - std).toFixed(1)},${bottomY} Z`
    : ''

  const userX = toX(userScore)
  const meanX = toX(mean)
  const userCurveY = toY(normalPDF(userScore, mean, std))
  const meanCurveY = toY(maxY)
  const userPct = Math.round(normalCDF(userScore, mean, std) * 100)

  const ticks = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0]

  const levelLabels: Record<number, string> = { 1.0: 'Foundational', 2.0: 'Proficient', 3.0: 'Advanced' }

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const scaleX = W / rect.width
    const svgMouseX = (e.clientX - rect.left) * scaleX
    const dataX = xMin + (svgMouseX - PL) / chartW * (xMax - xMin)
    if (dataX < xMin || dataX > xMax) { setTooltip(null); return }
    if (Math.abs(dataX - userScore) < 0.12) {
      setUserTooltip(true)
      setTooltip(null)
      return
    }
    setUserTooltip(false)
    const snapped = Math.round(dataX * 10) / 10
    const count = getPeerCount(snapped, mean, std)
    const pct = Math.round(normalCDF(snapped, mean, std) * 100)
    setTooltip({ x: toX(snapped), y: toY(normalPDF(snapped, mean, std)), dataX: snapped, count, pct })
  }, [mean, std, userScore, chartW])

  const handleMouseLeave = useCallback(() => {
    setTooltip(null)
    setUserTooltip(false)
  }, [])

  const utRight = userX > W * 0.6
  const utX = utRight ? userX - 8 - 88 : userX + 8
  const utY = Math.max(PT + 2, userCurveY - 30)

  const srSummary = `Bell curve chart comparing your score to ${peerLabel}. Your score: ${userScore.toFixed(2)} out of 3.0, placing you at the ${userPct}th percentile. The national average mean is ${mean.toFixed(2)}.`

  return (
    <div className="w-full">
      <p className="sr-only">{srSummary}</p>

      <div className="relative" aria-hidden="true">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full cursor-crosshair"
          style={{ overflow: 'visible' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          focusable="false"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="bcFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00A3E0" stopOpacity={0.10} />
              <stop offset="100%" stopColor="#00A3E0" stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="bcBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00A3E0" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#00A3E0" stopOpacity={0.05} />
            </linearGradient>
            <filter id="dotGlow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {ticks.slice(1, -1).map((v) => (
            <line key={v} x1={toX(v)} y1={PT} x2={toX(v)} y2={bottomY} stroke="#F3F4F6" strokeWidth="1" />
          ))}

          <path d={fillPath} fill="url(#bcFill)" />
          {bandPath && <path d={bandPath} fill="url(#bcBand)" />}
          <path d={curvePath} fill="none" stroke="#00A3E0" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

          <line x1={meanX} y1={PT} x2={meanX} y2={bottomY} stroke="#D1D5DB" strokeWidth="1.5" strokeDasharray="5 3" />
          <circle cx={meanX} cy={meanCurveY} r={4.5} fill="white" stroke="#9CA3AF" strokeWidth="1.5" />
          <circle cx={meanX} cy={meanCurveY} r={2} fill="#6B7280" />
          <text x={meanX} y={PT - 12} textAnchor="middle" fontSize="7.5" fill="#6B7280" fontWeight="600" letterSpacing="0.2">
            Benchmark {mean.toFixed(2)}
          </text>

          <line x1={userX} y1={userCurveY} x2={userX} y2={bottomY} stroke="#00A3E0" strokeWidth="1.5" />
          <circle cx={userX} cy={userCurveY} r={4.5} fill="white" stroke="#00A3E0" strokeWidth="1.5" />
          <circle cx={userX} cy={userCurveY} r={2} fill="#00A3E0" />

          {userTooltip && (
            <g>
              <rect x={utX} y={utY} width={88} height={34} rx={5} fill="#00A3E0" />
              <text x={utX + 44} y={utY + 13} textAnchor="middle" fontSize="10.5" fill="white" fontWeight="700">
                {userScore.toFixed(2)}
              </text>
              <text x={utX + 44} y={utY + 26} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.88)">
                {userPct}th percentile
              </text>
            </g>
          )}

          {tooltip && (
            <g>
              <line x1={tooltip.x} y1={PT} x2={tooltip.x} y2={bottomY} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3 2" />
              <circle cx={tooltip.x} cy={tooltip.y} r={3.5} fill="#FFED00" stroke="#3D3D3D" strokeWidth="1.5" />
              {(() => {
                const tx = tooltip.x > W - 110 ? tooltip.x - 104 : tooltip.x + 8
                const ty = Math.max(PT, tooltip.y - 22)
                return (
                  <g>
                    <rect x={tx} y={ty} width={96} height={38} rx={5} fill="#1F2937" opacity={0.9} />
                    <text x={tx + 8} y={ty + 13} fontSize="9" fill="white" fontWeight="600">Score: {tooltip.dataX.toFixed(1)}</text>
                    <text x={tx + 8} y={ty + 25} fontSize="8.5" fill="#D1D5DB">~{tooltip.count} respondents</text>
                    <text x={tx + 8} y={ty + 35} fontSize="8.5" fill="#D1D5DB">{tooltip.pct}th percentile</text>
                  </g>
                )
              })()}
            </g>
          )}

          <line x1={PL} y1={bottomY} x2={W - PR} y2={bottomY} stroke="#E5E7EB" strokeWidth="1.5" />

          {ticks.map((v) => {
            const sx = toX(v)
            return (
              <g key={v}>
                <line x1={sx} y1={bottomY} x2={sx} y2={bottomY + 3} stroke="#D1D5DB" strokeWidth="1" />
                <text x={sx} y={bottomY + 11} textAnchor="middle" fontSize="7.5" fill="#6B7280">{v.toFixed(1)}</text>
                {levelLabels[v] && (
                  <text x={sx} y={bottomY + 21} textAnchor="middle" fontSize="6.5" fill="#6B7280" fontStyle="italic">
                    {levelLabels[v]}
                  </text>
                )}
              </g>
            )
          })}

          <text x={PL + chartW / 2} y={H - 1} textAnchor="middle" fontSize="7.5" fill="#6B7280" letterSpacing="0.3">
            Competency Score (0–3 scale)
          </text>
        </svg>
      </div>

      <div className="flex items-center gap-5 mt-3 flex-wrap" aria-hidden="true">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00A3E0]" />
          <span className="text-[11px] text-gray-600">Your Results</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#9CA3AF]" />
          <span className="text-[11px] text-gray-600">National Average</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-3 rounded-sm" style={{ background: 'rgba(0,163,224,0.22)' }} />
          <span className="text-[11px] text-gray-600">Middle 68% of peers</span>
        </div>
      </div>
    </div>
  )
}
