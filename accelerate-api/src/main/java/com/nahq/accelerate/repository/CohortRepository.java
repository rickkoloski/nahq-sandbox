package com.nahq.accelerate.repository;

import com.nahq.accelerate.domain.Cohort;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CohortRepository extends JpaRepository<Cohort, Long> {
}
