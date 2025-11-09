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
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String departmentName;
    
    @Column(unique = true)
    private String departmentCode;
    
    private String description;
    private String location;
    
    @ManyToOne
    @JoinColumn(name = "academic_program_id")
    private AcademicProgram academicProgram;
    
    @Column(name = "head_of_department")
    private String headOfDepartment;
    
    @Column(nullable = false)
    private String userId; // User ID from user-management-service
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
    }
}