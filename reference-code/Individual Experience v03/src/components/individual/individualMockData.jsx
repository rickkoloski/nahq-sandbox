// ─── Mock data & business logic for Individual User experience ───────────────

export const INDIVIDUAL_USER = {
  name: 'Jordan Taylor',
  role: 'Clinical Quality Bridge',
  site: 'Main Campus',
  assessmentDate: 'January 14, 2026',
  peerGroup: 'Similar Role Level',
};

export const DOMAINS = [
  { slug: 'quality-leadership',        name: 'Quality Leadership & Integration',      color: '#2D2D7F', weight: 1.2, roleTarget: 3 },
  { slug: 'patient-safety',            name: 'Patient Safety',                        color: '#C85A00', weight: 1.1, roleTarget: 3 },
  { slug: 'performance-improvement',   name: 'Performance & Process Improvement',     color: '#006B7A', weight: 1.0, roleTarget: 2 },
  { slug: 'health-data-analytics',     name: 'Health Data Analytics',                 color: '#7A5C2E', weight: 1.1, roleTarget: 2 },
  { slug: 'regulatory-accreditation',  name: 'Regulatory & Accreditation',            color: '#B01C1C', weight: 0.9, roleTarget: 2 },
  { slug: 'population-health',         name: 'Population Health & Care Transitions',  color: '#1A5C2A', weight: 0.9, roleTarget: 3 },
  { slug: 'healthcare-technology',     name: 'Healthcare Technology & Innovation',    color: '#5B2D8E', weight: 1.0, roleTarget: 2 },
  { slug: 'professional-engagement',   name: 'Professional Engagement',               color: '#9C0070', weight: 0.8, roleTarget: 3 },
];

