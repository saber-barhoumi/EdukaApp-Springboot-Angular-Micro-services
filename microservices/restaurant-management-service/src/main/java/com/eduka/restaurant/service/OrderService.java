package com.eduka.restaurant.service;

import com.eduka.restaurant.client.NotificationMessageDTO;
import com.eduka.restaurant.client.NotificationServiceClient;
import com.eduka.restaurant.client.UserClient;
import com.eduka.restaurant.dto.UserDTO;
import com.eduka.restaurant.model.MenuItem;
import com.eduka.restaurant.model.Order;
import com.eduka.restaurant.model.OrderStatus;
import com.eduka.restaurant.model.Restaurant;
import com.eduka.restaurant.repository.MenuItemRepository;
import com.eduka.restaurant.repository.OrderRepository;
import com.eduka.restaurant.repository.RestaurantRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import feign.FeignException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@Slf4j
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private RestaurantRepository restaurantRepository;
    
    @Autowired
    private MenuItemRepository menuItemRepository;
    
    @Autowired
    private UserClient userClient;
    
    @Autowired
    private NotificationServiceClient notificationServiceClient;
    
    /**
     * Validate that a user exists before creating an order
     * @param userId MongoDB ObjectId to validate
     * @throws RuntimeException if user does not exist or service is unavailable
     */
    private void validateUser(String userId) {
        try {
            Boolean isValid = userClient.validateUser(userId);
            if (isValid == null || !isValid) {
                throw new RuntimeException("User not found with id: " + userId);
            }
        } catch (FeignException.NotFound e) {
            throw new RuntimeException("User not found with id: " + userId);
        } catch (FeignException e) {
            throw new RuntimeException("Unable to validate user. User service may be unavailable: " + e.getMessage());
        }
    }
    
    public Order createOrder(Order order, Long restaurantId, List<Long> menuItemIds) {
        // Validate user exists before creating order
        // TODO: Re-enable user validation when Node.js User Service is containerized
        // TEMPORARILY DISABLED for Docker workshop - Node.js service not in docker-compose
        /*
        if (order.getUserId() != null) {
            validateUser(order.getUserId());
        }
        */
        
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
            .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + restaurantId));
        
        order.setRestaurant(restaurant);
        
        // Add menu items to order
        for (Long itemId : menuItemIds) {
            MenuItem menuItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("MenuItem not found with id: " + itemId));
            order.addItem(menuItem);
        }
        
        order.calculateTotal();
        order.setStatus(OrderStatus.PENDING);
        
        Order savedOrder = orderRepository.save(order);
        
        // 🔥 FEIGN CLIENT COMMUNICATION #1: Restaurant → Notification Service
        // Send order confirmation notification via RabbitMQ
        sendOrderNotification(savedOrder);
        
        return savedOrder;
    }
    
    /**
     * Send order notification using Feign Client to Notification Service
     * This demonstrates inter-service communication pattern
     */
    private void sendOrderNotification(Order order) {
        try {
            NotificationMessageDTO notification = new NotificationMessageDTO();
            notification.setUserId(order.getUserId());
            notification.setType("ORDER");
            notification.setSubject("Order Confirmation");
            notification.setMessage("Your order has been placed successfully!");
            notification.setTimestamp(LocalDateTime.now());
            
            NotificationMessageDTO.NotificationDetails details = new NotificationMessageDTO.NotificationDetails();
            details.setOrderId(order.getId().toString());
            details.setRestaurantName(order.getRestaurant().getName());
            details.setTotalAmount(order.getTotalAmount());
            notification.setDetails(details);
            
            // Call Notification Service via Feign Client
            notificationServiceClient.sendNotification(notification);
            log.info("✅ Order notification sent via Feign Client for order: {}", order.getId());
            
        } catch (Exception e) {
            log.error("❌ Failed to send order notification: {}", e.getMessage());
            // Don't fail the order creation if notification fails
        }
    }
    
    public Order updateOrder(Long id, Order orderDetails) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        
        order.setStatus(orderDetails.getStatus());
        order.setNotes(orderDetails.getNotes());
        order.setDeliveryAddress(orderDetails.getDeliveryAddress());
        
        if (orderDetails.getStatus() == OrderStatus.COMPLETED) {
            order.completeOrder();
        }
        
        return orderRepository.save(order);
    }
    
    public Order updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        
        order.setStatus(status);
        if (status == OrderStatus.COMPLETED) {
            order.completeOrder();
        } else if (status == OrderStatus.CANCELLED) {
            order.cancelOrder();
        }
        
        return orderRepository.save(order);
    }
    
    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        orderRepository.delete(order);
    }
    
    public Order getOrder(Long id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }
    
    public Order getOrderWithItems(Long id) {
        return orderRepository.findByIdWithItems(id);
    }
    
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    public List<Order> getOrdersByUserId(String userId) {
        return orderRepository.findByUserId(userId);
    }
    
    public List<Order> getOrdersByRestaurantId(Long restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId);
    }
    
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }
    
    public List<Order> getOrdersByUserIdAndStatus(String userId, OrderStatus status) {
        return orderRepository.findByUserIdAndStatus(userId, status);
    }
    
    public List<Order> getOrdersByRestaurantIdAndStatus(Long restaurantId, OrderStatus status) {
        return orderRepository.findByRestaurantIdAndStatus(restaurantId, status);
    }
    
    public List<Order> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findByDateRange(startDate, endDate);
    }
    
    public Double calculateRestaurantRevenue(Long restaurantId) {
        return orderRepository.calculateTotalRevenue(restaurantId);
    }
    
    public Order addItemToOrder(Long orderId, Long menuItemId) {
        Order order = getOrder(orderId);
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
            .orElseThrow(() -> new RuntimeException("MenuItem not found with id: " + menuItemId));
        
        order.addItem(menuItem);
        return orderRepository.save(order);
    }
    
    public Order removeItemFromOrder(Long orderId, Long menuItemId) {
        Order order = getOrder(orderId);
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
            .orElseThrow(() -> new RuntimeException("MenuItem not found with id: " + menuItemId));
        
        order.removeItem(menuItem);
        return orderRepository.save(order);
    }
}
