package com.nahq.accelerate.service;

import com.nahq.accelerate.domain.*;
import com.nahq.accelerate.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
public class SyntheticDataService {

    private final OrganizationRepository orgRepo;
    private final AppUserRepository userRepo;
    private final UserRoleRepository userRoleRepo;
    private final RoleTypeRepository roleTypeRepo;
    private final CompetencyRepository competencyRepo;
    private final CompetencyDomainRepository domainRepo;
    private final EngagementRepository engagementRepo;
    private final AssessmentCycleRepository cycleRepo;
    private final AssessmentRepository assessmentRepo;
    private final AssessmentResultRepository resultRepo;
    private final CompetencyFrameworkVersionRepository fvRepo;

    private final Random random = new Random(42); // Deterministic for reproducibility

    public SyntheticDataService(OrganizationRepository orgRepo, AppUserRepository userRepo,
                                 UserRoleRepository userRoleRepo, RoleTypeRepository roleTypeRepo,
                                 CompetencyRepository competencyRepo, CompetencyDomainRepository domainRepo,
                                 EngagementRepository engagementRepo, AssessmentCycleRepository cycleRepo,
                                 AssessmentRepository assessmentRepo, AssessmentResultRepository resultRepo,
                                 CompetencyFrameworkVersionRepository fvRepo) {
        this.orgRepo = orgRepo;
        this.userRepo = userRepo;
        this.userRoleRepo = userRoleRepo;
        this.roleTypeRepo = roleTypeRepo;
        this.competencyRepo = competencyRepo;
        this.domainRepo = domainRepo;
        this.engagementRepo = engagementRepo;
        this.cycleRepo = cycleRepo;
        this.assessmentRepo = assessmentRepo;
        this.resultRepo = resultRepo;
        this.fvRepo = fvRepo;
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

        // Create organizations
        String[][] orgs = {
            {"Tampa General Hospital", "Tampa", "FL"},
            {"Lifepoint Health System", "Brentwood", "TN"},
            {"Intermountain Healthcare", "Salt Lake City", "UT"}
        };

        List<Organization> organizations = new ArrayList<>();
        for (String[] orgData : orgs) {
            Organization org = new Organization();
            org.setName(orgData[0]);
            org.setOrgType("HEALTH_SYSTEM");
            org.setStatus("ACTIVE");
            organizations.add(orgRepo.save(org));
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

            AppUser user = new AppUser();
            user.setEmail(first.toLowerCase() + "." + last.toLowerCase() + "." + i + "@example.com");
            user.setFirstName(first);
            user.setLastName(last);
            user.setOrganization(org);
            user.setStatus("ACTIVE");
            users.add(userRepo.save(user));

            // Assign role: 90% participants, 10% executives
            UserRole role = new UserRole();
            role.setUser(user);
            role.setRoleType(i % 10 == 0 ? executiveRole : participantRole);
            role.setOrganization(org);
            role.setFromDate(LocalDate.of(2025, 1, 1));
            userRoleRepo.save(role);
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
            assessment.setAssessmentCycle(cycle);
            assessment.setStatus("SCORED");
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
            "users", users.size(),
            "assessments", assessmentsCreated,
            "results", resultsCreated,
            "competencies", competencies.size()
        );
    }
}
