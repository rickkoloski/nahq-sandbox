package com.nahq.accelerate.repository;

import com.nahq.accelerate.domain.Engagement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EngagementRepository extends JpaRepository<Engagement, Long> {
}
