// API client — all calls go through Vite proxy to localhost:4003

const API_KEY = 'nahq-sandbox-2026'

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      'X-Api-Key': API_KEY,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
  return res.json()
}

export function fetchAsUser<T>(path: string, userId: number): Promise<T> {
  return apiFetch(path, { headers: { 'X-User-Id': String(userId), 'X-Api-Key': '' } })
}

export const api = {
  competencies: () => apiFetch<import('../types/api').CompetencyDomain[]>('/api/competencies'),
  roles: () => apiFetch<import('../types/api').RoleType[]>('/api/roles'),
  userGaps: (userId: number) => apiFetch<import('../types/api').GapAnalysis>(`/api/users/${userId}/gaps`),
  userBenchmarks: (userId: number) => apiFetch<import('../types/api').BenchmarkComparison>(`/api/users/${userId}/benchmarks`),
  userCourses: (userId: number, topGaps = 3) => apiFetch<import('../types/api').CourseSimilarity>(`/api/users/${userId}/recommended-courses?topGaps=${topGaps}`),
  orgCapability: (orgId: number) => apiFetch<import('../types/api').OrgCapabilitySummary>(`/api/organizations/${orgId}/capability-summary`),
  seed: (count = 100) => apiFetch<Record<string, number>>(`/api/seed/generate?userCount=${count}`, { method: 'POST' }),
  seedCourses: () => apiFetch<Record<string, number>>('/api/courses/seed', { method: 'POST' }),
  refreshViews: () => apiFetch<Record<string, number>>('/api/analytics/refresh', { method: 'POST' }),
  aiSummary: (userId: number) => apiFetch<Record<string, unknown>>(`/api/ai/individual-summary/${userId}`, { method: 'POST' }),
  aiUpskillPlan: (userId: number) => apiFetch<Record<string, unknown>>(`/api/ai/upskill-plan/${userId}`, { method: 'POST' }),
  aiOrgInsights: (orgId: number) => apiFetch<Record<string, unknown>>(`/api/ai/org-insights/${orgId}`, { method: 'POST' }),
}
