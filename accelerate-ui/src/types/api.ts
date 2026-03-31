// Types derived from the accelerate-api OpenAPI spec

export interface CompetencyDomain {
  id: number
  name: string
  description: string
  displayOrder: number
  competencies: Competency[]
}

export interface Competency {
  id: number
  name: string
  description: string
  displayOrder: number
}

export interface RoleType {
  id: number
  name: string
  internalId: string
  description: string
}

export interface CompetencyGap {
  competencyId: number
  competencyName: string
  domainName: string
  score: number
  target: number
  gap: number
  targetLevel: string
  rank: number
}

export interface GapAnalysis {
  userId: number
  userName: string
  roleName: string
  frameworkVersion: string
  gaps: CompetencyGap[]
  overallScore: number
  overallTarget: number
  overallGap: number
}

export interface CompetencyBenchmark {
  competencyId: number
  competencyName: string
  domainName: string
  userScore: number
  nationalP25: number
  nationalP50: number
  nationalP75: number
  nationalP90: number
  nationalMean: number
  percentileLabel: string
  sampleSize: number
}

export interface BenchmarkComparison {
  userId: number
  userName: string
  roleName: string
  competencies: CompetencyBenchmark[]
  queryTimeMs: number
}

export interface DomainSummary {
  domainId: number
  domainName: string
  orgAvgScore: number
  nationalP50: number
  nationalMean: number
  participantCount: number
  vsNational: string
}

export interface OrgCapabilitySummary {
  organizationId: number
  organizationName: string
  domains: DomainSummary[]
  overallOrgAvg: number
  overallNationalAvg: number
  totalParticipants: number
  queryTimeMs: number
}

export interface SimilarCourse {
  courseId: number
  title: string
  description: string
  durationHours: number
  ceEligible: boolean
  relevanceScore: number
  matchType: string
}

export interface CourseSimilarity {
  competencyId: number | null
  competencyName: string
  domainName: string
  courses: SimilarCourse[]
  queryTimeMs: number
}

export interface PlatformStats {
  organizations: number
  users: number
  courses: number
  domains: number
  competencies: number
}

export interface OrgSite {
  id: number
  name: string
  orgType: string
  city: string | null
  state: string | null
}

export interface OrgStats {
  totalUsers: number
  assessmentsCompleted: number
  assessmentsNotStarted: number
  completionPercent: number
  lastAssessmentDate: string | null
}

export interface CompetencyMatrixDomain {
  domainName: string
  avgScore: number
}

export interface CompetencyMatrixGroup {
  name: string
  id: number
  participantCount: number
  domains: CompetencyMatrixDomain[]
}

export interface CompetencyMatrix {
  organizationId: number
  groupBy: string
  groups: CompetencyMatrixGroup[]
  queryTimeMs: number
}
