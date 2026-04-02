package com.nahq.accelerate.service;

import com.nahq.accelerate.domain.*;
import com.nahq.accelerate.repository.*;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.InputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
public class SyntheticDataService {

    private final EntityManager em;
    private final OrganizationRepository orgRepo;
    private final AppUserRepository userRepo;
    private final RoleTypeRepository roleTypeRepo;
    private final CompetencyRepository competencyRepo;
    private final CompetencyDomainRepository domainRepo;
    private final EngagementRepository engagementRepo;
    private final AssessmentCycleRepository cycleRepo;
    private final AssessmentRepository assessmentRepo;
    private final AssessmentResultRepository resultRepo;
    private final CompetencyFrameworkVersionRepository fvRepo;
    private final PartyRepository partyRepo;
    private final IndividualRepository individualRepo;
    private final PartyRoleRepository partyRoleRepo;

    private final Random random = new Random(42); // Deterministic for reproducibility

    public SyntheticDataService(EntityManager em, OrganizationRepository orgRepo, AppUserRepository userRepo,
                                 RoleTypeRepository roleTypeRepo,
                                 CompetencyRepository competencyRepo, CompetencyDomainRepository domainRepo,
                                 EngagementRepository engagementRepo, AssessmentCycleRepository cycleRepo,
                                 AssessmentRepository assessmentRepo, AssessmentResultRepository resultRepo,
                                 CompetencyFrameworkVersionRepository fvRepo,
                                 PartyRepository partyRepo, IndividualRepository individualRepo,
                                 PartyRoleRepository partyRoleRepo) {
        this.em = em;
        this.orgRepo = orgRepo;
        this.userRepo = userRepo;
        this.roleTypeRepo = roleTypeRepo;
        this.competencyRepo = competencyRepo;
        this.domainRepo = domainRepo;
        this.engagementRepo = engagementRepo;
        this.cycleRepo = cycleRepo;
        this.assessmentRepo = assessmentRepo;
        this.resultRepo = resultRepo;
        this.fvRepo = fvRepo;
        this.partyRepo = partyRepo;
        this.individualRepo = individualRepo;
        this.partyRoleRepo = partyRoleRepo;
    }

