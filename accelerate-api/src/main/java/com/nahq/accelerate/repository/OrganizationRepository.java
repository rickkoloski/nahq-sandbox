package com.nahq.accelerate.repository;

import com.nahq.accelerate.domain.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
}
