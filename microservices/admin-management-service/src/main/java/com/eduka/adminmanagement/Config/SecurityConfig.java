package com.eduka.adminmanagement.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security Configuration for Admin Management Service
 * Validates JWT tokens from Keycloak via API Gateway
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF for stateless REST API
                .csrf(csrf -> csrf.disable())
                
                // Configure authorization rules
                .authorizeHttpRequests(auth -> auth
                        // Allow actuator endpoints for health checks
                        .requestMatchers("/actuator/**").permitAll()
                        
                        // TEMPORARY: Allow all requests for testing
                        // TODO: Configure role-based access control with Keycloak
                        .anyRequest().permitAll()
                )
                
                // Configure OAuth2 Resource Server with JWT validation
                .oauth2ResourceServer(oauth -> oauth
                        .jwt(Customizer.withDefaults())
                );
                
        return http.build();
    }
}
