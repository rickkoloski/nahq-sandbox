package com.nahq.accelerate.repository;

import com.nahq.accelerate.domain.CompetencyDomain;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CompetencyDomainRepository extends JpaRepository<CompetencyDomain, Long> {
    List<CompetencyDomain> findAllByOrderByDisplayOrder();
}
