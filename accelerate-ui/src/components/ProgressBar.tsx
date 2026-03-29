interface ProgressBarProps {
  value: number
  max?: number
  color?: string
  label?: string
  sublabel?: string
}

export function ProgressBar({ value, max = 100, color, label, sublabel }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const displayColor = color || (pct >= 75 ? 'var(--cyan-primary)' : pct >= 50 ? '#F68B1F' : '#ED1C24')

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <div>
            <span className="font-medium text-nahq-charcoal">{label}</span>
            {sublabel && <span className="text-sm text-nahq-gray ml-2">{sublabel}</span>}
          </div>
          <span className="text-lg font-bold" style={{ color: displayColor }}>{Math.round(pct)}%</span>
        </div>
      )}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: displayColor }}
        />
      </div>
    </div>
  )
}
