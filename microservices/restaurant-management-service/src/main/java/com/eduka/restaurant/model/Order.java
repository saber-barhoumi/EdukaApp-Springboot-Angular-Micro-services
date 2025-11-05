package com.eduka.restaurant.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId; // Reference to User from User Management Service
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;
    
    @ManyToMany
    @JoinTable(
        name = "order_menu_items",
        joinColumns = @JoinColumn(name = "order_id"),
        inverseJoinColumns = @JoinColumn(name = "menu_item_id")
    )
    private List<MenuItem> items = new ArrayList<>();
    
    @Column(nullable = false)
    private Double totalAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;
    
    private String notes;
    
    @Column(name = "delivery_address")
    private String deliveryAddress;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Helper methods
    public void addItem(MenuItem menuItem) {
        items.add(menuItem);
        calculateTotal();
    }
    
    public void removeItem(MenuItem menuItem) {
        items.remove(menuItem);
        calculateTotal();
    }
    
    public void calculateTotal() {
        this.totalAmount = items.stream()
            .mapToDouble(MenuItem::getPrice)
            .sum();
    }
    
    public void completeOrder() {
        this.status = OrderStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
    }
    
    public void cancelOrder() {
        this.status = OrderStatus.CANCELLED;
    }
}