export const COMPETENCIES = [
  // Quality Leadership
  { slug: 'lead-quality-initiatives',   domainSlug: 'quality-leadership',       name: 'Lead and sponsor quality initiatives',
    currentLevel: 1, score: 1, nextLevel: 2, roleTarget: 3, percentile: 41,
    behaviors: {
      current: ['Participates in quality improvement meetings', 'Follows established QI protocols', 'Tracks basic metrics with supervisor guidance'],
      next:    ['Independently leads small-scale QI projects',  'Facilitates cross-functional team meetings', 'Monitors and reports QI outcomes proactively']
    }
  },
  { slug: 'foster-improvement-culture', domainSlug: 'quality-leadership',       name: 'Foster a culture of continuous improvement',
    currentLevel: 2, score: 2, nextLevel: 3, roleTarget: 3, percentile: 62,
    behaviors: {
      current: ['Encourages peers to surface improvement ideas', 'Facilitates unit-level huddles', 'Recognizes team improvement efforts'],
      next:    ['Champions org-wide improvement culture',        'Coaches others in QI methodology',  'Links improvement work to strategic goals']
    }
  },
  { slug: 'cross-functional-teams',     domainSlug: 'quality-leadership',       name: 'Build and sustain cross-functional teams',
    currentLevel: 1, score: 1, nextLevel: 2, roleTarget: 2, percentile: 33,
    behaviors: {
      current: ['Participates in cross-functional teams', 'Communicates effectively across departments'],
      next:    ['Assembles and charters cross-functional teams', 'Resolves team conflicts', 'Maintains engagement across team lifecycle']
    }
  },
  // Patient Safety
  { slug: 'safe-environment',           domainSlug: 'patient-safety',           name: 'Create and maintain a safe environment',
    currentLevel: 2, score: 2, nextLevel: 3, roleTarget: 3, percentile: 71,
    behaviors: {
      current: ['Identifies environmental hazards', 'Reports near-miss events', 'Participates in safety rounding'],
      next:    ['Designs safety checklists and protocols', 'Analyzes environmental risk proactively', 'Leads safety culture initiatives']
    }
  },
  { slug: 'safety-risk-mitigation',     domainSlug: 'patient-safety',           name: 'Identify and mitigate patient safety risks',
    currentLevel: 1, score: 1, nextLevel: 2, roleTarget: 2, percentile: 28,
    behaviors: {
      current: ['Reports safety events through proper channels', 'Applies SBAR communication'],
      next:    ['Conducts root cause analysis', 'Designs risk mitigation workflows', 'Tracks safety metrics over time']
    }
  },
  // Performance Improvement
  { slug: 'data-improvement-opps',      domainSlug: 'performance-improvement',  name: 'Use data to identify improvement opportunities',
    currentLevel: 1, score: 1, nextLevel: 2, roleTarget: 2, percentile: 35,
    behaviors: {
      current: ['Reads and interprets basic run charts', 'Participates in data review meetings'],
      next:    ['Independently analyzes improvement data', 'Presents data-driven recommendations', 'Selects appropriate improvement measures']
    }
  },
  { slug: 'implement-improvement',      domainSlug: 'performance-improvement',  name: 'Plan and implement improvement initiatives',
    currentLevel: 2, score: 2, nextLevel: 3, roleTarget: 3, percentile: 58,
    behaviors: {
      current: ['Uses PDSA cycles for small tests of change', 'Documents improvement work', 'Engages stakeholders in improvement planning'],
      next:    ['Manages complex multi-cycle improvement projects', 'Scales tested changes across units', 'Builds sustainability plans']
    }
  },
  // Health Data Analytics
  { slug: 'data-governance',            domainSlug: 'health-data-analytics',    name: 'Apply procedures for governance of data assets',
    currentLevel: 1, score: 1, nextLevel: 2, roleTarget: 2, percentile: 47,
    behaviors: {
      current: ['Understands data privacy basics', 'Follows data access protocols'],
      next:    ['Applies data governance frameworks', 'Participates in data stewardship committees', 'Ensures data quality standards']
    }
  },
  { slug: 'acquire-data',               domainSlug: 'health-data-analytics',    name: 'Acquire data from source systems',
    currentLevel: 1, score: 1, nextLevel: 2, roleTarget: 2, percentile: 39,
    behaviors: {
      current: ['Runs standard reports from EHR', 'Exports data to spreadsheets'],
      next:    ['Queries multiple source systems', 'Validates data integrity across sources', 'Documents data acquisition processes']
    }
  },
  // Regulatory
  { slug: 'regulatory-requirements',    domainSlug: 'regulatory-accreditation', name: 'Understand regulatory requirements',
    currentLevel: 2, score: 2, nextLevel: 3, roleTarget: 3, percentile: 66,
    behaviors: {
      current: ['Knows applicable regulations for role', 'Stays current on regulatory updates', 'Completes required compliance training'],
      next:    ['Interprets complex regulatory guidance', 'Advises teams on compliance implications', 'Leads regulatory readiness planning']
    }
  },
  // Population Health
  { slug: 'care-transitions',           domainSlug: 'population-health',        name: 'Manage care transitions effectively',
    currentLevel: 2, score: 2, nextLevel: 3, roleTarget: 3, percentile: 54,
    behaviors: {
      current: ['Coordinates handoffs using structured tools', 'Communicates transition plans to patients'],
      next:    ['Designs care transition programs', 'Analyzes transition outcomes data', 'Reduces readmission through systematic interventions']
    }
  },
  // Technology
  { slug: 'health-informatics',         domainSlug: 'healthcare-technology',    name: 'Apply health informatics principles',
    currentLevel: 1, score: 1, nextLevel: 2, roleTarget: 2, percentile: 42,
    behaviors: {
      current: ['Uses EHR effectively for clinical documentation', 'Understands basic informatics concepts'],
      next:    ['Configures clinical decision support rules', 'Evaluates informatics tools for quality use', 'Trains others in health informatics applications']
    }
  },
  // Professional Engagement
  { slug: 'professional-development',   domainSlug: 'professional-engagement',  name: 'Pursue professional development',
    currentLevel: 2, score: 2, nextLevel: 3, roleTarget: 3, percentile: 73,
    behaviors: {
      current: ['Participates in continuing education', 'Maintains professional certifications', 'Seeks feedback for growth'],
      next:    ['Leads professional development programs for team', 'Contributes to professional literature or conferences', 'Mentors others in professional growth']
    }
  },
  { slug: 'integrate-ethical-standards',   domainSlug: 'professional-engagement',  name: 'Integrate ethical standards into healthcare quality practice',
    currentLevel: 2, score: 2, nextLevel: 3, roleTarget: 3, percentile: 68,
    behaviors: {
      current: ['Understands code of ethics', 'Applies ethical standards in daily work', 'Follows organizational policies'],
      next:    ['Effectively applies ethical judgment in complex situations', 'Evaluates policies for ethical alignment', 'Coaches others on ethics']
    }
  },
  { slug: 'advance-healthcare-profession',   domainSlug: 'professional-engagement',  name: 'Participate in activities that advance the healthcare quality profession',
    currentLevel: 1, score: 1, nextLevel: 2, roleTarget: 3, percentile: 45,
    behaviors: {
      current: ['Understands importance of professional contribution', 'Identifies opportunities to participate'],
      next:    ['Actively participates in professional organizations', 'Contributes to knowledge sharing', 'Mentors newer professionals']
    }
  },
  // Quality Leadership & Integration - additional competencies
  { slug: 'direct-quality-infrastructure',   domainSlug: 'quality-leadership',  name: 'Direct the quality infrastructure to achieve organizational objectives',
    currentLevel: 1, score: 1, nextLevel: 2, roleTarget: 2, percentile: 38,
    behaviors: {
      current: ['Understands quality governance structures', 'Participates in quality planning'],
      next:    ['Develops quality governance frameworks', 'Aligns quality with strategic objectives', 'Leads quality council']
    }
  },
  { slug: 'promote-stakeholder-engagement',   domainSlug: 'quality-leadership',  name: 'Implement processes to promote stakeholder engagement and interprofessional teamwork',
    currentLevel: 2, score: 2, nextLevel: 3, roleTarget: 3, percentile: 59,
    behaviors: {
      current: ['Involves stakeholders in improvement efforts', 'Facilitates cross-functional communication'],
      next:    ['Designs systematic stakeholder engagement', 'Builds and sustains interprofessional teams', 'Resolves cross-functional conflicts']
    }
  },
  { slug: 'communicate-quality-goals',   domainSlug: 'quality-leadership',  name: 'Communicate effectively with different audiences to achieve quality goals',
    currentLevel: 2, score: 2, nextLevel: 3, roleTarget: 3, percentile: 64,
    behaviors: {
      current: ['Communicates clearly with peers', 'Tailors messages to different audiences'],
      next:    ['Communicates complex concepts effectively', 'Influences stakeholders on quality priorities', 'Builds consensus across groups']
    }
  },
  // Patient Safety - additional competencies
  { slug: 'assess-safety-culture',   domainSlug: 'patient-safety',  name: 'Assess the organization\'s patient safety culture',
    currentLevel: 1, score: 1, nextLevel: 2, roleTarget: 2, percentile: 32,
    behaviors: {
      current: ['Understands safety culture elements', 'Collects safety culture survey data'],
      next:    ['Applies safety culture surveys', 'Analyzes patterns and trends', 'Makes improvement recommendations']
    }
  },
  { slug: 'collaborate-safety-risks',   domainSlug: 'patient-safety',  name: 'Collaborate with stakeholders to analyze patient safety risks and events',
    currentLevel: 2, score: 2, nextLevel: 3, roleTarget: 3, percentile: 57,
    behaviors: {
      current: ['Engages team in risk assessment', 'Participates in event analysis'],
      next:    ['Facilitates comprehensive risk analysis', 'Designs effective interventions', 'Coaches others in root cause analysis']
    }
  },
  // Performance Improvement - additional competencies
  { slug: 'apply-ppi-methods',   domainSlug: 'performance-improvement',  name: 'Implement standard performance and process improvement (PPI) methods',
    currentLevel: 2, score: 2, nextLevel: 3, roleTarget: 3, percentile: 55,
    behaviors: {
      current: ['Understands LEAN and Six Sigma basics', 'Applies PDSA methodology'],
      next:    ['Leads complex improvement projects', 'Trains others in PPI methods', 'Scales improvements across units']
    }
  },
  { slug: 'apply-project-management',   domainSlug: 'performance-improvement',  name: 'Apply project management methods',
    currentLevel: 1, score: 1, nextLevel: 2, roleTarget: 2, percentile: 41,
    behaviors: {
      current: ['Understands project management basics', 'Supports project planning'],
      next:    ['Develops project charters', 'Manages timelines and budgets', 'Tracks progress and reports']
    }
  },
  { slug: 'apply-change-management',   domainSlug: 'performance-improvement',  name: 'Use change management principles and tools',
    currentLevel: 1, score: 1, nextLevel: 2, roleTarget: 2, percentile: 39,
    behaviors: {
      current: ['Understands change management principles', 'Identifies stakeholders affected by change'],
      next:    ['Applies change management frameworks', 'Manages resistance to change', 'Evaluates change effectiveness']
    }
  },
  // Health Data Analytics - additional competencies
  { slug: 'design-data-collection',   domainSlug: 'health-data-analytics',  name: 'Design data collection and data analysis plans',
    currentLevel: 1, score: 1, nextLevel: 2, roleTarget: 2, percentile: 36,
    behaviors: {
      current: ['Understands measure types', 'Helps define data collection approaches'],
      next:    ['Develops standard-based measures', 'Creates operational definitions', 'Designs sampling methodology']
    }
  },
  { slug: 'integrate-data-sources',   domainSlug: 'health-data-analytics',  name: 'Integrate data from internal and external source systems',
    currentLevel: 1, score: 1, nextLevel: 2, roleTarget: 2, percentile: 35,
    behaviors: {
      current: ['Understands data sources available', 'Extracts data from basic systems'],
      next:    ['Integrates diverse datasets', 'Ensures data accuracy and completeness', 'Standardizes data definitions']
    }
  },
  { slug: 'use-statistical-methods',   domainSlug: 'health-data-analytics',  name: 'Use statistical and visualization methods',
    currentLevel: 1, score: 1, nextLevel: 2, roleTarget: 2, percentile: 38,
    behaviors: {
      current: ['Understands basic statistical concepts', 'Creates simple visualizations'],
      next:    ['Performs statistical analysis', 'Creates advanced visualizations', 'Interprets complex data patterns']
    }
  },
  // Regulatory & Accreditation - additional competencies
  { slug: 'survey-readiness',   domainSlug: 'regulatory-accreditation',  name: 'Facilitate continuous survey readiness activities',
    currentLevel: 1, score: 1, nextLevel: 2, roleTarget: 2, percentile: 33,
    behaviors: {
      current: ['Understands survey processes', 'Participates in mock surveys'],
      next:    ['Conducts internal surveys', 'Implements remediation plans', 'Trains staff on compliance']
    }
  },
  { slug: 'guide-survey-process',   domainSlug: 'regulatory-accreditation',  name: 'Guide the organization through survey processes and findings',
    currentLevel: 2, score: 2, nextLevel: 3, roleTarget: 3, percentile: 61,
    behaviors: {
      current: ['Coordinates survey preparation', 'Communicates findings to team'],
      next:    ['Leads comprehensive survey strategy', 'Analyzes complex findings', 'Guides organizational response']
    }
  },
  // Population Health & Care Transitions - additional competencies
  { slug: 'integrate-population-health',   domainSlug: 'population-health',  name: 'Integrate population health management strategies into quality work',
    currentLevel: 1, score: 1, nextLevel: 2, roleTarget: 2, percentile: 37,
    behaviors: {
      current: ['Understands population health concepts', 'Identifies key health indicators'],
      next:    ['Develops population-based interventions', 'Analyzes population data', 'Coordinates cross-continuum care']
    }
  },
  { slug: 'apply-holistic-approach',   domainSlug: 'population-health',  name: 'Apply a holistic approach to improvement',
    currentLevel: 2, score: 2, nextLevel: 3, roleTarget: 3, percentile: 52,
    behaviors: {
      current: ['Considers system relationships', 'Engages diverse stakeholders'],
      next:    ['Maps complex system interactions', 'Identifies unintended consequences', 'Sustains improvements systemically']
    }
  },
  // Quality Review & Accountability
  { slug: 'relate-payment-models',   domainSlug: 'quality-review-accountability',  name: 'Relate current and emerging payment models to healthcare quality work',
    currentLevel: 1, score: 1, nextLevel: 2, roleTarget: 2, percentile: 34,
    behaviors: {
      current: ['Understands basic payment models', 'Recognizes quality-payment connections'],
      next:    ['Analyzes payment model impacts', 'Aligns quality initiatives with payment incentives', 'Advises leadership on strategy']
    }
  },
  { slug: 'execute-measure-requirements',   domainSlug: 'quality-review-accountability',  name: 'Conduct the activities to execute measure requirements',
    currentLevel: 2, score: 2, nextLevel: 3, roleTarget: 3, percentile: 60,
    behaviors: {
      current: ['Understands measure specifications', 'Collects required data'],
      next:    ['Manages measure implementation', 'Ensures accurate reporting', 'Analyzes measure outcomes']
    }
  },
  { slug: 'facilitate-performance-review',   domainSlug: 'quality-review-accountability',  name: 'Implement processes to facilitate practitioner performance review activities',
    currentLevel: 1, score: 1, nextLevel: 2, roleTarget: 2, percentile: 43,
    behaviors: {
      current: ['Understands performance review principles', 'Identifies key performance areas'],
      next:    ['Develops performance metrics', 'Establishes review processes', 'Supports practitioner improvement']
    }
  },
];

