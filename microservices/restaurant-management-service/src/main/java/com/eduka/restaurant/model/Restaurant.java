package com.eduka.restaurant.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "restaurants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Restaurant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String address;
    
    private String type; // Fast Food, Fine Dining, Cafeteria, etc.
    
    private String description;
    
    private String phoneNumber;
    
    private String email;
    
    @Column(name = "opening_hours")
    private String openingHours;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // One-to-Many: Restaurant -> MenuItem
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<MenuItem> menuItems = new ArrayList<>();
    
    // One-to-Many: Restaurant -> Order
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Order> orders = new ArrayList<>();
    
    // Many-to-Many: Restaurant <-> User (assigned users)
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "restaurant_users", joinColumns = @JoinColumn(name = "restaurant_id"))
    @Column(name = "user_id")
    @JsonIgnore
    private Set<Long> assignedUserIds = new HashSet<>();
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Helper methods
    public void addMenuItem(MenuItem menuItem) {
        menuItems.add(menuItem);
        menuItem.setRestaurant(this);
    }
    
    public void removeMenuItem(MenuItem menuItem) {
        menuItems.remove(menuItem);
        menuItem.setRestaurant(null);
    }
    
    public void assignUser(Long userId) {
        assignedUserIds.add(userId);
    }
    
    public void unassignUser(Long userId) {
        assignedUserIds.remove(userId);
    }
}
