package com.nahq.accelerate.repository;

import com.nahq.accelerate.domain.Individual;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface IndividualRepository extends JpaRepository<Individual, Long> {
    Optional<Individual> findByPartyId(Long partyId);
}
