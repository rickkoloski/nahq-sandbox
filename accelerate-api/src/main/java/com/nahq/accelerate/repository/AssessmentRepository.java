package com.nahq.accelerate.repository;

import com.nahq.accelerate.domain.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    Optional<Assessment> findByPartyIdAndAssessmentCycleId(Long partyId, Long cycleId);
}
