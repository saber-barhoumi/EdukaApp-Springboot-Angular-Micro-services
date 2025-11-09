package com.eduka.adminmanagement.services;

import com.eduka.adminmanagement.entities.SystemAudit;
import com.eduka.adminmanagement.repositories.SystemAuditRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class SystemAuditService {
    
    private final SystemAuditRepository auditRepository;
    private final HttpServletRequest request;

    @Transactional
    public void logAction(String action, String entityType, String entityId, String changes) {
        SystemAudit audit = new SystemAudit();
        audit.setAction(action);
        audit.setEntityType(entityType);
        audit.setEntityId(entityId);
        audit.setChanges(changes);
        audit.setPerformedBy(getCurrentUser());
        audit.setIpAddress(getClientIp());
        
        auditRepository.save(audit);
    }

    private String getCurrentUser() {
        // In a real application, this would come from your security context
        return "system"; // Placeholder
    }

    private String getClientIp() {
        String remoteAddr = request.getHeader("X-FORWARDED-FOR");
        if (remoteAddr == null || remoteAddr.isEmpty()) {
            remoteAddr = request.getRemoteAddr();
        }
        return remoteAddr;
    }
}