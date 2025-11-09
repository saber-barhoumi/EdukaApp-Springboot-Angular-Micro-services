package com.ski.eduka.controller;

import com.ski.eduka.dto.LoginRequest;
import com.ski.eduka.dto.LoginResponse;
import com.ski.eduka.dto.UserDto;
import com.ski.eduka.dto.RegisterRequest;
import com.ski.eduka.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            UserDto createdUser = authService.register(request);
            return ResponseEntity.ok(createdUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Registration failed: " + e.getMessage());
        }
    }

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            UserDto user = authService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
            
            if (user != null) {
                // For now, we'll use a simple token (in production, use JWT)
                String token = "token_" + user.getId() + "_" + System.currentTimeMillis();
                
                LoginResponse response = new LoginResponse();
                response.setToken(token);
                response.setUser(user);
                response.setSuccess(true);
                response.setAuthenticated(true);
                response.setMessage("Login successful");
                
                return ResponseEntity.ok(response);
            } else {
                LoginResponse response = new LoginResponse();
                response.setSuccess(false);
                response.setAuthenticated(false);
                response.setMessage("Invalid email or password");
                
                return ResponseEntity.status(401).body(response);
            }
        } catch (Exception e) {
            LoginResponse response = new LoginResponse();
            response.setSuccess(false);
            response.setAuthenticated(false);
            response.setMessage("Login failed: " + e.getMessage());
            
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        // For simple token-based auth, logout is handled on frontend
        return ResponseEntity.ok("Logout successful");
    }

    @GetMapping("/current-user")
    public ResponseEntity<UserDto> getCurrentUser(@RequestHeader("Authorization") String token) {
        // For now, we'll return null since we're not storing sessions
        // In production, you would validate the token and return the user
        return ResponseEntity.ok(null);
    }
}
