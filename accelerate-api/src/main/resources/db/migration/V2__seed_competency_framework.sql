-- NAHQ Accelerate — Seed data for competency framework
-- Source: 2025 NAHQ Healthcare Quality Competency Framework (8 domains, 29 competencies)

-- ============================================================
-- Framework Version
-- ============================================================

INSERT INTO competency_framework_version (version_label, status, published_at)
VALUES ('2025-v1', 'PUBLISHED', NOW());

-- ============================================================
-- Competency Domains (8)
-- ============================================================

INSERT INTO competency_domain (name, description, display_order) VALUES
('Quality Leadership and Integration', 'Leading quality across the organization, aligning quality goals with strategic priorities', 1),
('Performance and Process Improvement', 'Using improvement methodologies to enhance processes and outcomes', 2),
('Population Health and Care Transitions', 'Managing care across the continuum and improving population health outcomes', 3),
('Health Data Analytics', 'Collecting, analyzing, and interpreting data to drive quality decisions', 4),
('Patient Safety', 'Preventing harm and creating a culture of safety', 5),
('Regulatory and Accreditation', 'Ensuring compliance with regulatory requirements and accreditation standards', 6),
('Quality Review and Accountability', 'Conducting reviews and maintaining accountability for quality outcomes', 7),
('Professional Engagement', 'Professional development, workforce engagement, and change management', 8);

-- ============================================================
-- Competencies (29) grouped by domain
-- ============================================================

-- Domain 1: Quality Leadership and Integration (4 competencies)
INSERT INTO competency (domain_id, name, description, display_order) VALUES
((SELECT id FROM competency_domain WHERE display_order = 1), 'Strategic Planning for Quality', 'Aligning quality goals with organizational strategy and mission', 1),
((SELECT id FROM competency_domain WHERE display_order = 1), 'Quality Culture Development', 'Building and sustaining an organizational culture that values quality', 2),
((SELECT id FROM competency_domain WHERE display_order = 1), 'Stakeholder Engagement', 'Engaging leaders, clinicians, and staff in quality initiatives', 3),
((SELECT id FROM competency_domain WHERE display_order = 1), 'Financial Management for Quality', 'Understanding the financial impact of quality and making the business case', 4);

-- Domain 2: Performance and Process Improvement (4 competencies)
INSERT INTO competency (domain_id, name, description, display_order) VALUES
((SELECT id FROM competency_domain WHERE display_order = 2), 'Improvement Methodology', 'Applying structured improvement methods (Lean, Six Sigma, PDSA, etc.)', 1),
((SELECT id FROM competency_domain WHERE display_order = 2), 'Project Management', 'Planning, executing, and managing quality improvement projects', 2),
((SELECT id FROM competency_domain WHERE display_order = 2), 'Change Management', 'Leading and managing organizational change effectively', 3),
((SELECT id FROM competency_domain WHERE display_order = 2), 'Process Design and Management', 'Designing and managing efficient, reliable processes', 4);

-- Domain 3: Population Health and Care Transitions (4 competencies)
INSERT INTO competency (domain_id, name, description, display_order) VALUES
((SELECT id FROM competency_domain WHERE display_order = 3), 'Population Health Management', 'Understanding and improving health outcomes for defined populations', 1),
((SELECT id FROM competency_domain WHERE display_order = 3), 'Care Coordination', 'Coordinating care across settings and providers', 2),
((SELECT id FROM competency_domain WHERE display_order = 3), 'Care Transitions', 'Managing safe and effective transitions between care settings', 3),
((SELECT id FROM competency_domain WHERE display_order = 3), 'Health Equity', 'Addressing disparities and promoting equitable care delivery', 4);

-- Domain 4: Health Data Analytics (4 competencies)
INSERT INTO competency (domain_id, name, description, display_order) VALUES
((SELECT id FROM competency_domain WHERE display_order = 4), 'Data Collection and Validation', 'Designing data collection processes and ensuring data integrity', 1),
((SELECT id FROM competency_domain WHERE display_order = 4), 'Statistical Analysis', 'Applying statistical methods to analyze quality data', 2),
((SELECT id FROM competency_domain WHERE display_order = 4), 'Data Visualization and Reporting', 'Presenting data effectively to drive decisions', 3),
((SELECT id FROM competency_domain WHERE display_order = 4), 'Health Information Technology', 'Leveraging HIT systems for quality measurement and improvement', 4);

