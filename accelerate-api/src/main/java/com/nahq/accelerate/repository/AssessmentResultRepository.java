package com.nahq.accelerate.repository;

import com.nahq.accelerate.domain.AssessmentResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssessmentResultRepository extends JpaRepository<AssessmentResult, Long> {
    List<AssessmentResult> findByAssessmentId(Long assessmentId);

    // Party-based lookup (domain model)
    List<AssessmentResult> findByAssessmentPartyId(Long partyId);

    // Legacy user-based lookup (retained during transition)
    List<AssessmentResult> findByAssessmentUserId(Long userId);
}
