package com.nahq.accelerate.repository;

import com.nahq.accelerate.domain.CompetencyFrameworkVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CompetencyFrameworkVersionRepository extends JpaRepository<CompetencyFrameworkVersion, Long> {
    Optional<CompetencyFrameworkVersion> findByVersionLabel(String versionLabel);
}
