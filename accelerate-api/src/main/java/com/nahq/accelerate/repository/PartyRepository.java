package com.nahq.accelerate.repository;

import com.nahq.accelerate.domain.Party;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartyRepository extends JpaRepository<Party, Long> {
}
