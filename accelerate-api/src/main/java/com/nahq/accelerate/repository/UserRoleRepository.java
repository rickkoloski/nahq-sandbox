package com.nahq.accelerate.repository;

import com.nahq.accelerate.domain.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    List<UserRole> findByUserIdAndThruDateIsNull(Long userId);
}
