package com.ski.eduka.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

/**
 * Security Configuration for API Gateway
 * Secures all microservices access through JWT token validation with Keycloak
 */
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity serverHttpSecurity) {
        return serverHttpSecurity
                // Disable CSRF for stateless API
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                
                // Configure authorization rules
                .authorizeExchange(exchange -> exchange
                        // Allow access to Eureka server without authentication
                        .pathMatchers("/eureka/**").permitAll()
                        
                        // All other requests require authentication
                        .anyExchange().authenticated()
                )
                
                // Configure OAuth2 Resource Server with JWT
                .oauth2ResourceServer(oauth -> oauth
                        .jwt(Customizer.withDefaults())
                )
                
                .build();
    }
}