export const COURSE_CATALOG = [
  { id: 'c1',  title: 'QI Fundamentals: Leading Small-Scale Projects',     hours: 3,   format: 'On-demand', competencySlugs: ['lead-quality-initiatives', 'data-improvement-opps'],    behaviors: ['Independently leads small-scale QI projects', 'Selects appropriate improvement measures'] },
  { id: 'c2',  title: 'Data Analysis for Quality Professionals',            hours: 4,   format: 'Guided',    competencySlugs: ['data-improvement-opps', 'acquire-data'],               behaviors: ['Presents data-driven recommendations', 'Queries multiple source systems'] },
  { id: 'c3',  title: 'Patient Safety Risk Assessment Workshop',            hours: 2,   format: 'Webinar',   competencySlugs: ['safety-risk-mitigation'],                               behaviors: ['Conducts root cause analysis', 'Designs risk mitigation workflows'] },
  { id: 'c4',  title: 'Cross-Functional Team Leadership',                   hours: 3,   format: 'On-demand', competencySlugs: ['cross-functional-teams', 'lead-quality-initiatives'],   behaviors: ['Assembles and charters cross-functional teams', 'Resolves team conflicts'] },
  { id: 'c5',  title: 'Health Data Governance Essentials',                  hours: 2,   format: 'On-demand', competencySlugs: ['data-governance', 'acquire-data'],                      behaviors: ['Applies data governance frameworks', 'Ensures data quality standards'] },
  { id: 'c6',  title: 'Performance Improvement: Scaling Change',            hours: 5,   format: 'Guided',    competencySlugs: ['implement-improvement', 'lead-quality-initiatives'],    behaviors: ['Manages complex multi-cycle improvement projects', 'Builds sustainability plans'] },
  { id: 'c7',  title: 'Root Cause Analysis Masterclass',                    hours: 2.5, format: 'Webinar',   competencySlugs: ['safety-risk-mitigation', 'data-improvement-opps'],     behaviors: ['Conducts root cause analysis', 'Tracks safety metrics over time'] },
  { id: 'c8',  title: 'EHR Data Extraction & Source Systems',               hours: 2,   format: 'On-demand', competencySlugs: ['acquire-data', 'data-governance'],                      behaviors: ['Queries multiple source systems', 'Validates data integrity across sources'] },
  { id: 'c9',  title: 'Regulatory Compliance for Quality Leaders',          hours: 3,   format: 'Guided',    competencySlugs: ['regulatory-requirements'],                               behaviors: ['Interprets complex regulatory guidance', 'Leads regulatory readiness planning'] },
  { id: 'c10', title: 'Informatics for Quality: Practical Applications',    hours: 2,   format: 'On-demand', competencySlugs: ['health-informatics'],                                    behaviors: ['Evaluates informatics tools for quality use', 'Configures clinical decision support rules'] },
];

