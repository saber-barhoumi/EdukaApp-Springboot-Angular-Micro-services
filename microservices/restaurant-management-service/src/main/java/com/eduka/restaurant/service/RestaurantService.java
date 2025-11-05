package com.eduka.restaurant.service;

import com.eduka.restaurant.model.Restaurant;
import com.eduka.restaurant.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RestaurantService {
    
    @Autowired
    private RestaurantRepository restaurantRepository;
    
    public Restaurant createRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }
    
    public Restaurant updateRestaurant(Long id, Restaurant restaurantDetails) {
        Restaurant restaurant = restaurantRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
        
        restaurant.setName(restaurantDetails.getName());
        restaurant.setAddress(restaurantDetails.getAddress());
        restaurant.setType(restaurantDetails.getType());
        restaurant.setDescription(restaurantDetails.getDescription());
        restaurant.setPhoneNumber(restaurantDetails.getPhoneNumber());
        restaurant.setEmail(restaurantDetails.getEmail());
        restaurant.setOpeningHours(restaurantDetails.getOpeningHours());
        restaurant.setImageUrl(restaurantDetails.getImageUrl());
        restaurant.setIsActive(restaurantDetails.getIsActive());
        
        return restaurantRepository.save(restaurant);
    }
    
    public void deleteRestaurant(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
        restaurantRepository.delete(restaurant);
    }
    
    public Restaurant getRestaurant(Long id) {
        return restaurantRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
    }
    
    public Restaurant getRestaurantWithMenuItems(Long id) {
        return restaurantRepository.findByIdWithMenuItems(id);
    }
    
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }
    
    public List<Restaurant> getActiveRestaurants() {
        return restaurantRepository.findByIsActiveTrue();
    }
    
    public List<Restaurant> getRestaurantsByType(String type) {
        return restaurantRepository.findByType(type);
    }
    
    public List<Restaurant> searchRestaurantsByName(String name) {
        return restaurantRepository.findByNameContainingIgnoreCase(name);
    }
    
    public Restaurant assignUserToRestaurant(Long restaurantId, Long userId) {
        Restaurant restaurant = getRestaurant(restaurantId);
        restaurant.assignUser(userId);
        return restaurantRepository.save(restaurant);
    }
    
    public Restaurant unassignUserFromRestaurant(Long restaurantId, Long userId) {
        Restaurant restaurant = getRestaurant(restaurantId);
        restaurant.unassignUser(userId);
        return restaurantRepository.save(restaurant);
    }
    
    public List<Restaurant> getRestaurantsByUserId(Long userId) {
        return restaurantRepository.findByAssignedUserId(userId);
    }
}
