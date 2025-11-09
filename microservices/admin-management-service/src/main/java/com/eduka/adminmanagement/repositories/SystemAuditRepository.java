package com.eduka.adminmanagement.repositories;

import com.eduka.adminmanagement.entities.SystemAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface SystemAuditRepository extends JpaRepository<SystemAudit, Long> {
    List<SystemAudit> findByActionDateBetween(Date startDate, Date endDate);
    List<SystemAudit> findByPerformedBy(String username);
    List<SystemAudit> findByEntityTypeAndEntityId(String entityType, String entityId);
}