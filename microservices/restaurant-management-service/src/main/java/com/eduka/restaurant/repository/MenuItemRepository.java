
package com.eduka.restaurant.repository;

import com.eduka.restaurant.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    
    List<MenuItem> findByRestaurantId(Long restaurantId);
    
    List<MenuItem> findByCategory(String category);
    
    List<MenuItem> findByIsAvailableTrue();
    
    List<MenuItem> findByRestaurantIdAndIsAvailableTrue(Long restaurantId);
    
    List<MenuItem> findByNameContainingIgnoreCase(String name);
    
    List<MenuItem> findByRestaurantIdAndCategory(Long restaurantId, String category);
}
