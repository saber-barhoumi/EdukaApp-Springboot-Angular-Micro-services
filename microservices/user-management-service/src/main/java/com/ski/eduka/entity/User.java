package com.ski.eduka.entity;

import com.ski.eduka.enums.Role;
import com.ski.eduka.enums.Gender;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;
    
    @Column(name = "username")
    private String username;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Enumerated(EnumType.STRING)
    private Role role = Role.CLIENT;
    
    @Enumerated(EnumType.STRING)
    private Gender gender;
    
    private Integer age;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Many-to-Many: User <-> Restaurant (assigned restaurants)
    @ElementCollection
    @CollectionTable(name = "user_restaurants", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "restaurant_id")
    private Set<Long> assignedRestaurantIds = new HashSet<>();
    
    // AI Analysis fields (for students)
    @Column(name = "last_analysis_date")
    private LocalDateTime lastAnalysisDate;
    
    @Column(name = "academic_standing")
    private String academicStanding;
    
    @Column(name = "risk_level")
    private String riskLevel;
    
    @Column(name = "dropout_probability")
    private Double dropoutProbability;
    
    @Column(name = "improvement_potential")
    private Double improvementPotential;
    
    @Column(name = "ai_confidence_score")
    private Double aiConfidenceScore;
    
    @Column(name = "arabic_level")
    private String arabicLevel;
    
    @Column(name = "french_level")
    private String frenchLevel;
    
    @Column(name = "english_level")
    private String englishLevel;
    
    @Column(name = "analysis_id")
    private String analysisId;
    
    // Helper method for isActive
    public boolean isActive() {
        return Boolean.TRUE.equals(isActive);
    }
    
    // Helper methods for restaurant management
    public void assignRestaurant(Long restaurantId) {
        assignedRestaurantIds.add(restaurantId);
    }
    
    public void unassignRestaurant(Long restaurantId) {
        assignedRestaurantIds.remove(restaurantId);
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