    @Transactional
    public Map<String, Object> generateSyntheticData(int userCount) {
        // Find role types and framework version (from seed data)
        RoleType participantRole = roleTypeRepo.findAll().stream()
            .filter(r -> "participant".equals(r.getInternalId())).findFirst()
            .orElseThrow(() -> new RuntimeException("Participant role not found"));
        RoleType executiveRole = roleTypeRepo.findAll().stream()
            .filter(r -> "executive".equals(r.getInternalId())).findFirst()
            .orElseThrow(() -> new RuntimeException("Executive role not found"));

        List<Competency> competencies = competencyRepo.findAll();

        // Create organizations with Party records (Silverston UDM)
        // Each health system is a Party(ORGANIZATION) with subsidiary hospital sites
        String[][][] orgStructure = {
            { // Tampa General Hospital system
                {"Tampa General Hospital", "HEALTH_SYSTEM"},
                {"Regional Medical Center", "HOSPITAL", "Tampa", "FL"},
                {"Community Hospital", "HOSPITAL", "Brandon", "FL"},
                {"Specialty Care Hospital", "HOSPITAL", "Clearwater", "FL"},
            },
            { // Lifepoint Health System
                {"Lifepoint Health System", "HEALTH_SYSTEM"},
                {"Lifepoint Memorial Hospital", "HOSPITAL", "Brentwood", "TN"},
                {"Lifepoint Regional Medical", "HOSPITAL", "Nashville", "TN"},
            },
            { // Intermountain Healthcare
                {"Intermountain Healthcare", "HEALTH_SYSTEM"},
                {"Intermountain Medical Center", "HOSPITAL", "Murray", "UT"},
                {"Primary Children's Hospital", "HOSPITAL", "Salt Lake City", "UT"},
            }
        };

        // Get subsidiary relationship type
        Object subRelTypeId = em.createNativeQuery(
            "SELECT id FROM party_relationship_type WHERE internal_id = 'subsidiary_of'"
        ).getSingleResult();

        List<Organization> organizations = new ArrayList<>();
        for (String[][] system : orgStructure) {
            // First entry is the health system (parent org)
            String[] parentData = system[0];

            // Create Party for health system
            em.createNativeQuery(
                "INSERT INTO party (party_type, display_name) VALUES ('ORGANIZATION', :name)"
            ).setParameter("name", parentData[0]).executeUpdate();
            Object parentPartyId = em.createNativeQuery("SELECT currval('party_id_seq')").getSingleResult();

            Organization parentOrg = new Organization();
            parentOrg.setName(parentData[0]);
            parentOrg.setOrgType(parentData[1]);
            parentOrg.setStatus("ACTIVE");
            parentOrg = orgRepo.save(parentOrg);
            organizations.add(parentOrg);

            // Link org to party
            em.createNativeQuery("UPDATE organization SET party_id = :partyId WHERE id = :orgId")
                .setParameter("partyId", parentPartyId).setParameter("orgId", parentOrg.getId()).executeUpdate();

            // Create subsidiary hospital sites as Party + Organization + Relationship
            for (int s = 1; s < system.length; s++) {
                String[] siteData = system[s];
                em.createNativeQuery(
                    "INSERT INTO party (party_type, display_name) VALUES ('ORGANIZATION', :name)"
                ).setParameter("name", siteData[0]).executeUpdate();
                Object sitePartyId = em.createNativeQuery("SELECT currval('party_id_seq')").getSingleResult();

                // Site as organization
                em.createNativeQuery(
                    "INSERT INTO organization (name, org_type, status, party_id, created_at, updated_at) " +
                    "VALUES (:name, 'HOSPITAL', 'ACTIVE', :partyId, NOW(), NOW())"
                ).setParameter("name", siteData[0]).setParameter("partyId", sitePartyId).executeUpdate();

                // Site entry in site table (for backward compat)
                em.createNativeQuery(
                    "INSERT INTO site (organization_id, name, city, state, created_at, updated_at) " +
                    "VALUES (:orgId, :name, :city, :state, NOW(), NOW())"
                ).setParameter("orgId", parentOrg.getId())
                 .setParameter("name", siteData[0])
                 .setParameter("city", siteData.length > 2 ? siteData[2] : null)
                 .setParameter("state", siteData.length > 3 ? siteData[3] : null)
                 .executeUpdate();

                // Party relationship: site SUBSIDIARY_OF parent
                em.createNativeQuery(
                    "INSERT INTO party_relationship (relationship_type_id, from_party_id, to_party_id, from_date) " +
                    "VALUES (:relType, :fromId, :toId, '2025-01-01')"
                ).setParameter("relType", subRelTypeId)
                 .setParameter("fromId", sitePartyId)
                 .setParameter("toId", parentPartyId)
                 .executeUpdate();
            }
        }

        // Get framework version
        CompetencyFrameworkVersion fv = fvRepo.findByVersionLabel("2025-v1")
            .orElseThrow(() -> new RuntimeException("Framework version 2025-v1 not found"));

        // Create engagement + assessment cycle for each org
        Map<Long, AssessmentCycle> cycleByOrg = new HashMap<>();
        for (Organization org : organizations) {
            Engagement engagement = new Engagement();
            engagement.setOrganization(org);
            engagement.setName("2025 Q1 Cohort — " + org.getName());
            engagement.setCurrentPhase("ASSESS");
            engagement.setStartDate(LocalDate.of(2025, 1, 15));
            engagement.setEndDate(LocalDate.of(2026, 1, 14));
            engagement = engagementRepo.save(engagement);

            AssessmentCycle cycle = new AssessmentCycle();
            cycle.setEngagement(engagement);
            cycle.setName("Baseline Assessment — " + org.getName());
            cycle.setFrameworkVersion(fv);
            cycle.setOpenDate(LocalDate.of(2025, 2, 1));
            cycle.setCloseDate(LocalDate.of(2025, 3, 15));
            cycle = cycleRepo.save(cycle);
            cycleByOrg.put(org.getId(), cycle);
        }

        // Create demo accounts (executive + participant with clean emails)
        Organization tgh = organizations.get(0); // Tampa General Hospital
        createDemoUser("sarah.chen@tgh.org", "Sarah", "Chen", tgh, executiveRole,
            cycleByOrg.get(tgh.getId()), fv, competencies,
            new double[]{2.0, 2.3, 1.5, 1.8, 2.1, 2.5, 1.4, 2.0});
        createDemoUser("michael.reeves@tgh.org", "Michael", "Reeves", tgh, executiveRole,
            cycleByOrg.get(tgh.getId()), fv, competencies,
            new double[]{1.5, 2.2, 1.1, 1.6, 2.0, 2.4, 1.0, 1.9});
        createDemoUser("jordan.taylor@tgh.org", "Jordan", "Taylor", tgh, participantRole,
            cycleByOrg.get(tgh.getId()), fv, competencies,
            new double[]{1.2, 1.8, 0.9, 1.3, 1.5, 2.0, 0.8, 1.4});

        // Create users distributed across orgs
        String[] firstNames = {"Sarah", "Michael", "Jennifer", "David", "Lisa", "James", "Maria",
            "Robert", "Patricia", "William", "Linda", "Richard", "Elizabeth", "Thomas", "Susan",
            "Christopher", "Jessica", "Daniel", "Karen", "Matthew", "Nancy", "Anthony", "Betty",
            "Mark", "Dorothy", "Steven", "Ashley", "Paul", "Kimberly", "Andrew"};
        String[] lastNames = {"Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
            "Davis", "Rodriguez", "Martinez", "Anderson", "Taylor", "Thomas", "Moore", "Jackson",
            "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez",
            "Lewis", "Robinson", "Walker", "Young", "Allen", "King"};

        List<AppUser> users = new ArrayList<>();
        int totalUsers = Math.min(userCount, firstNames.length * lastNames.length);

        for (int i = 0; i < totalUsers; i++) {
            Organization org = organizations.get(i % organizations.size());
            String first = firstNames[i % firstNames.length];
            String last = lastNames[i / firstNames.length % lastNames.length];
            RoleType roleType = i % 10 == 0 ? executiveRole : participantRole;

            // Create Party + Individual (Silverston UDM)
            Party party = new Party();
            party.setPartyType("INDIVIDUAL");
            party.setDisplayName(first + " " + last);
            party = partyRepo.save(party);

            Individual individual = new Individual();
            individual.setParty(party);
            individual.setFirstName(first);
            individual.setLastName(last);
            individualRepo.save(individual);

            // PartyRole (new model — references party_id)
            PartyRole partyRole = new PartyRole();
            partyRole.setParty(party);
            partyRole.setRoleType(roleType);
            partyRole.setOrganization(org);
            partyRole.setFromDate(LocalDate.of(2025, 1, 1));
            partyRoleRepo.save(partyRole);

            // EMPLOYED_BY relationship (individual → org)
            Object employedByTypeId = em.createNativeQuery(
                "SELECT id FROM party_relationship_type WHERE internal_id = 'employed_by'"
            ).getSingleResult();
            em.createNativeQuery(
                "INSERT INTO party_relationship (relationship_type_id, from_party_id, to_party_id, from_date) " +
                "VALUES (:relType, :fromId, :toId, '2025-01-01')"
            ).setParameter("relType", employedByTypeId)
             .setParameter("fromId", party.getId())
             .setParameter("toId", org.getParty() != null ? org.getParty().getId() :
                 em.createNativeQuery("SELECT party_id FROM organization WHERE id = :orgId")
                     .setParameter("orgId", org.getId()).getSingleResult())
             .executeUpdate();

            // AppUser (auth record — email + party_id only)
            AppUser user = new AppUser();
            user.setEmail(first.toLowerCase() + "." + last.toLowerCase() + "." + i + "@example.com");
            user.setParty(party);
            user.setStatus("ACTIVE");
            users.add(userRepo.save(user));
        }

        // Domain means control score distribution probabilities (not literal scores)
        // Higher mean → more 2s and 3s; lower mean → more 0s and 1s
        double[] domainMeans = {1.6, 1.9, 1.2, 1.4, 1.7, 2.1, 1.3, 1.8};
        int assessmentsCreated = 0;
        int resultsCreated = 0;

        // Map party → org for cycle lookup (via PartyRole.organization)
        for (AppUser user : users) {
            // Get the user's org via their party_role
            Organization userOrg = partyRoleRepo.findByPartyIdAndThruDateIsNull(user.getParty().getId())
                .stream().filter(pr -> pr.getOrganization() != null).findFirst()
                .map(PartyRole::getOrganization).orElse(organizations.get(0));
            AssessmentCycle cycle = cycleByOrg.get(userOrg.getId());

            Assessment assessment = new Assessment();
            assessment.setParty(user.getParty());
            assessment.setAssessmentCycle(cycle);
            assessment.setStatus("SCORED");
            assessment.setScoredAt(java.time.Instant.now());
            assessment = assessmentRepo.save(assessment);

            for (Competency comp : competencies) {
                int domainIdx = comp.getDomain().getDisplayOrder() - 1;
                double mean = domainMeans[domainIdx];

                // Scores are categorical: 0 (Not Performing), 1 (Foundational), 2 (Proficient), 3 (Advanced)
                // Use weighted random based on domain mean to produce realistic integer distribution
                double roll = random.nextDouble();
                int score;
                if (mean >= 2.0) {
                    // High-performing domain: mostly 2s and 3s
                    score = roll < 0.05 ? 0 : roll < 0.15 ? 1 : roll < 0.55 ? 2 : 3;
                } else if (mean >= 1.5) {
                    // Mid-performing: mix of 1s and 2s
                    score = roll < 0.05 ? 0 : roll < 0.30 ? 1 : roll < 0.75 ? 2 : 3;
                } else if (mean >= 1.0) {
                    // Lower-performing: mostly 1s with some 0s and 2s
                    score = roll < 0.10 ? 0 : roll < 0.50 ? 1 : roll < 0.85 ? 2 : 3;
                } else {
                    // Foundational: mostly 0s and 1s
                    score = roll < 0.30 ? 0 : roll < 0.65 ? 1 : roll < 0.90 ? 2 : 3;
                }

                AssessmentResult result = new AssessmentResult();
                result.setAssessment(assessment);
                result.setCompetency(comp);
                result.setFrameworkVersion(fv);
                result.setScore(BigDecimal.valueOf(score));
                resultRepo.save(result);
                resultsCreated++;
            }
            assessmentsCreated++;
        }

        return Map.of(
            "organizations", organizations.size(),
            "users", users.size() + 2, // +2 demo accounts
            "assessments", assessmentsCreated + 2,
            "results", resultsCreated + 58, // 29 competencies x 2 demo users
            "competencies", competencies.size()
        );
    }

