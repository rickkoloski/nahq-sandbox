-- V12: Fix role target scores from 1-5 scale to NAHQ's official 0-3 scale
-- Per NAHQ Framework & Professional Assessment document (Tim VanderMolen, March 2026):
-- 0 = Not Performing, 1 = Foundational, 2 = Proficient, 3 = Advanced

-- Participant targets: varied by domain importance
UPDATE role_target SET target_score = 1.0, target_level = 'FOUNDATIONAL'
WHERE role_type_id = (SELECT id FROM role_type WHERE internal_id = 'participant')
AND target_score = 2.50;

UPDATE role_target SET target_score = 2.0, target_level = 'PROFICIENT'
WHERE role_type_id = (SELECT id FROM role_type WHERE internal_id = 'participant')
AND target_score = 3.50;

UPDATE role_target SET target_score = 3.0, target_level = 'ADVANCED'
WHERE role_type_id = (SELECT id FROM role_type WHERE internal_id = 'participant')
AND target_score = 4.00;

-- Executive targets: higher expectations
UPDATE role_target SET target_score = 3.0, target_level = 'ADVANCED'
WHERE role_type_id = (SELECT id FROM role_type WHERE internal_id = 'executive')
AND target_score = 4.50;

UPDATE role_target SET target_score = 2.0, target_level = 'PROFICIENT'
WHERE role_type_id = (SELECT id FROM role_type WHERE internal_id = 'executive')
AND target_score = 3.50;
