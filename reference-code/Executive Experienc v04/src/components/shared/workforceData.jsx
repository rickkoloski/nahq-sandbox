// ─── Single source of truth for all workforce data ───────────────────────────

export const ROLE_TARGETS = {
  'Director of Quality': 2.3,
  'Quality Manager': 2.1,
  'Quality Specialist': 1.8,
  'Quality Analyst': 1.9,
};

export const DOMAIN_COLORS = {
  'Professional Engagement': '#7B1FA2',
  'Quality Leadership and Integration': '#1E5BB8',
  'Performance and Process Improvement': '#0F6C74',
  'Population Health and Care Transitions': '#2E7D32',
  'Health Data Analytics': '#8A6D3B',
  'Patient Safety': '#E67E22',
  'Regulatory and Accreditation': '#C62828',
  'Quality Review and Accountability': '#AD1457',
};

export const WFA_BENCHMARK_PCT = 60;

// The 10 users assessed across all competencies
export const USERS = [
  { name: 'Sarah Chen',        role: 'Director of Quality', site: 'Main Campus'  },
  { name: 'James Rodriguez',   role: 'Quality Manager',     site: 'Main Campus'  },
  { name: 'Maria Garcia',      role: 'Director of Quality', site: 'North Campus' },
  { name: 'David Kim',         role: 'Quality Specialist',  site: 'North Campus' },
  { name: 'Jennifer Lee',      role: 'Director of Quality', site: 'South Clinic' },
  { name: 'Michael Brown',     role: 'Quality Manager',     site: 'South Clinic' },
  { name: 'Patricia Johnson',  role: 'Quality Manager',     site: 'Main Campus'  },
  { name: 'Robert Wilson',     role: 'Quality Specialist',  site: 'North Campus' },
  { name: 'Linda Martinez',    role: 'Director of Quality', site: 'South Clinic' },
  { name: 'Christopher Davis', role: 'Quality Manager',     site: 'Main Campus'  },
];

function makeUsers(scores) {
  return USERS.map((u, i) => ({ ...u, score: scores[i] }));
}