// ─── Level helpers ────────────────────────────────────────────────────────────

export const LEVEL_LABELS = { 1: 'Foundational', 2: 'Proficient', 3: 'Advanced' };

export function levelLabel(n) {
  if (n <= 1.6) return 'Foundational';
  if (n <= 2.3) return 'Proficient';
  return 'Advanced';
}

export function levelColor(n) {
  if (n <= 1.6) return { bg: '#FEF3C7', text: '#D97706' }; // Foundational - Yellow (1.0-1.6)
  if (n <= 2.3) return { bg: '#D1FAE5', text: '#059669' }; // Proficient - Green (1.7-2.3)
  return { bg: '#DBEAFE', text: '#2563EB' };               // Advanced - Blue (2.4-3.0)
}

// ─── Business Logic ───────────────────────────────────────────────────────────

export function computeCompetencyGap(currentLevel, nextLevel) {
  if (currentLevel >= nextLevel) return 0;
  const subGap = ((currentLevel * 7 + nextLevel * 3) % 10) / 100;
  return parseFloat(Math.min(1, (nextLevel - currentLevel) * 0.6 + subGap).toFixed(2));
}

export function computePriorityScore(gapScore, percentile, domainWeight = 1, careerGoalWeight = 1) {
  const gapComponent        = gapScore * 40;
  const percentileComponent = ((100 - percentile) / 100) * 30;
  const domainComponent     = domainWeight * 15;
  const careerComponent     = careerGoalWeight * 15;
  return parseFloat((gapComponent + percentileComponent + domainComponent + careerComponent).toFixed(1));
}

