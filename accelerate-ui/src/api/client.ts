import type { AuthUser } from './auth'
import type * as T from '../types/api'

function getStoredUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem('nahq_user')
    return stored ? JSON.parse(stored) : null
  } catch { return null }
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const user = getStoredUser()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options?.headers as Record<string, string>,
  }

  if (user) {
    // Admin users get API key, others get user impersonation
    if (user.roles.includes('admin')) {
      headers['X-Api-Key'] = 'nahq-sandbox-2026'
    } else {
      headers['X-User-Id'] = String(user.userId)
    }
  }

  const res = await fetch(path, { ...options, headers })
  if (res.status === 401 || res.status === 403) {
    // Stale or invalid session — clear auth and redirect to login
    localStorage.removeItem('nahq_user')
    window.location.href = '/login'
    throw new Error('Session expired')
  }
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
  return res.json()
}

export const api = {
  competencies: () => apiFetch<T.CompetencyDomain[]>('/api/competencies'),
  roles: () => apiFetch<T.RoleType[]>('/api/roles'),
  userGaps: (userId: number) => apiFetch<T.GapAnalysis>(`/api/users/${userId}/gaps`),
  userBenchmarks: (userId: number) => apiFetch<T.BenchmarkComparison>(`/api/users/${userId}/benchmarks`),
  userCourses: (userId: number, topGaps = 3) => apiFetch<T.CourseSimilarity>(`/api/users/${userId}/recommended-courses?topGaps=${topGaps}`),
  orgCapability: (orgId: number) => apiFetch<T.OrgCapabilitySummary>(`/api/organizations/${orgId}/capability-summary`),
  seed: (count = 100) => apiFetch<Record<string, number>>(`/api/seed/generate?userCount=${count}`, { method: 'POST' }),
  seedCourses: () => apiFetch<Record<string, number>>('/api/courses/seed', { method: 'POST' }),
  refreshViews: () => apiFetch<Record<string, number>>('/api/analytics/refresh', { method: 'POST' }),
  aiSummary: (userId: number) => apiFetch<Record<string, unknown>>(`/api/ai/individual-summary/${userId}`, { method: 'POST' }),
  aiUpskillPlan: (userId: number) => apiFetch<Record<string, unknown>>(`/api/ai/upskill-plan/${userId}`, { method: 'POST' }),
  aiOrgInsights: (orgId: number) => apiFetch<Record<string, unknown>>(`/api/ai/org-insights/${orgId}`, { method: 'POST' }),
  aiAsk: (prompt: string, userId?: number, orgId?: number) =>
    apiFetch<Record<string, unknown>>('/api/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ prompt, userId: userId ?? null, orgId: orgId ?? null }),
    }),
  aiGenerations: (userId: number) => apiFetch<Array<Record<string, unknown>>>(`/api/ai/generations/${userId}`),
  platformStats: () => apiFetch<T.PlatformStats>('/api/stats/platform'),
  orgStats: (orgId: number) => apiFetch<T.OrgStats>(`/api/organizations/${orgId}/stats`),
  orgSites: (orgId: number) => apiFetch<T.OrgSite[]>(`/api/organizations/${orgId}/sites`),
  competencyMatrix: (orgId: number, groupBy: 'site' | 'role' = 'site') =>
    apiFetch<T.CompetencyMatrix>(`/api/organizations/${orgId}/competency-matrix?groupBy=${groupBy}`),
}
