package com.nahq.accelerate.repository;

import com.nahq.accelerate.domain.RoleTarget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoleTargetRepository extends JpaRepository<RoleTarget, Long> {
    List<RoleTarget> findByRoleTypeIdAndFrameworkVersionId(Long roleTypeId, Long frameworkVersionId);
    List<RoleTarget> findByRoleTypeInternalIdAndFrameworkVersionVersionLabel(String internalId, String versionLabel);
}