export function generatePlan(prioritizedCompetencies, courseCatalog, maxHours = 18) {
  const usedCourseIds = new Set();
  const plan = [];
  let totalHours = 0;

  for (const comp of prioritizedCompetencies) {
    if (totalHours >= maxHours) break;
    const matchingCourses = courseCatalog
      .filter(c => c.competencySlugs.includes(comp.slug) && !usedCourseIds.has(c.id))
      .slice(0, 2);

    for (const course of matchingCourses) {
      if (totalHours + course.hours > maxHours) continue;
      usedCourseIds.add(course.id);
      totalHours += course.hours;
      const phase = totalHours <= 6 ? 'now' : totalHours <= 12 ? 'next' : 'later';
      plan.push({ ...course, competencyName: comp.name, competencySlug: comp.slug, priorityReasons: comp.priorityReasons, status: 'not_started', phase });
    }
  }

  return { courses: plan, totalHours };
}

export function getPrioritizedCompetencies() {
  const domainMap = Object.fromEntries(DOMAINS.map(d => [d.slug, d]));

  return COMPETENCIES.map(comp => {
    const domain   = domainMap[comp.domainSlug];
    const gap      = computeCompetencyGap(comp.currentLevel, comp.nextLevel);
    const priority = computePriorityScore(gap, comp.percentile, domain?.weight || 1, 1);
    const reasons  = [];
    if (gap >= 0.5)         reasons.push('Largest gap');
    if (comp.percentile < 40) reasons.push('Low percentile');
    reasons.push('Targets next-level behaviors');
    return { ...comp, domain, gap, priority, priorityReasons: reasons };
  }).sort((a, b) => b.priority - a.priority);
}

