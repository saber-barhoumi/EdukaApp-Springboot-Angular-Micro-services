package com.eduka.adminmanagement.client;

import com.eduka.adminmanagement.client.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Feign Client for User Management Service (Node.js)
 * 
 * Options:
 * 1. Use service name from Eureka (if user-management-nodejs is registered)
 *    @FeignClient(name = "user-management-service")
 * 
 * 2. Use direct URL (current approach since Node.js service may not be in Eureka)
 *    @FeignClient(name = "user-management-service", url = "${user.service.url}")
 */
@FeignClient(
    name = "user-management-service",
    url = "${user.service.url:http://localhost:3000}",
    configuration = UserServiceClientConfig.class
)
public interface UserServiceClient {

    /**
     * Get user by ID
     * @param userId User ID
     * @return UserDTO
     */
    @GetMapping("/api/users/{id}")
    UserDTO getUserById(@PathVariable("id") String userId);

    /**
     * Validate if user exists and is active
     * @param userId User ID
     * @return true if user exists and is active
     */
    @GetMapping("/api/users/{id}/validate")
    Boolean validateUser(@PathVariable("id") String userId);
}
