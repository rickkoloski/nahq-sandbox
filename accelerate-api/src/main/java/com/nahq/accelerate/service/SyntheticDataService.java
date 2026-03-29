package com.nahq.accelerate.service;

import com.nahq.accelerate.domain.*;
import com.nahq.accelerate.repository.*;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
            new double[]{3.8, 4.1, 3.2, 3.5, 3.9, 4.3, 3.0, 3.7});
        createDemoUser("michael.reeves@tgh.org", "Michael", "Reeves", tgh, participantRole,
            cycleByOrg.get(tgh.getId()), fv, competencies,
            new double[]{2.5, 3.8, 2.2, 3.0, 3.6, 4.0, 2.0, 3.4});

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

            // AppUser (auth record — references party_id)
            AppUser user = new AppUser();
            user.setEmail(first.toLowerCase() + "." + last.toLowerCase() + "." + i + "@example.com");
            user.setFirstName(first);
            user.setLastName(last);
            user.setOrganization(org);
            user.setParty(party);
            user.setStatus("ACTIVE");
            users.add(userRepo.save(user));

        }

        // Create assessments with realistic score distributions
        // Scores follow a normal distribution around domain-specific means
        double[] domainMeans = {3.2, 3.5, 2.8, 3.0, 3.3, 3.8, 2.9, 3.4}; // varying by domain
        int assessmentsCreated = 0;
        int resultsCreated = 0;

        for (AppUser user : users) {
            AssessmentCycle cycle = cycleByOrg.get(user.getOrganization().getId());

            Assessment assessment = new Assessment();
            assessment.setUser(user);
            assessment.setParty(user.getParty());
            assessment.setAssessmentCycle(cycle);
            assessment.setStatus("SCORED");
            assessment.setScoredAt(java.time.Instant.now());
            assessment = assessmentRepo.save(assessment);

            for (Competency comp : competencies) {
                int domainIdx = comp.getDomain().getDisplayOrder() - 1;
                double mean = domainMeans[domainIdx];
                double stdDev = 0.7;
                double score = mean + random.nextGaussian() * stdDev;
                score = Math.max(1.0, Math.min(5.0, score)); // Clamp to 1-5 range

                AssessmentResult result = new AssessmentResult();
                result.setAssessment(assessment);
                result.setCompetency(comp);
                result.setFrameworkVersion(fv);
                result.setScore(BigDecimal.valueOf(score).setScale(2, RoundingMode.HALF_UP));
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

        // AppUser (auth record)
        AppUser user = new AppUser();
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setOrganization(org);
        user.setParty(party);
        user.setStatus("ACTIVE");
        user = userRepo.save(user);

        Assessment assessment = new Assessment();
        assessment.setUser(user);
        assessment.setParty(party);
        assessment.setAssessmentCycle(cycle);
        assessment.setStatus("SCORED");
        assessment.setScoredAt(java.time.Instant.now());
        assessment = assessmentRepo.save(assessment);

        for (Competency comp : competencies) {
            int domainIdx = comp.getDomain().getDisplayOrder() - 1;
            double baseline = domainBaselines[domainIdx];
            double score = baseline + (comp.getDisplayOrder() * 0.15);
            score = Math.max(1.0, Math.min(5.0, score));

            AssessmentResult result = new AssessmentResult();
            result.setAssessment(assessment);
            result.setCompetency(comp);
            result.setFrameworkVersion(fv);
            result.setScore(BigDecimal.valueOf(score).setScale(2, RoundingMode.HALF_UP));
            resultRepo.save(result);
        }
    }
}
