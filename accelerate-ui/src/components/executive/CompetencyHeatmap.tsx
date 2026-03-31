/**
 * CompetencyHeatmap — site x domain color-coded matrix
 *
 * Renders a table where rows = hospital sites, columns = competency domains,
 * cells = color-coded average scores on the 0-3 NAHQ scale.
 */
import { useState } from 'react'
import type { CompetencyMatrix } from '../../types/api'

interface CompetencyHeatmapProps {
  matrix: CompetencyMatrix | null
  nationalAverages?: Record<string, number> // domainName → national avg for reference
}

interface TooltipInfo {
  site: string
  domain: string
  score: number | null
  participants: number
}

function shortenDomain(name: string): string {
  const words = name.split(' ')
  return words.length <= 2 ? name : words.slice(0, 2).join(' ')
}

function cellStyle(score: number | null): { bg: string; text: string } {
  if (score === null) return { bg: '#F3F4F6', text: '#9CA3AF' }
  if (score >= 2.5) return { bg: '#D1FAE5', text: '#065F46' }
  if (score >= 1.5) return { bg: '#FEF9C3', text: '#713F12' }
  if (score >= 0.5) return { bg: '#FFEDD5', text: '#7C2D12' }
  return { bg: '#FEE2E2', text: '#991B1B' }
}

function levelLabel(score: number | null): string {
  if (score === null) return 'No data'
  if (score >= 2.5) return 'Advanced'
  if (score >= 1.5) return 'Proficient'
  if (score >= 0.5) return 'Foundational'
  return 'Below Foundational'
}

const LEGEND_ITEMS = [
  { label: 'Advanced (2.5-3.0)', bg: '#D1FAE5', text: '#065F46' },
  { label: 'Proficient (1.5-2.5)', bg: '#FEF9C3', text: '#713F12' },
  { label: 'Foundational (0.5-1.5)', bg: '#FFEDD5', text: '#7C2D12' },
  { label: 'Below Foundational (<0.5)', bg: '#FEE2E2', text: '#991B1B' },
  { label: 'No data', bg: '#F3F4F6', text: '#9CA3AF' },
]

export function CompetencyHeatmap({ matrix, nationalAverages }: CompetencyHeatmapProps) {
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null)

  if (!matrix || matrix.groups.length === 0) return null

  // Collect all unique domain names from the first group (all groups share the same domains)
  const domainNames = matrix.groups[0].domains.map(d => d.domainName)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-[#3D3D3D]">Competency Heatmap</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Average scores by hospital site and competency domain
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {LEGEND_ITEMS.map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: item.bg, border: '1px solid rgba(0,0,0,0.06)' }}
            />
            <span className="text-xs text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table
          className="border-separate w-full"
          style={{ borderSpacing: '3px' }}
        >
          <thead>
            <tr className="sticky top-0 z-10">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2 bg-[#F8F9FB] rounded-lg min-w-[160px]">
                Site
              </th>
              {domainNames.map(name => (
                <th
                  key={name}
                  className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-2 bg-[#F8F9FB] rounded-lg min-w-[90px]"
                  title={name}
                >
                  {shortenDomain(name)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.groups.map(group => (
              <tr key={group.id}>
                <td className="text-sm font-medium text-[#3D3D3D] px-3 py-2 bg-white rounded-lg whitespace-nowrap">
                  <div className="flex flex-col">
                    <span>{group.name}</span>
                    <span className="text-xs text-gray-400 font-normal">
                      {group.participantCount} participant{group.participantCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </td>
                {domainNames.map(domainName => {
                  const domainData = group.domains.find(d => d.domainName === domainName)
                  const score = domainData?.avgScore ?? null
                  const style = cellStyle(score)

                  return (
                    <td
                      key={domainName}
                      className="text-center rounded-lg h-12 cursor-default transition-transform hover:scale-105"
                      style={{ backgroundColor: style.bg }}
                      onMouseEnter={() =>
                        setTooltip({
                          site: group.name,
                          domain: domainName,
                          score,
                          participants: group.participantCount,
                        })
                      }
                      onMouseLeave={() => setTooltip(null)}
                    >
                      <span
                        className="text-sm font-bold"
                        style={{ color: style.text }}
                      >
                        {score !== null ? score.toFixed(2) : '—'}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}

            {/* National Average reference row */}
            {nationalAverages && Object.keys(nationalAverages).length > 0 && (
              <tr>
                <td className="text-sm font-medium text-gray-400 italic px-3 py-2 bg-white rounded-lg whitespace-nowrap">
                  National Average
                </td>
                {domainNames.map(domainName => {
                  const natAvg = nationalAverages[domainName] ?? null
                  return (
                    <td
                      key={domainName}
                      className="text-center rounded-lg h-12"
                      style={{ backgroundColor: '#F8F9FB' }}
                    >
                      <span className="text-sm font-medium text-gray-500">
                        {natAvg !== null ? natAvg.toFixed(2) : '—'}
                      </span>
                    </td>
                  )
                })}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tooltip bar */}
      <div
        className="mt-4 h-8 flex items-center gap-6 px-4 rounded-lg text-xs transition-opacity duration-150"
        style={{
          backgroundColor: tooltip ? '#F8F9FB' : 'transparent',
          opacity: tooltip ? 1 : 0,
        }}
      >
        {tooltip && (
          <>
            <span className="text-gray-500">
              Site: <strong className="text-[#3D3D3D]">{tooltip.site}</strong>
            </span>
            <span className="text-gray-500">
              Domain: <strong className="text-[#3D3D3D]">{tooltip.domain}</strong>
            </span>
            <span className="text-gray-500">
              Score:{' '}
              <strong
                style={{ color: cellStyle(tooltip.score).text }}
              >
                {tooltip.score !== null ? `${tooltip.score.toFixed(2)} (${levelLabel(tooltip.score)})` : 'No data'}
              </strong>
            </span>
            <span className="text-gray-500">
              Participants: <strong className="text-[#3D3D3D]">{tooltip.participants}</strong>
            </span>
          </>
        )}
      </div>
    </div>
  )
}
