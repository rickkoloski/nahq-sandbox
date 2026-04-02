-- V13: Align competencies to NAHQ's authoritative 28-competency framework
-- Source: Role Group Target Asset File.xlsx (PM #738)
-- Replaces the placeholder 29 competencies from V2 with Tim's exact 28

-- ============================================================
-- Clear dependent data (recreated by seed service)
-- ============================================================

TRUNCATE assessment_result, role_target, course_competency_mapping CASCADE;

-- ============================================================
-- Clear existing competencies and domains
-- ============================================================

DELETE FROM competency;
DELETE FROM competency_domain;

-- Reset sequences so IDs are predictable
ALTER SEQUENCE competency_domain_id_seq RESTART WITH 1;
ALTER SEQUENCE competency_id_seq RESTART WITH 1;

-- ============================================================
-- Insert the 8 domains with correct display_order
-- (Professional Engagement is domain 1 in Tim's framework, not 8)
-- ============================================================

INSERT INTO competency_domain (name, description, display_order, created_at, updated_at) VALUES
('Professional Engagement',                'Engage in the healthcare quality profession with ethical standards, lifelong learning, and advancement of practices.',       1, NOW(), NOW()),
('Quality Leadership and Integration',     'Direct quality infrastructure, manage information, integrate feedback, create learning opportunities, and communicate.',     2, NOW(), NOW()),
('Performance and Process Improvement',    'Implement performance/process improvement methods, project management, and change management.',                              3, NOW(), NOW()),
('Population Health and Care Transitions', 'Integrate population health strategies, patient-centered approaches, and stakeholder collaboration for care transitions.',  4, NOW(), NOW()),
('Health Data Analytics',                  'Manage data systems, design collection/analysis plans, integrate sources, and apply statistical/visualization methods.',      5, NOW(), NOW()),
('Patient Safety',                         'Assess safety culture, apply safety science, report risks/events, and collaborate to improve processes.',                     6, NOW(), NOW()),
('Regulatory and Accreditation',           'Operationalize compliance, facilitate survey readiness, and lead survey processes.',                                          7, NOW(), NOW()),
('Quality Review and Accountability',      'Relate payment models to quality, meet reporting requirements, and facilitate provider performance review.',                  8, NOW(), NOW());

-- ============================================================
-- Insert the 28 competencies with exact names from Tim's dataset
-- ============================================================

-- Domain 1: Professional Engagement (3 competencies)
INSERT INTO competency (domain_id, name, description, display_order, created_at, updated_at) VALUES
((SELECT id FROM competency_domain WHERE display_order = 1),
 'Integrate ethical standards into professional practice that support healthcare quality and safety',
 '', 1, NOW(), NOW()),
((SELECT id FROM competency_domain WHERE display_order = 1),
 'Engage in lifelong learning that supports healthcare quality and safety.',
 '', 2, NOW(), NOW()),
((SELECT id FROM competency_domain WHERE display_order = 1),
 'Participate in activities that advance healthcare quality and safety practices.',
 '', 3, NOW(), NOW());

-- Domain 2: Quality Leadership and Integration (5 competencies)
INSERT INTO competency (domain_id, name, description, display_order, created_at, updated_at) VALUES
((SELECT id FROM competency_domain WHERE display_order = 2),
 'Direct the quality and safety infrastructure to achieve organizational objectives.',
 '', 1, NOW(), NOW()),
((SELECT id FROM competency_domain WHERE display_order = 2),
 'Apply procedures to regulate the use of privileged or confidential information',
 '', 2, NOW(), NOW()),
((SELECT id FROM competency_domain WHERE display_order = 2),
 'Integrate stakeholder feedback into the quality and safety infrastructure and foster interprofessional teamwork.',
 '', 3, NOW(), NOW()),
((SELECT id FROM competency_domain WHERE display_order = 2),
 'Create learning opportunities to advance healthcare quality and safety throughout the organization.',
 '', 4, NOW(), NOW()),
((SELECT id FROM competency_domain WHERE display_order = 2),
 'Communicate effectively with different audiences to achieve quality and safety goals.',
 '', 5, NOW(), NOW());

-- Domain 3: Performance and Process Improvement (3 competencies)
INSERT INTO competency (domain_id, name, description, display_order, created_at, updated_at) VALUES
((SELECT id FROM competency_domain WHERE display_order = 3),
 'Implement standard performance and process improvement (PPI) methods into individual, team and project work activities.',
 '', 1, NOW(), NOW()),
((SELECT id FROM competency_domain WHERE display_order = 3),
 'Apply project management methods to regular work activities.',
 '', 2, NOW(), NOW()),
((SELECT id FROM competency_domain WHERE display_order = 3),
 'Use change management principles and tools for improvement projects and initiatives.',
 '', 3, NOW(), NOW());

-- Domain 4: Population Health and Care Transitions (3 competencies)
INSERT INTO competency (domain_id, name, description, display_order, created_at, updated_at) VALUES
((SELECT id FROM competency_domain WHERE display_order = 4),
 'Integrate population health strategies into quality and safety work.',
 '', 1, NOW(), NOW()),
((SELECT id FROM competency_domain WHERE display_order = 4),
 'Apply a patient-centered, holistic approach to drive and monitor improvement.',
 '', 2, NOW(), NOW()),
((SELECT id FROM competency_domain WHERE display_order = 4),
 'Collaborate with stakeholders to improve care processes and transitions for safe and effective care delivery across the continuum.',
 '', 3, NOW(), NOW());

-- Domain 5: Health Data Analytics (4 competencies)
INSERT INTO competency (domain_id, name, description, display_order, created_at, updated_at) VALUES
((SELECT id FROM competency_domain WHERE display_order = 5),
 'Apply procedures for the management of data and systems.',
 '', 1, NOW(), NOW()),
((SELECT id FROM competency_domain WHERE display_order = 5),
 'Design data collection and data analysis plans to support quality, safety, regulatory and patient experience work activities.',
 '', 2, NOW(), NOW()),
((SELECT id FROM competency_domain WHERE display_order = 5),
 'Integrate data from internal and external source systems to support quality, safety, regulatory, and patient experience.',
 '', 3, NOW(), NOW()),
((SELECT id FROM competency_domain WHERE display_order = 5),
 'Use statistical and visualization methods to transform data into information.',
 '', 4, NOW(), NOW());

-- Domain 6: Patient Safety (4 competencies)
INSERT INTO competency (domain_id, name, description, display_order, created_at, updated_at) VALUES
((SELECT id FROM competency_domain WHERE display_order = 6),
 'Assess the organization''s safety culture and safety practices.',
 '', 1, NOW(), NOW()),
((SELECT id FROM competency_domain WHERE display_order = 6),
 'Apply safety science principles and methods to healthcare quality and safety work, leveraging safety curriculum and competencies to promote teamwork.',
 '', 2, NOW(), NOW()),
((SELECT id FROM competency_domain WHERE display_order = 6),
 'Use organizational procedures to identify and report patient safety risks and events',
 '', 3, NOW(), NOW()),
((SELECT id FROM competency_domain WHERE display_order = 6),
 'Collaborate with internal and external stakeholders to analyze safety risks and events to improve processes.',
 '', 4, NOW(), NOW());

-- Domain 7: Regulatory and Accreditation (3 competencies)
INSERT INTO competency (domain_id, name, description, display_order, created_at, updated_at) VALUES
((SELECT id FROM competency_domain WHERE display_order = 7),
 'Operationalize processes to support compliance with regulations and standards',
 '', 1, NOW(), NOW()),
((SELECT id FROM competency_domain WHERE display_order = 7),
 'Facilitate continuous survey readiness activities',
 '', 2, NOW(), NOW()),
((SELECT id FROM competency_domain WHERE display_order = 7),
 'Lead the organization through survey processes, findings, and plan of corrections.',
 '', 3, NOW(), NOW());

-- Domain 8: Quality Review and Accountability (3 competencies)
INSERT INTO competency (domain_id, name, description, display_order, created_at, updated_at) VALUES
((SELECT id FROM competency_domain WHERE display_order = 8),
 'Relate payment models and the impact of healthcare quality, safety, and patient experience initiatives to organizational reimbursement.',
 '', 1, NOW(), NOW()),
((SELECT id FROM competency_domain WHERE display_order = 8),
 'Create and implement a plan to meet measure reporting requirements for quality, safety, regulatory and patient experience.',
 '', 2, NOW(), NOW()),
((SELECT id FROM competency_domain WHERE display_order = 8),
 'Facilitate physician and clinical provider performance review activities.',
 '', 3, NOW(), NOW());
