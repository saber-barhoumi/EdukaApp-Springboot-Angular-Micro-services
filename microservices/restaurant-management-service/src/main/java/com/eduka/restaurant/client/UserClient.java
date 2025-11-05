package com.eduka.restaurant.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.eduka.restaurant.dto.UserDTO;

/**
 * Feign client for communication with User Management Service
 * This enables the Restaurant service to validate users before creating orders
 */
@FeignClient(name = "user-management-service", url = "http://localhost:3000")
public interface UserClient {
    
    /**
     * Get user details by ID
     * @param id MongoDB ObjectId
     * @return UserDTO object with user details
     */
    @GetMapping("/api/users/{id}")
    UserDTO getUser(@PathVariable("id") String id);
    
    /**
     * Validate if a user exists
     * @param id MongoDB ObjectId
     * @return true if user exists, false otherwise
     */
    @GetMapping("/api/users/{id}/validate")
    Boolean validateUser(@PathVariable("id") String id);
}
