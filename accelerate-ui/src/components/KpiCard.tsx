interface KpiCardProps {
  label: string
  value: string | number
  subtitle?: string
  color?: string
}

export function KpiCard({ label, value, subtitle, color }: KpiCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="text-xs font-semibold text-nahq-gray tracking-wider mb-2">{label}</div>
      <div className="text-3xl font-bold" style={{ color: color || 'var(--cyan-primary)' }}>
        {value}
      </div>
      {subtitle && <div className="text-sm text-nahq-gray mt-1">{subtitle}</div>}
    </div>
  )
}
