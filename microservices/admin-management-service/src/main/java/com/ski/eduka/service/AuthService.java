package com.ski.eduka.service;

import com.ski.eduka.dto.UserDto;
import com.ski.eduka.dto.RegisterRequest;
import com.ski.eduka.entity.User;
import com.ski.eduka.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    public UserDto register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        // Check if username already exists (only if username is provided and not empty)
        if (request.getUsername() != null && !request.getUsername().trim().isEmpty() 
            && userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAge(request.getAge());
        user.setRole(request.getRole() != null ? request.getRole() : com.ski.eduka.enums.Role.CLIENT);
        user.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        user.setGender(request.getGender());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        User saved = userRepository.save(user);
        return convertToDto(saved);
    }

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDto authenticate(String email, String password) {
        try {
            // Find user by email
            User user = userRepository.findByEmail(email).orElse(null);
            
            if (user != null && passwordEncoder.matches(password, user.getPassword())) {
                // Convert User entity to UserDto
                return convertToDto(user);
            }
            
            return null;
        } catch (Exception e) {
            throw new RuntimeException("Authentication failed: " + e.getMessage(), e);
        }
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setRole(user.getRole());
        dto.setActive(user.isActive());
        dto.setAge(user.getAge());
        dto.setPhoneNumber(user.getPhoneNumber());
        return dto;
    }
}
