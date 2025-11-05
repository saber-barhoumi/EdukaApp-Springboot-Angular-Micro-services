package com.eduka.restaurant.repository;

import com.eduka.restaurant.model.Order;
import com.eduka.restaurant.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByUserId(Long userId);
    
    List<Order> findByRestaurantId(Long restaurantId);
    
    List<Order> findByStatus(OrderStatus status);
    
    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);
    
    List<Order> findByRestaurantIdAndStatus(Long restaurantId, OrderStatus status);
    
    @Query("SELECT o FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate")
    List<Order> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                 @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.id = :id")
    Order findByIdWithItems(@Param("id") Long id);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.restaurant.id = :restaurantId AND o.status = 'COMPLETED'")
    Double calculateTotalRevenue(@Param("restaurantId") Long restaurantId);
}
