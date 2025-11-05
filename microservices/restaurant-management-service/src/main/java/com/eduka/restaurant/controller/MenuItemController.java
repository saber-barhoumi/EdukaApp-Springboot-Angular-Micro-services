
package com.eduka.restaurant.controller;

import com.eduka.restaurant.model.MenuItem;
import com.eduka.restaurant.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-items")
// @CrossOrigin removed - CORS is now handled globally in SecurityConfig
public class MenuItemController {
    
    @Autowired
    private MenuItemService menuItemService;

    // Create menu item
    @PostMapping
    public ResponseEntity<MenuItem> createMenuItem(
            @RequestBody MenuItem menuItem,
            @RequestParam Long restaurantId) {
        MenuItem created = menuItemService.createMenuItem(menuItem, restaurantId);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Update menu item
    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(
            @PathVariable Long id, 
            @RequestBody MenuItem menuItem) {
        MenuItem updated = menuItemService.updateMenuItem(id, menuItem);
        return ResponseEntity.ok(updated);
    }

    // Delete menu item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }

    // Get menu item
    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItem(@PathVariable Long id) {
        MenuItem menuItem = menuItemService.getMenuItem(id);
        return ResponseEntity.ok(menuItem);
    }

    // Get all menu items
    @GetMapping
    public ResponseEntity<List<MenuItem>> getAllMenuItems() {
        List<MenuItem> menuItems = menuItemService.getAllMenuItems();
        return ResponseEntity.ok(menuItems);
    }
    
    // Get menu items by restaurant
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<MenuItem>> getMenuItemsByRestaurant(@PathVariable Long restaurantId) {
        List<MenuItem> menuItems = menuItemService.getMenuItemsByRestaurant(restaurantId);
        return ResponseEntity.ok(menuItems);
    }
    
    // Get available menu items by restaurant
    @GetMapping("/restaurant/{restaurantId}/available")
    public ResponseEntity<List<MenuItem>> getAvailableMenuItemsByRestaurant(@PathVariable Long restaurantId) {
        List<MenuItem> menuItems = menuItemService.getAvailableMenuItemsByRestaurant(restaurantId);
        return ResponseEntity.ok(menuItems);
    }
    
    // Get menu items by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<MenuItem>> getMenuItemsByCategory(@PathVariable String category) {
        List<MenuItem> menuItems = menuItemService.getMenuItemsByCategory(category);
        return ResponseEntity.ok(menuItems);
    }
    
    // Get available menu items
    @GetMapping("/available")
    public ResponseEntity<List<MenuItem>> getAvailableMenuItems() {
        List<MenuItem> menuItems = menuItemService.getAvailableMenuItems();
        return ResponseEntity.ok(menuItems);
    }
    
    // Search menu items
    @GetMapping("/search")
    public ResponseEntity<List<MenuItem>> searchMenuItems(@RequestParam String name) {
        List<MenuItem> menuItems = menuItemService.searchMenuItems(name);
        return ResponseEntity.ok(menuItems);
    }
}

