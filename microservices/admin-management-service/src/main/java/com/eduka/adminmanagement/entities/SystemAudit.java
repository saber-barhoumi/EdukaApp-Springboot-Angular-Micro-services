package com.eduka.adminmanagement.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String action;
    
    @Column(nullable = false)
    private String performedBy;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date actionDate;
    
    private String ipAddress;
    private String entityType;
    private String entityId;
    
    @Column(columnDefinition = "TEXT")
    private String changes;
    
    @PrePersist
    protected void onCreate() {
        actionDate = new Date();
    }
}