export const COMPETENCY_DATA = {
  'Professional Engagement': [
    { name: 'Integrate ethical standards into healthcare quality practice',  users: makeUsers([2.8, 1.6, 2.7, 1.9, 2.8, 1.7, 2.7, 1.8, 2.8, 1.9]) },
    { name: 'Engage in lifelong learning as a healthcare quality professional', users: makeUsers([2.5, 1.3, 2.6, 1.6, 2.7, 1.4, 2.5, 1.5, 2.6, 1.6]) },
    { name: 'Participate in activities that advance the healthcare quality profession', users: makeUsers([2.3, 1.1, 2.4, 1.4, 2.5, 1.2, 2.3, 1.3, 2.4, 1.4]) },
  ],
  'Quality Leadership and Integration': [
    { name: 'Direct the quality infrastructure to achieve organizational objectives',          users: makeUsers([2.8, 1.5, 2.9, 1.8, 2.9, 1.7, 2.8, 1.4, 2.9, 1.9]) },
    { name: 'Apply procedures to regulate the use of privileged or confidential information',  users: makeUsers([2.6, 1.4, 2.7, 1.7, 2.8, 1.5, 2.7, 1.6, 2.8, 1.8]) },
    { name: 'Implement processes to promote stakeholder engagement and interprofessional teamwork', users: makeUsers([2.7, 1.3, 2.8, 1.6, 2.9, 1.4, 2.6, 1.5, 2.8, 1.7]) },
    { name: 'Create learning opportunities to advance healthcare quality throughout the organization', users: makeUsers([2.5, 1.2, 2.6, 1.5, 2.7, 1.3, 2.5, 1.4, 2.7, 1.6]) },
    { name: 'Communicate effectively with different audiences to achieve quality goals',        users: makeUsers([2.4, 1.1, 2.5, 1.4, 2.6, 1.2, 2.4, 1.3, 2.6, 1.5]) },
  ],
  'Performance and Process Improvement': [
    { name: 'Implement standard performance and process improvement (PPI) methods', users: makeUsers([2.7, 1.3, 2.8, 1.6, 2.9, 1.4, 2.6, 1.5, 2.8, 1.8]) },
    { name: 'Apply project management methods',                                      users: makeUsers([2.5, 1.1, 2.6, 1.4, 2.7, 1.2, 2.4, 1.3, 2.6, 1.5]) },
    { name: 'Use change management principles and tools',                            users: makeUsers([2.3, 1.0, 2.4, 1.3, 2.5, 1.1, 2.2, 1.2, 2.4, 1.4]) },
  ],
  'Population Health and Care Transitions': [
    { name: 'Integrate population health management strategies into quality work', users: makeUsers([2.7, 1.4, 2.8, 1.7, 2.8, 1.5, 2.7, 1.6, 2.9, 1.8]) },
    { name: 'Apply a holistic approach to improvement',                            users: makeUsers([2.4, 1.1, 2.5, 1.4, 2.6, 1.2, 2.3, 1.3, 2.5, 1.5]) },
    { name: 'Collaborate with stakeholders to improve care processes and transitions', users: makeUsers([2.3, 1.0, 2.4, 1.3, 2.5, 1.1, 2.2, 1.2, 2.4, 1.4]) },
  ],
  'Health Data Analytics': [
    { name: 'Apply procedures for the governance of data assets',              users: makeUsers([2.5, 1.1, 2.6, 1.4, 2.7, 1.2, 2.4, 1.3, 2.5, 1.5]) },
    { name: 'Design data collection plans for key metrics and performance indicators', users: makeUsers([2.4, 1.0, 2.5, 1.3, 2.6, 1.1, 2.3, 1.2, 2.4, 1.4]) },
    { name: 'Acquire data from source systems',                                users: makeUsers([2.3, 1.0, 2.4, 1.2, 2.5, 1.0, 2.2, 1.1, 2.3, 1.2]) },
    { name: 'Integrate data from internal and external electronic data systems', users: makeUsers([2.2, 0.9, 2.3, 1.1, 2.4, 1.0, 2.1, 1.0, 2.2, 1.2]) },
    { name: 'Use statistical and visualization methods',                       users: makeUsers([2.1, 0.8, 2.2, 1.0, 2.3, 0.9, 2.0, 1.0, 2.1, 1.1]) },
  ],
  'Patient Safety': [
    { name: "Assess the organization's patient safety culture",                users: makeUsers([2.8, 1.7, 2.7, 2.0, 2.8, 1.6, 2.7, 1.9, 2.9, 1.8]) },
    { name: 'Apply safety science principles and methods in healthcare quality work', users: makeUsers([2.7, 1.5, 2.8, 1.9, 2.9, 1.6, 2.6, 1.8, 2.8, 1.9]) },
    { name: 'Use organizational procedures to identify and report patient safety risks and events', users: makeUsers([2.6, 1.4, 2.7, 1.8, 2.8, 1.5, 2.5, 1.7, 2.7, 1.7]) },
    { name: 'Collaborate with stakeholders to analyze patient safety risks and events', users: makeUsers([2.5, 1.3, 2.6, 1.7, 2.7, 1.4, 2.4, 1.6, 2.6, 1.6]) },
  ],
  'Regulatory and Accreditation': [
    { name: 'Operationalize processes to support compliance with regulations and standards', users: makeUsers([2.8, 1.7, 2.7, 1.9, 2.8, 1.6, 2.7, 1.8, 2.9, 1.9]) },
    { name: 'Facilitate continuous survey readiness activities',               users: makeUsers([2.7, 1.6, 2.7, 1.8, 2.8, 1.5, 2.6, 1.7, 2.8, 1.8]) },
    { name: 'Guide the organization through survey processes and findings',    users: makeUsers([2.6, 1.5, 2.6, 1.7, 2.7, 1.4, 2.5, 1.6, 2.7, 1.7]) },
  ],
  'Quality Review and Accountability': [
    { name: 'Relate current and emerging payment models to healthcare quality work', users: makeUsers([2.7, 1.5, 2.8, 1.8, 2.8, 1.6, 2.7, 1.7, 2.7, 1.8]) },
    { name: 'Conduct the activities to execute measure requirements',          users: makeUsers([2.8, 1.6, 2.9, 1.9, 2.9, 1.7, 2.8, 1.8, 2.8, 1.9]) },
    { name: 'Implement processes to facilitate practitioner performance review activities', users: makeUsers([2.6, 1.4, 2.7, 1.7, 2.7, 1.5, 2.6, 1.6, 2.6, 1.7]) },
  ],
};

// ─── Shared helpers ───────────────────────────────────────────────────────────

export function getUniqueUsers(domainName) {
  const comps = COMPETENCY_DATA[domainName] || [];
  const byName = {};
  comps.forEach(c => c.users.forEach(u => { if (!byName[u.name]) byName[u.name] = u; }));
  return Object.values(byName);
}

export function computeMetrics(users) {
  if (!users || !users.length) return { readiness: 0, avgDist: 0, metCount: 0 };
  let met = 0, totalDist = 0;
  users.forEach(u => {
    const t = ROLE_TARGETS[u.role] || 2.0;
    if (Math.round((u.score / t) * 100) >= 90) met++;
    totalDist += Math.max(0, t - u.score);
  });
  return {
    readiness: Math.round((met / users.length) * 100),
    avgDist: parseFloat((totalDist / users.length).toFixed(2)),
    metCount: met,
  };
}

export function computeDomainSummary(domainName) {
  const uniqueUsers = getUniqueUsers(domainName);
  const allUsers = (COMPETENCY_DATA[domainName] || []).reduce((acc, c) => [...acc, ...c.users], []);
  const { readiness, avgDist, metCount } = computeMetrics(uniqueUsers);
  const needsPriority = uniqueUsers.length - metCount;
  return { readiness, avgDist, needsPriority, metCount, totalUsers: uniqueUsers.length, allUsers };
}

// Pre-computed domain rows for the dashboard sorted worst-first
export const DOMAIN_ROWS = Object.keys(COMPETENCY_DATA).map(name => {
  const { readiness, avgDist } = computeDomainSummary(name);
  return { name, readiness, dist: avgDist, color: DOMAIN_COLORS[name] || '#00A3E0' };
}).sort((a, b) => a.readiness - b.readiness);