    private void createDemoUser(String email, String firstName, String lastName,
                                 Organization org, RoleType roleType,
                                 AssessmentCycle cycle, CompetencyFrameworkVersion fv,
                                 List<Competency> competencies, double[] domainBaselines) {
        // Party + Individual (Silverston UDM)
        Party party = new Party();
        party.setPartyType("INDIVIDUAL");
        party.setDisplayName(firstName + " " + lastName);
        party = partyRepo.save(party);

        Individual individual = new Individual();
        individual.setParty(party);
        individual.setFirstName(firstName);
        individual.setLastName(lastName);
        individualRepo.save(individual);

        PartyRole partyRole = new PartyRole();
        partyRole.setParty(party);
        partyRole.setRoleType(roleType);
        partyRole.setOrganization(org);
        partyRole.setFromDate(LocalDate.of(2025, 1, 1));
        partyRoleRepo.save(partyRole);

        // EMPLOYED_BY relationship
        Object employedByTypeId = em.createNativeQuery(
            "SELECT id FROM party_relationship_type WHERE internal_id = 'employed_by'"
        ).getSingleResult();
        Object orgPartyId = em.createNativeQuery(
            "SELECT party_id FROM organization WHERE id = :orgId"
        ).setParameter("orgId", org.getId()).getSingleResult();
        em.createNativeQuery(
            "INSERT INTO party_relationship (relationship_type_id, from_party_id, to_party_id, from_date) " +
            "VALUES (:relType, :fromId, :toId, '2025-01-01')"
        ).setParameter("relType", employedByTypeId)
         .setParameter("fromId", party.getId())
         .setParameter("toId", orgPartyId)
         .executeUpdate();

        // AppUser (auth record — email + party_id only)
        AppUser user = new AppUser();
        user.setEmail(email);
        user.setParty(party);
        user.setStatus("ACTIVE");
        user = userRepo.save(user);

        Assessment assessment = new Assessment();
        assessment.setParty(party);
        assessment.setAssessmentCycle(cycle);
        assessment.setStatus("SCORED");
        assessment.setScoredAt(java.time.Instant.now());
        assessment = assessmentRepo.save(assessment);

        for (Competency comp : competencies) {
            int domainIdx = comp.getDomain().getDisplayOrder() - 1;
            double baseline = domainBaselines[domainIdx];

            // Demo accounts use integer scores derived from baseline
            int score;
            if (baseline >= 2.0) {
                score = comp.getDisplayOrder() <= 2 ? 3 : 2;
            } else if (baseline >= 1.5) {
                score = comp.getDisplayOrder() <= 2 ? 2 : (comp.getDisplayOrder() <= 4 ? 2 : 1);
            } else if (baseline >= 1.0) {
                score = comp.getDisplayOrder() <= 1 ? 2 : 1;
            } else {
                score = comp.getDisplayOrder() <= 2 ? 1 : 0;
            }
            score = Math.max(0, Math.min(3, score));

            AssessmentResult result = new AssessmentResult();
            result.setAssessment(assessment);
            result.setCompetency(comp);
            result.setFrameworkVersion(fv);
            result.setScore(BigDecimal.valueOf(score));
            resultRepo.save(result);
        }
    }

