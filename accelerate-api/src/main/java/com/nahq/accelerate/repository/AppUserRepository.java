package com.nahq.accelerate.repository;

import com.nahq.accelerate.domain.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    List<AppUser> findByOrganizationId(Long organizationId);
}
