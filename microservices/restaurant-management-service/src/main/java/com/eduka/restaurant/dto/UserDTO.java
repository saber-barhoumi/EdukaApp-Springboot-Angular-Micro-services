package com.eduka.restaurant.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Data Transfer Object for User information
 * Matches the User model structure from Node.js user-management service
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    
    private String id;
    private String username;
    private String email;
    private String role;
    private String firstName;
    private String lastName;
    private Boolean active;
}
