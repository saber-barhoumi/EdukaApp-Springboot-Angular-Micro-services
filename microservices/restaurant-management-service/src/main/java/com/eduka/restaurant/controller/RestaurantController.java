package com.eduka.restaurant.controller;

import com.eduka.restaurant.model.Restaurant;
import com.eduka.restaurant.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
// @CrossOrigin removed - CORS is now handled globally in SecurityConfig
public class RestaurantController {
    
    @Autowired
    private RestaurantService restaurantService;
    
    @PostMapping
    public ResponseEntity<Restaurant> createRestaurant(@RequestBody Restaurant restaurant) {
        Restaurant created = restaurantService.createRestaurant(restaurant);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(
            @PathVariable Long id, 
            @RequestBody Restaurant restaurant) {
        Restaurant updated = restaurantService.updateRestaurant(id, restaurant);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurant(@PathVariable Long id) {
        Restaurant restaurant = restaurantService.getRestaurant(id);
        return ResponseEntity.ok(restaurant);
    }
    
    @GetMapping("/{id}/menu")
    public ResponseEntity<Restaurant> getRestaurantWithMenu(@PathVariable Long id) {
        Restaurant restaurant = restaurantService.getRestaurantWithMenuItems(id);
        return ResponseEntity.ok(restaurant);
    }
    
    @GetMapping
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        List<Restaurant> restaurants = restaurantService.getAllRestaurants();
        System.out.println("DEBUG: Found " + restaurants.size() + " restaurants");
        for (Restaurant r : restaurants) {
            System.out.println("DEBUG: Restaurant ID=" + r.getId() + ", Name=" + r.getName());
        }
        return ResponseEntity.ok(restaurants);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<Restaurant>> getActiveRestaurants() {
        List<Restaurant> restaurants = restaurantService.getActiveRestaurants();
        return ResponseEntity.ok(restaurants);
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Restaurant>> getRestaurantsByType(@PathVariable String type) {
        List<Restaurant> restaurants = restaurantService.getRestaurantsByType(type);
        return ResponseEntity.ok(restaurants);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Restaurant>> searchRestaurants(@RequestParam String name) {
        List<Restaurant> restaurants = restaurantService.searchRestaurantsByName(name);
        return ResponseEntity.ok(restaurants);
    }
    
    @PostMapping("/{restaurantId}/users/{userId}")
    public ResponseEntity<Restaurant> assignUser(
            @PathVariable Long restaurantId, 
            @PathVariable Long userId) {
        Restaurant restaurant = restaurantService.assignUserToRestaurant(restaurantId, userId);
        return ResponseEntity.ok(restaurant);
    }
    
    @DeleteMapping("/{restaurantId}/users/{userId}")
    public ResponseEntity<Restaurant> unassignUser(
            @PathVariable Long restaurantId, 
            @PathVariable Long userId) {
        Restaurant restaurant = restaurantService.unassignUserFromRestaurant(restaurantId, userId);
        return ResponseEntity.ok(restaurant);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Restaurant>> getRestaurantsByUser(@PathVariable Long userId) {
        List<Restaurant> restaurants = restaurantService.getRestaurantsByUserId(userId);
        return ResponseEntity.ok(restaurants);
    }
}
