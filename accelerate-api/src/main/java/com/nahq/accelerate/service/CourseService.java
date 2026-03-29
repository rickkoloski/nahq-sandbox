package com.nahq.accelerate.service;

import com.nahq.accelerate.dto.CourseSimilarityDto;
import com.nahq.accelerate.dto.CourseSimilarityDto.SimilarCourse;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class CourseService {

    private final EntityManager em;

    // Healthcare quality courses — realistic titles mapped to competency domains
    private static final String[][] COURSE_DATA = {
        // Domain 1: Quality Leadership and Integration
        {"Strategic Quality Planning for Healthcare Leaders", "Learn to align quality goals with organizational strategy, build executive support, and create sustainable quality programs.", "1,2,3,4"},
        {"Building a Culture of Quality in Healthcare Organizations", "Strategies for developing and sustaining an organizational culture that values continuous quality improvement.", "1,2"},
        {"Financial Impact of Quality: Making the Business Case", "Understanding ROI of quality initiatives, cost of poor quality, and financial modeling for quality programs.", "1,4"},
        {"Stakeholder Engagement in Quality Improvement", "Techniques for engaging clinical leaders, board members, and frontline staff in quality initiatives.", "1,3"},
        // Domain 2: Performance and Process Improvement
        {"Lean Six Sigma Green Belt for Healthcare", "Apply Lean and Six Sigma methodologies to healthcare process improvement. Includes DMAIC framework and statistical tools.", "5,6"},
        {"PDSA Cycles in Practice: Rapid Improvement Methods", "Master the Plan-Do-Study-Act methodology for testing and implementing changes at the point of care.", "5,8"},
        {"Healthcare Project Management Essentials", "Planning, executing, and managing quality improvement projects in complex healthcare environments.", "6"},
        {"Leading Change in Healthcare Organizations", "Evidence-based change management strategies for overcoming resistance and sustaining improvements.", "7"},
        {"Process Mapping and Workflow Optimization", "Tools and techniques for analyzing, redesigning, and monitoring healthcare processes.", "8,5"},
        // Domain 3: Population Health and Care Transitions
        {"Population Health Management Fundamentals", "Core concepts of population health including risk stratification, social determinants, and community health assessment.", "9,12"},
        {"Care Coordination Across the Continuum", "Best practices for coordinating care across settings, providers, and time to improve patient outcomes.", "10,11"},
        {"Safe and Effective Care Transitions", "Reducing readmissions and adverse events during transitions between care settings.", "11"},
        {"Health Equity in Quality Improvement", "Addressing disparities in healthcare quality and ensuring equitable care for all populations.", "12,9"},
        // Domain 4: Health Data Analytics
        {"Healthcare Data Collection and Validation", "Designing reliable data collection processes, ensuring data integrity, and managing healthcare data quality.", "13"},
        {"Statistical Methods for Quality Professionals", "Applying statistical analysis to healthcare quality data, including control charts, hypothesis testing, and regression.", "14,13"},
        {"Data Visualization and Dashboard Design", "Creating effective visualizations and dashboards that drive quality decisions at all organizational levels.", "15,14"},
        {"Health Information Technology for Quality", "Leveraging EHR systems, clinical decision support, and health IT infrastructure for quality measurement.", "16,15"},
        {"Advanced Analytics for Healthcare Quality", "Predictive modeling, machine learning applications, and advanced analytical techniques for quality improvement.", "14,15,16"},
        // Domain 5: Patient Safety
        {"Creating a Culture of Safety", "Building psychological safety, just culture principles, and high-reliability organization concepts.", "17"},
        {"Error Prevention and High-Reliability Healthcare", "Systems-based approaches to preventing medical errors including human factors engineering and failure mode analysis.", "18,17"},
        {"Root Cause Analysis and Event Investigation", "Conducting thorough safety event investigations, identifying system failures, and implementing corrective actions.", "19,18"},
        {"Medication Safety and Error Reduction", "Strategies for reducing medication errors across the prescribing, dispensing, and administration chain.", "18,19"},
        // Domain 6: Regulatory and Accreditation
        {"CMS Conditions of Participation: A Practical Guide", "Navigating federal regulatory requirements for healthcare quality and patient safety.", "20"},
        {"Joint Commission Accreditation Preparation", "Comprehensive preparation for Joint Commission surveys including standards interpretation and tracer methodology.", "21,20"},
        {"Interpreting and Applying Quality Standards", "Framework for understanding, interpreting, and operationalizing quality and safety standards.", "22,20,21"},
        {"State Regulatory Compliance for Quality Leaders", "Managing state-specific regulatory requirements and their intersection with federal standards.", "20,22"},
        // Domain 7: Quality Review and Accountability
        {"Effective Peer Review Processes", "Designing and conducting fair, effective, and legally sound peer review programs.", "23"},
        {"Outcome Measurement and Performance Metrics", "Defining, measuring, and reporting meaningful quality outcomes aligned with organizational goals.", "24,23"},
        {"Public Reporting and Transparency in Healthcare", "Managing public reporting requirements including CMS Star Ratings, Leapfrog, and state mandated reporting.", "25,24"},
        {"Quality Governance and Accountability Structures", "Establishing effective governance, committee structures, and accountability frameworks for quality.", "26,23"},
        // Domain 8: Professional Engagement
        {"Professional Development for Quality Leaders", "Career pathways, certifications (CPHQ), and continuous learning strategies for healthcare quality professionals.", "27"},
        {"Workforce Engagement and Empowerment", "Strategies for engaging and empowering healthcare workers in quality improvement at every level.", "28,27"},
        {"Communication and Influence for Quality Professionals", "Effective communication, presentation skills, and influencing techniques for quality leaders.", "29,28"},
        {"Coaching and Mentoring in Healthcare Quality", "Developing coaching skills to support quality improvement teams and emerging quality professionals.", "28,29"},
        // Cross-domain courses
        {"CPHQ Exam Preparation Course", "Comprehensive review course covering all domains of the Certified Professional in Healthcare Quality exam.", "1,5,9,13,17,20,23,27"},
        {"Introduction to Healthcare Quality for New Professionals", "Foundational course covering the healthcare quality landscape, key concepts, and professional expectations.", "1,5,17,27"},
        {"Quality Improvement in Ambulatory Settings", "Applying quality and safety principles specifically in outpatient, clinic, and ambulatory surgery settings.", "5,8,17,18"},
        {"Telehealth Quality and Safety", "Ensuring quality standards and patient safety in virtual care delivery.", "10,17,18,16"},
        {"AI and Machine Learning in Healthcare Quality", "Understanding how artificial intelligence can augment quality measurement, prediction, and improvement.", "14,15,16,5"},
    };

    public CourseService(EntityManager em) {
        this.em = em;
    }

    @Transactional
    public Map<String, Object> seedCourses() {
        Random rng = new Random(99); // deterministic

        int coursesCreated = 0;
        int mappingsCreated = 0;

        // Get framework version
        Object fvId = em.createNativeQuery("SELECT id FROM competency_framework_version WHERE version_label = '2025-v1'")
            .getSingleResult();

        for (String[] course : COURSE_DATA) {
            String title = course[0];
            String description = course[1];
            String[] compIds = course[2].split(",");

            // Generate a synthetic 384-dim embedding
            // In production, this would be: embeddingApi.embed(title + " " + description)
            float[] embedding = new float[384];
            double norm = 0;
            for (int i = 0; i < 384; i++) {
                embedding[i] = (float) rng.nextGaussian();
                norm += embedding[i] * embedding[i];
            }
            // Normalize to unit vector
            norm = Math.sqrt(norm);
            StringBuilder vecStr = new StringBuilder("[");
            for (int i = 0; i < 384; i++) {
                if (i > 0) vecStr.append(",");
                vecStr.append(embedding[i] / norm);
            }
            vecStr.append("]");

            // Insert course with embedding via native SQL (JPA doesn't handle vector type)
            BigDecimal hours = BigDecimal.valueOf(1.0 + rng.nextInt(16) * 0.5).setScale(1, RoundingMode.HALF_UP);
            boolean ceEligible = rng.nextDouble() > 0.3;

            em.createNativeQuery(
                "INSERT INTO lms_course (title, description, provider, duration_hours, ce_eligible, embedding) " +
                "VALUES (:title, :desc, 'NAHQ', :hours, :ce, CAST(:emb AS vector))"
            )
                .setParameter("title", title)
                .setParameter("desc", description)
                .setParameter("hours", hours)
                .setParameter("ce", ceEligible)
                .setParameter("emb", vecStr.toString())
                .executeUpdate();
            coursesCreated++;

            // Get the course ID
            Object courseId = em.createNativeQuery("SELECT currval('lms_course_id_seq')").getSingleResult();

            // Create competency mappings
            for (String compId : compIds) {
                double weight = compId.equals(compIds[0]) ? 1.0 : 0.5 + rng.nextDouble() * 0.5;
                em.createNativeQuery(
                    "INSERT INTO course_competency_mapping (course_id, competency_id, framework_version_id, relevance_weight) " +
                    "VALUES (:courseId, :compId, :fvId, :weight)"
                )
                    .setParameter("courseId", courseId)
                    .setParameter("compId", Long.parseLong(compId.trim()))
                    .setParameter("fvId", fvId)
                    .setParameter("weight", BigDecimal.valueOf(weight).setScale(2, RoundingMode.HALF_UP))
                    .executeUpdate();
                mappingsCreated++;
            }
        }

        return Map.of("courses", coursesCreated, "mappings", mappingsCreated);
    }

    @Transactional(readOnly = true)
    public CourseSimilarityDto findSimilarCourses(Long competencyId, int limit) {
        long start = System.currentTimeMillis();

        // Get competency name
        Object[] compInfo = (Object[]) em.createNativeQuery(
            "SELECT c.name, cd.name FROM competency c JOIN competency_domain cd ON c.domain_id = cd.id WHERE c.id = :id"
        ).setParameter("id", competencyId).getSingleResult();

        // Hybrid query: find courses mapped to this competency, ordered by relevance weight
        // PLUS vector similarity search for courses whose descriptions are semantically similar
        @SuppressWarnings("unchecked")
        List<Object[]> results = em.createNativeQuery(
            "WITH mapped_courses AS (" +
            "  SELECT lc.id, lc.title, lc.description, lc.duration_hours, lc.ce_eligible, " +
            "         ccm.relevance_weight, 'mapped' AS match_type " +
            "  FROM lms_course lc " +
            "  JOIN course_competency_mapping ccm ON lc.id = ccm.course_id " +
            "  WHERE ccm.competency_id = :compId" +
            "), " +
            "similar_courses AS (" +
            "  SELECT lc.id, lc.title, lc.description, lc.duration_hours, lc.ce_eligible, " +
            "         ROUND((1 - (lc.embedding <=> (SELECT embedding FROM lms_course WHERE id = (SELECT MIN(course_id) FROM course_competency_mapping WHERE competency_id = :compId))))::numeric, 3) AS relevance_weight, " +
            "         'vector_similar' AS match_type " +
            "  FROM lms_course lc " +
            "  WHERE lc.id NOT IN (SELECT id FROM mapped_courses) " +
            "  AND lc.embedding IS NOT NULL " +
            "  ORDER BY lc.embedding <=> (SELECT embedding FROM lms_course WHERE id = (SELECT MIN(course_id) FROM course_competency_mapping WHERE competency_id = :compId)) " +
            "  LIMIT :simLimit" +
            ") " +
            "SELECT * FROM mapped_courses " +
            "UNION ALL " +
            "SELECT * FROM similar_courses " +
            "ORDER BY relevance_weight DESC " +
            "LIMIT :totalLimit"
        )
            .setParameter("compId", competencyId)
            .setParameter("simLimit", limit)
            .setParameter("totalLimit", limit)
            .getResultList();

        List<SimilarCourse> courses = new ArrayList<>();
        for (Object[] row : results) {
            courses.add(new SimilarCourse(
                ((Number) row[0]).longValue(),
                (String) row[1],
                (String) row[2],
                row[3] != null ? new BigDecimal(row[3].toString()) : null,
                row[4] != null && (Boolean) row[4],
                new BigDecimal(row[5].toString()),
                (String) row[6]
            ));
        }

        long elapsed = System.currentTimeMillis() - start;
        return new CourseSimilarityDto(
            competencyId, (String) compInfo[0], (String) compInfo[1],
            courses, elapsed
        );
    }

    @Transactional(readOnly = true)
    public CourseSimilarityDto findCoursesForTopGaps(Long userId, int topN) {
        long start = System.currentTimeMillis();

        // Resolve User → Party, then query via Party model
        @SuppressWarnings("unchecked")
        List<Object[]> gaps = em.createNativeQuery(
            "SELECT ar.competency_id, c.name, (ar.score - COALESCE(rt.target_score, 0)) AS gap " +
            "FROM assessment_result ar " +
            "JOIN assessment a ON ar.assessment_id = a.id " +
            "JOIN competency c ON ar.competency_id = c.id " +
            "JOIN app_user u ON u.party_id = a.party_id " +
            "LEFT JOIN party_role pr ON a.party_id = pr.party_id AND pr.thru_date IS NULL " +
            "LEFT JOIN role_target rt ON pr.role_type_id = rt.role_type_id AND ar.competency_id = rt.competency_id " +
            "WHERE u.id = :userId AND a.status = 'SCORED' " +
            "ORDER BY gap ASC " +
            "LIMIT :topN"
        ).setParameter("userId", userId).setParameter("topN", topN).getResultList();

        // Find courses for those competencies
        List<Long> compIds = gaps.stream().map(g -> ((Number) g[0]).longValue()).toList();

        @SuppressWarnings("unchecked")
        List<Object[]> courses = em.createNativeQuery(
            "SELECT DISTINCT lc.id, lc.title, lc.description, lc.duration_hours, lc.ce_eligible, " +
            "       MAX(ccm.relevance_weight) AS relevance, 'gap_targeted' AS match_type " +
            "FROM lms_course lc " +
            "JOIN course_competency_mapping ccm ON lc.id = ccm.course_id " +
            "WHERE ccm.competency_id IN :compIds " +
            "GROUP BY lc.id, lc.title, lc.description, lc.duration_hours, lc.ce_eligible " +
            "ORDER BY relevance DESC " +
            "LIMIT 10"
        ).setParameter("compIds", compIds).getResultList();

        List<SimilarCourse> courseList = courses.stream().map(row -> new SimilarCourse(
            ((Number) row[0]).longValue(), (String) row[1], (String) row[2],
            row[3] != null ? new BigDecimal(row[3].toString()) : null,
            row[4] != null && (Boolean) row[4],
            new BigDecimal(row[5].toString()), (String) row[6]
        )).toList();

        long elapsed = System.currentTimeMillis() - start;
        String gapSummary = gaps.stream().map(g -> (String) g[1]).reduce((a, b) -> a + ", " + b).orElse("");
        return new CourseSimilarityDto(null, "Top " + topN + " gaps", gapSummary, courseList, elapsed);
    }
}
