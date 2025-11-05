package com.ski.eduka.repository;

import com.ski.eduka.entity.User;
import com.ski.eduka.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Find user by email address
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Find user by username
     */
    Optional<User> findByUsername(String username);
    
    /**
     * Find user by email or username
     */
    @Query("SELECT u FROM User u WHERE u.email = ?1 OR u.username = ?1")
    Optional<User> findByEmailOrUsername(String emailOrUsername);
    
    /**
     * Find all active users
     */
    List<User> findByIsActiveTrue();
    
    /**
     * Find users by role
     */
    List<User> findByRole(Role role);
    
    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);
    
    /**
     * Check if username exists
     */
    boolean existsByUsername(String username);
    
    /**
     * Find users by age range
     */
    List<User> findByAgeBetween(Integer minAge, Integer maxAge);
    
    /**
     * Count active users
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true")
    long countActiveUsers();
    
    /**
     * Find users assigned to a specific restaurant
     */
    @Query("SELECT u FROM User u WHERE :restaurantId MEMBER OF u.assignedRestaurantIds")
    List<User> findByAssignedRestaurantId(@Param("restaurantId") Long restaurantId);
}
