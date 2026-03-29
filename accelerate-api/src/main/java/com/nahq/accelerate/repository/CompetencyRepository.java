package com.nahq.accelerate.repository;

import com.nahq.accelerate.domain.Competency;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CompetencyRepository extends JpaRepository<Competency, Long> {
    List<Competency> findByDomainIdOrderByDisplayOrder(Long domainId);
}