export function severityConfig(gap) {
  if (gap >= 1)    return { label: 'Critical', bg: '#FEE2E2', text: '#991B1B' };
  if (gap > 0)     return { label: 'Below Target', bg: '#FFF3E0', text: '#7C3D0A' };
  return { label: 'On Target', bg: '#D1FAE5', text: '#065F46' };
}

export function getDomainProfile() {
  const domainMap = Object.fromEntries(DOMAINS.map(d => [d.slug, d]));
  const grouped = {};
  COMPETENCIES.forEach(comp => {
    if (!grouped[comp.domainSlug]) grouped[comp.domainSlug] = [];
    grouped[comp.domainSlug].push(comp);
  });

  return DOMAINS.map(domain => {
    const comps    = grouped[domain.slug] || [];
    const avgLevel = comps.length ? comps.reduce((s, c) => s + c.currentLevel, 0) / comps.length : 0;
    const roundedLevel = Math.round(avgLevel);
    let status, statusColor;
    if (avgLevel >= 2.5)       { status = 'Strength';     statusColor = '#059669'; }
    else if (avgLevel >= 1.75) { status = 'On Track';     statusColor = '#D97706'; }
    else                        { status = 'Growth Area';  statusColor = '#DC2626'; }
    return { ...domain, avgLevel: parseFloat(avgLevel.toFixed(1)), roundedLevel, status, statusColor, compCount: comps.length };
  });
}