    @Transactional
    public Map<String, Object> seedCourses() {
        long start = System.currentTimeMillis();

        try {
            ObjectMapper mapper = new ObjectMapper();

            // Load courses
            InputStream coursesIs = getClass().getResourceAsStream("/seed/courses.json");
            if (coursesIs == null) throw new RuntimeException("courses.json not found");
            List<Map<String, Object>> courses = mapper.readValue(coursesIs,
                mapper.getTypeFactory().constructCollectionType(List.class, Map.class));

            // Load mappings
            InputStream mappingsIs = getClass().getResourceAsStream("/seed/course-competency-mappings.json");
            if (mappingsIs == null) throw new RuntimeException("course-competency-mappings.json not found");
            List<Map<String, Object>> mappings = mapper.readValue(mappingsIs,
                mapper.getTypeFactory().constructCollectionType(List.class, Map.class));

            // Load competency name map (crosswalk names → our DB names)
            InputStream nameMapIs = getClass().getResourceAsStream("/seed/competency-name-map.json");
            if (nameMapIs == null) throw new RuntimeException("competency-name-map.json not found");
            Map<String, String> nameMap = mapper.readValue(nameMapIs,
                mapper.getTypeFactory().constructMapType(Map.class, String.class, String.class));

            // Get framework version
            Object fvId = em.createNativeQuery(
                "SELECT id FROM competency_framework_version WHERE version_label = '2025-v1'"
            ).getSingleResult();

            // Clear existing courses and mappings
            em.createNativeQuery("DELETE FROM course_competency_mapping").executeUpdate();
            em.createNativeQuery("DELETE FROM lms_course").executeUpdate();

            // Insert courses
            int coursesInserted = 0;
            Map<String, Long> courseIdByTitle = new LinkedHashMap<>();

            for (Map<String, Object> course : courses) {
                String title = (String) course.get("title");
                String provider = (String) course.get("provider");
                boolean isNahq = "NAHQ".equals(provider);

                em.createNativeQuery(
                    "INSERT INTO lms_course (title, description, provider, duration_hours, ce_eligible, created_at, updated_at) " +
                    "VALUES (:title, :desc, :provider, :hours, :ce, NOW(), NOW())"
                )
                .setParameter("title", title)
                .setParameter("desc", title + " — " + provider + " course")
                .setParameter("provider", provider)
                .setParameter("hours", isNahq ? 4.0 : 2.0)
                .setParameter("ce", isNahq)
                .executeUpdate();

                Object courseId = em.createNativeQuery("SELECT currval('lms_course_id_seq')").getSingleResult();
                courseIdByTitle.put(title, ((Number) courseId).longValue());
                coursesInserted++;
            }

            // Insert competency mappings
            int mappingsInserted = 0;
            int skipped = 0;

            for (Map<String, Object> mapping : mappings) {
                String courseName = (String) mapping.get("course");
                String crosswalkCompName = (String) mapping.get("competency");
                String level = (String) mapping.get("level");

                Long courseId = courseIdByTitle.get(courseName);
                if (courseId == null) { skipped++; continue; }

                // Resolve crosswalk name to our DB name
                String dbCompName = nameMap.get(crosswalkCompName);
                if (dbCompName == null) { skipped++; continue; }

                // Level-based relevance weight
                double weight = switch (level) {
                    case "F" -> 0.6;
                    case "F/P" -> 0.8;
                    case "P" -> 1.0;
                    default -> 0.5;
                };

                try {
                    em.createNativeQuery(
                        "INSERT INTO course_competency_mapping (course_id, competency_id, framework_version_id, relevance_weight, created_at) " +
                        "SELECT :courseId, c.id, :fvId, :weight, NOW() " +
                        "FROM competency c WHERE c.name = :compName"
                    )
                    .setParameter("courseId", courseId)
                    .setParameter("fvId", fvId)
                    .setParameter("weight", weight)
                    .setParameter("compName", dbCompName)
                    .executeUpdate();
                    mappingsInserted++;
                } catch (Exception e) {
                    skipped++;
                }
            }

            long elapsed = System.currentTimeMillis() - start;
            return Map.of(
                "courses", coursesInserted,
                "mappings", mappingsInserted,
                "skipped", skipped,
                "elapsedMs", elapsed
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to seed courses: " + e.getMessage(), e);
        }
    }

    @Transactional
    public Map<String, Object> seedRoleTargets() {
        long start = System.currentTimeMillis();

        // Read role targets from embedded resource
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = getClass().getResourceAsStream("/seed/role-targets.json");
            if (is == null) throw new RuntimeException("role-targets.json not found on classpath");

            List<Map<String, Object>> targets = mapper.readValue(is,
                mapper.getTypeFactory().constructCollectionType(List.class, Map.class));

            // Get framework version
            Object fvId = em.createNativeQuery(
                "SELECT id FROM competency_framework_version WHERE version_label = '2025-v1'"
            ).getSingleResult();

            int inserted = 0;
            for (Map<String, Object> t : targets) {
                String compName = (String) t.get("competency");
                String roleGroup = (String) t.get("role_group");
                String jobLevel = (String) t.get("job_level");
                int target = ((Number) t.get("target")).intValue();

                String targetLevel = switch (target) {
                    case 0 -> "NOT_PERFORMING";
                    case 1 -> "FOUNDATIONAL";
                    case 2 -> "PROFICIENT";
                    case 3 -> "ADVANCED";
                    default -> "UNKNOWN";
                };

                em.createNativeQuery(
                    "INSERT INTO role_target (competency_id, framework_version_id, target_level, target_score, role_group, job_level) " +
                    "SELECT c.id, :fvId, :targetLevel, :targetScore, :roleGroup, :jobLevel " +
                    "FROM competency c WHERE c.name = :compName"
                )
                .setParameter("fvId", fvId)
                .setParameter("targetLevel", targetLevel)
                .setParameter("targetScore", target)
                .setParameter("roleGroup", roleGroup)
                .setParameter("jobLevel", jobLevel)
                .setParameter("compName", compName)
                .executeUpdate();
                inserted++;
            }

            long elapsed = System.currentTimeMillis() - start;
            return Map.of("roleTargets", inserted, "elapsedMs", elapsed);
        } catch (Exception e) {
            throw new RuntimeException("Failed to seed role targets: " + e.getMessage(), e);
        }
    }
}
