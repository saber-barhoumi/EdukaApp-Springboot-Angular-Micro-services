package com.eduka.adminmanagement.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AcademicProgram {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String programName;
    
    @Column(unique = true)
    private String programCode;
    
    private String description;
    private String duration;
    private boolean isActive;
    
    @Column(nullable = false)
    private String userId; // User ID from user-management-service
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    @OneToMany(mappedBy = "academicProgram")
    private List<Department> departments;
    
    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
    }
}