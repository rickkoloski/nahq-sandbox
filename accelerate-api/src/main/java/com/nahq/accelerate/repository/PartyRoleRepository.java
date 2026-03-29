package com.nahq.accelerate.repository;

import com.nahq.accelerate.domain.PartyRole;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PartyRoleRepository extends JpaRepository<PartyRole, Long> {
    List<PartyRole> findByPartyIdAndThruDateIsNull(Long partyId);
}
