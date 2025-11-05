package com.eduka.restaurant.controller;

import com.eduka.restaurant.dto.CreateOrderRequest;
import com.eduka.restaurant.model.Order;
import com.eduka.restaurant.model.OrderStatus;
import com.eduka.restaurant.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
// @CrossOrigin removed - CORS is now handled globally in SecurityConfig
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody CreateOrderRequest request) {
        Order order = new Order();
        order.setUserId(request.getUserId());  // Now accepts String MongoDB ObjectId
        order.setNotes(request.getNotes());
        order.setDeliveryAddress(request.getDeliveryAddress());
        
        Order created = orderService.createOrder(order, request.getRestaurantId(), request.getMenuItemIds());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(
            @PathVariable Long id, 
            @RequestBody Order order) {
        Order updated = orderService.updateOrder(id, order);
        return ResponseEntity.ok(updated);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id, 
            @RequestParam OrderStatus status) {
        Order updated = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        Order order = orderService.getOrder(id);
        return ResponseEntity.ok(order);
    }
    
    @GetMapping("/{id}/details")
    public ResponseEntity<Order> getOrderWithItems(@PathVariable Long id) {
        Order order = orderService.getOrderWithItems(id);
        return ResponseEntity.ok(order);
    }
    
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable String userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Order>> getOrdersByRestaurant(@PathVariable Long restaurantId) {
        List<Order> orders = orderService.getOrdersByRestaurantId(restaurantId);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable OrderStatus status) {
        List<Order> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByUserAndStatus(
            @PathVariable String userId, 
            @PathVariable OrderStatus status) {
        List<Order> orders = orderService.getOrdersByUserIdAndStatus(userId, status);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/restaurant/{restaurantId}/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByRestaurantAndStatus(
            @PathVariable Long restaurantId, 
            @PathVariable OrderStatus status) {
        List<Order> orders = orderService.getOrdersByRestaurantIdAndStatus(restaurantId, status);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<Order>> getOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<Order> orders = orderService.getOrdersByDateRange(startDate, endDate);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/restaurant/{restaurantId}/revenue")
    public ResponseEntity<Double> getRestaurantRevenue(@PathVariable Long restaurantId) {
        Double revenue = orderService.calculateRestaurantRevenue(restaurantId);
        return ResponseEntity.ok(revenue != null ? revenue : 0.0);
    }
    
    @PostMapping("/{orderId}/items/{menuItemId}")
    public ResponseEntity<Order> addItemToOrder(
            @PathVariable Long orderId, 
            @PathVariable Long menuItemId) {
        Order order = orderService.addItemToOrder(orderId, menuItemId);
        return ResponseEntity.ok(order);
    }
    
    @DeleteMapping("/{orderId}/items/{menuItemId}")
    public ResponseEntity<Order> removeItemFromOrder(
            @PathVariable Long orderId, 
            @PathVariable Long menuItemId) {
        Order order = orderService.removeItemFromOrder(orderId, menuItemId);
        return ResponseEntity.ok(order);
    }
}
