package com.eduka.restaurant.service;

import com.eduka.restaurant.model.MenuItem;
import com.eduka.restaurant.model.Order;
import com.eduka.restaurant.model.OrderStatus;
import com.eduka.restaurant.model.Restaurant;
import com.eduka.restaurant.repository.MenuItemRepository;
import com.eduka.restaurant.repository.OrderRepository;
import com.eduka.restaurant.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private RestaurantRepository restaurantRepository;
    
    @Autowired
    private MenuItemRepository menuItemRepository;
    
    public Order createOrder(Order order, Long restaurantId, List<Long> menuItemIds) {
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
        
        return orderRepository.save(order);
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
    
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }
    
    public List<Order> getOrdersByRestaurantId(Long restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId);
    }
    
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }
    
    public List<Order> getOrdersByUserIdAndStatus(Long userId, OrderStatus status) {
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