-- Domain 5: Patient Safety (3 competencies)
INSERT INTO competency (domain_id, name, description, display_order) VALUES
((SELECT id FROM competency_domain WHERE display_order = 5), 'Safety Culture', 'Fostering an environment that supports safety reporting and learning', 1),
((SELECT id FROM competency_domain WHERE display_order = 5), 'Error Prevention and Mitigation', 'Implementing systems to prevent errors and reduce harm', 2),
((SELECT id FROM competency_domain WHERE display_order = 5), 'Event Investigation and Response', 'Investigating safety events and implementing corrective actions', 3);

-- Domain 6: Regulatory and Accreditation (3 competencies)
INSERT INTO competency (domain_id, name, description, display_order) VALUES
((SELECT id FROM competency_domain WHERE display_order = 6), 'Regulatory Compliance', 'Maintaining compliance with federal, state, and local regulations', 1),
((SELECT id FROM competency_domain WHERE display_order = 6), 'Accreditation Readiness', 'Preparing for and maintaining accreditation status', 2),
((SELECT id FROM competency_domain WHERE display_order = 6), 'Standards Interpretation', 'Interpreting and applying quality and safety standards', 3);

-- Domain 7: Quality Review and Accountability (4 competencies)
INSERT INTO competency (domain_id, name, description, display_order) VALUES
((SELECT id FROM competency_domain WHERE display_order = 7), 'Peer Review', 'Conducting fair and effective peer review processes', 1),
((SELECT id FROM competency_domain WHERE display_order = 7), 'Outcome Measurement', 'Defining and measuring meaningful quality outcomes', 2),
((SELECT id FROM competency_domain WHERE display_order = 7), 'Public Reporting', 'Managing public reporting requirements and transparency', 3),
((SELECT id FROM competency_domain WHERE display_order = 7), 'Accountability Structures', 'Establishing governance and accountability for quality', 4);

-- Domain 8: Professional Engagement (3 competencies)
INSERT INTO competency (domain_id, name, description, display_order) VALUES
((SELECT id FROM competency_domain WHERE display_order = 8), 'Professional Development', 'Pursuing continuous learning and growth in healthcare quality', 1),
((SELECT id FROM competency_domain WHERE display_order = 8), 'Workforce Engagement', 'Engaging and empowering the workforce in quality initiatives', 2),
((SELECT id FROM competency_domain WHERE display_order = 8), 'Communication and Influence', 'Communicating effectively and influencing quality outcomes', 3);

-- ============================================================
-- Role Types
-- ============================================================

INSERT INTO role_type (name, internal_id, description) VALUES
('Administrator', 'admin', 'NAHQ platform administrator — manages organizations, users, and system configuration'),
('Executive', 'executive', 'Organizational leader — views aggregated results, org strategy, workforce capability'),
('Participant', 'participant', 'Healthcare quality professional — takes assessments, receives personalized upskilling plans'),
('Facilitator', 'facilitator', 'NAHQ Navigator or program facilitator — guides engagements and cohorts'),
('Observer', 'observer', 'Read-only access for auditors or external reviewers');

-- ============================================================
-- Role Targets (sample: Participant expected levels for 2025-v1)
-- ============================================================

INSERT INTO role_target (role_type_id, competency_id, framework_version_id, target_level, target_score)
SELECT
    rt.id,
    c.id,
    fv.id,
    CASE
        WHEN cd.display_order IN (1, 7) THEN 'FOUNDATIONAL'
        WHEN cd.display_order IN (2, 3, 4, 5, 8) THEN 'PROFICIENT'
        WHEN cd.display_order IN (6) THEN 'ADVANCED'
    END,
    CASE
        WHEN cd.display_order IN (1, 7) THEN 2.50
        WHEN cd.display_order IN (2, 3, 4, 5, 8) THEN 3.50
        WHEN cd.display_order IN (6) THEN 4.00
    END
FROM role_type rt
CROSS JOIN competency c
JOIN competency_domain cd ON c.domain_id = cd.id
JOIN competency_framework_version fv ON fv.version_label = '2025-v1'
WHERE rt.internal_id = 'participant';

-- Executive targets: higher across the board
INSERT INTO role_target (role_type_id, competency_id, framework_version_id, target_level, target_score)
SELECT
    rt.id,
    c.id,
    fv.id,
    CASE
        WHEN cd.display_order IN (1) THEN 'ADVANCED'
        ELSE 'PROFICIENT'
    END,
    CASE
        WHEN cd.display_order IN (1) THEN 4.50
        ELSE 3.50
    END
FROM role_type rt
CROSS JOIN competency c
JOIN competency_domain cd ON c.domain_id = cd.id
JOIN competency_framework_version fv ON fv.version_label = '2025-v1'
WHERE rt.internal_id = 'executive';
