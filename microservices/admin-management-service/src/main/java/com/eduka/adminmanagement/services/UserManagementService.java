package com.eduka.adminmanagement.services;

import com.eduka.adminmanagement.client.UserServiceClient;
import com.eduka.adminmanagement.client.dto.UserDTO;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service for communicating with User Management Service (Node.js)
 * Uses OpenFeign client with Circuit Breaker and Retry patterns
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserManagementService {

    private final UserServiceClient userServiceClient;

    /**
     * Get user by ID with circuit breaker and retry
     * @param userId User ID
     * @return UserDTO or null if user service is down
     */
    @CircuitBreaker(name = "userService", fallbackMethod = "getUserByIdFallback")
    @Retry(name = "userService")
    public UserDTO getUserById(String userId) {
        log.info("Fetching user with ID: {}", userId);
        return userServiceClient.getUserById(userId);
    }

    /**
     * Validate user exists and is active
     * @param userId User ID
     * @return true if valid, false otherwise
     */
    @CircuitBreaker(name = "userService", fallbackMethod = "validateUserFallback")
    @Retry(name = "userService")
    public Boolean validateUser(String userId) {
        log.info("Validating user with ID: {}", userId);
        try {
            UserDTO user = userServiceClient.getUserById(userId);
            return user != null && Boolean.TRUE.equals(user.getIsActive());
        } catch (Exception e) {
            log.error("Error validating user {}: {}", userId, e.getMessage());
            return false;
        }
    }

    /**
     * Fallback method when user service is unavailable
     */
    private UserDTO getUserByIdFallback(String userId, Exception ex) {
        log.warn("User service is unavailable. Using fallback for userId: {}. Error: {}", 
                 userId, ex.getMessage());
        return null;
    }

    /**
     * Fallback method for user validation
     */
    private Boolean validateUserFallback(String userId, Exception ex) {
        log.warn("User service validation failed for userId: {}. Error: {}", 
                 userId, ex.getMessage());
        // Default to allowing the operation if user service is down
        // You might want to change this based on your security requirements
        return true;
    }
}
