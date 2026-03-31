/**
 * Ported from Tim's Base44 prototype: Individual Experience v03
 * Circular SVG gauge showing score, target, gap, and course count.
 * Adapted to TypeScript with live API data.
 */
import { CheckCircle2 } from 'lucide-react'
import { levelColor, levelLabel } from './domainConfig'

export interface CompetencyProgressGaugeProps {
  score: number
  roleTarget: number
  domainColor: string
  coursesCount: number
}

export function CompetencyProgressGauge({
  score,
  roleTarget,
  domainColor: _domainColor,
  coursesCount,
}: CompetencyProgressGaugeProps) {
  const compGap = Math.max(0, roleTarget - score)
  const scorePct = (score / 3) * 100
  const lc = levelColor(score)

  const radius = 50
  const circumference = 2 * Math.PI * radius
  const arcLength = (scorePct / 100) * circumference

  const gapDescription =
    compGap > 0 ? `${compGap.toFixed(1)} below target` : 'Target met'

  const srLabel = `Score: ${score.toFixed(1)} out of 3. NAHQ target: ${roleTarget}. ${gapDescription}. Recommended courses: ${coursesCount}.`

  return (
    <div className="space-y-5">
      {/* Screen reader summary */}
      <p className="sr-only">{srLabel}</p>

      <div className="flex items-center gap-8" aria-hidden="true">
        {/* Circular Progress Gauge */}
        <div className="flex-shrink-0 relative w-32 h-32">
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full transform -rotate-90"
            focusable="false"
          >
            {/* Background track */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Score arc */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={lc.text}
              strokeWidth="8"
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.3s ease' }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-[#3D3D3D] leading-none">
              {score.toFixed(1)}
            </p>
            <p className="text-[9px] text-gray-500 font-semibold mt-0.5">
              Your Results
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex-1">
          <div className="flex items-start gap-4">
            {/* NAHQ Target */}
            <div className="flex-1">
              <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold mb-1.5">
                NAHQ Target
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-[#3D3D3D]">
                  {roleTarget}
                </span>
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: levelColor(roleTarget).bg,
                    color: levelColor(roleTarget).text,
                  }}
                >
                  {levelLabel(roleTarget)}
                </span>
              </div>
            </div>

            <div className="w-px h-12 bg-gray-200" />

            {/* Distance to Standard */}
            <div className="flex-1">
              <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold mb-1.5">
                Dist. to Std
              </p>
              <div className="flex items-center gap-2">
                {compGap > 0 ? (
                  <p className="text-lg font-bold text-red-600">
                    &minus;{compGap.toFixed(1)}
                  </p>
                ) : (
                  <div className="flex items-center gap-1">
                    <CheckCircle2
                      aria-hidden="true"
                      className="w-4 h-4 text-green-500"
                    />
                    <span className="text-[10px] font-semibold text-green-700">
                      Met
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="w-px h-12 bg-gray-200" />

            {/* Courses */}
            <div className="flex-1">
              <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold mb-1.5">
                Courses
              </p>
              <p className="text-lg font-bold text-[#3D3D3D]">
                {coursesCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
