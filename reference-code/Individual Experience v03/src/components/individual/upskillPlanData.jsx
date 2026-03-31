// Shared data / constants for the Upskill Plan feature
import {
  getPrioritizedCompetencies,
  generatePlan,
  COURSE_CATALOG,
  COMPETENCIES,
  DOMAINS,
} from './individualMockData';

export { COMPETENCIES, DOMAINS };

const _prioritized = getPrioritizedCompetencies();
const { courses: PLAN_COURSES, totalHours: PLAN_TOTAL_HOURS } = generatePlan(_prioritized, COURSE_CATALOG, 18);

// Mock statuses: c4 = complete, c1 = in_progress, rest = not_started
const MOCK_STATUSES = { c1: 'in_progress', c4: 'complete', c10: 'complete' };

export { PLAN_COURSES, PLAN_TOTAL_HOURS, MOCK_STATUSES, _prioritized as PRIORITIZED_COMPETENCIES };