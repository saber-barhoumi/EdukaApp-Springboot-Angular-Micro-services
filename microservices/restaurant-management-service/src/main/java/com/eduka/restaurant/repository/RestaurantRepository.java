package com.eduka.restaurant.repository;

import com.eduka.restaurant.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    
    List<Restaurant> findByIsActiveTrue();
    
    List<Restaurant> findByType(String type);
    
    List<Restaurant> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT r FROM Restaurant r WHERE :userId MEMBER OF r.assignedUserIds")
    List<Restaurant> findByAssignedUserId(@Param("userId") Long userId);
    
    @Query("SELECT r FROM Restaurant r LEFT JOIN FETCH r.menuItems WHERE r.id = :id")
    Restaurant findByIdWithMenuItems(@Param("id") Long id);
}
