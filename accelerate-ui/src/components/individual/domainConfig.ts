/**
 * Domain configuration mapping API domain names to visual properties.
 * Colors match Tim's Base44 prototype design tokens.
 */
import {
  Award, ShieldAlert, Settings2, BarChart3,
  FileCheck, Globe, Cpu, Users
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface DomainConfig {
  slug: string
  color: string
  icon: LucideIcon
}

/** Maps API domainName → visual config. Keys must match GapAnalysis.gaps[].domainName exactly. */
export const DOMAIN_CONFIG: Record<string, DomainConfig> = {
  'Quality Leadership and Integration':      { slug: 'quality-leadership',        color: '#003DA5', icon: Award },
  'Patient Safety':                          { slug: 'patient-safety',            color: '#ED1C24', icon: ShieldAlert },
  'Performance and Process Improvement':     { slug: 'performance-improvement',   color: '#00B5E2', icon: Settings2 },
  'Health Data Analytics':                   { slug: 'health-data-analytics',     color: '#F68B1F', icon: BarChart3 },
  'Regulatory and Accreditation':            { slug: 'regulatory-accreditation',  color: '#6B4C9A', icon: FileCheck },
  'Population Health and Care Transitions':  { slug: 'population-health',         color: '#8BC53F', icon: Globe },
  'Healthcare Technology and Innovation':    { slug: 'healthcare-technology',     color: '#5B2D8E', icon: Cpu },
  'Professional Engagement':                 { slug: 'professional-engagement',   color: '#00A3E0', icon: Users },
  'Quality Review and Accountability':       { slug: 'quality-review',            color: '#99154B', icon: FileCheck },
}

export function getDomainConfig(domainName: string): DomainConfig {
  return DOMAIN_CONFIG[domainName] ?? { slug: 'unknown', color: '#9CA3AF', icon: Award }
}

export function levelLabel(score: number): string {
  if (score <= 1.6) return 'Foundational'
  if (score <= 2.3) return 'Proficient'
  return 'Advanced'
}

export function levelColor(score: number): { bg: string; text: string } {
  if (score <= 1.6) return { bg: '#FEF3C7', text: '#D97706' }
  if (score <= 2.3) return { bg: '#D1FAE5', text: '#059669' }
  return { bg: '#DBEAFE', text: '#2563EB' }
}
