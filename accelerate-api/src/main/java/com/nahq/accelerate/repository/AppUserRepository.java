package com.nahq.accelerate.repository;

import com.nahq.accelerate.domain.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByPartyId(Long partyId);
}
