package com.ski.eduka.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);
    // TEMPORARILY DISABLED KEYCLOAK
    // private final KeycloakJwtAuthenticationConverter keycloakJwtAuthenticationConverter;

    public SecurityConfig() {
        // TEMPORARILY DISABLED KEYCLOAK CONSTRUCTOR
        // this.keycloakJwtAuthenticationConverter = keycloakJwtAuthenticationConverter;
    }

    /**
     * Configure JWT Authentication Converter for Keycloak - TEMPORARILY DISABLED
     */
    /*
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverterForKeycloak() {
        log.info("Configuring JWT Authentication Converter for Keycloak");
        
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(keycloakJwtAuthenticationConverter);
        
        return jwtAuthenticationConverter;
    }
    */

    /**
     * Password encoder bean
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * CORS Configuration
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200", "http://localhost:4201"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Configure security - TEMPORARILY DISABLED AUTHENTICATION
     */
    @Bean
    public SecurityFilterChain configure(HttpSecurity http) throws Exception {
        log.info("Configuring Security Filter Chain - AUTHENTICATION DISABLED");
        
        http
                // Updated CSRF configuration
                .csrf(csrf -> csrf.disable())

                // Updated CORS configuration
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Updated session management
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // TEMPORARILY DISABLED OAuth2 resource server configuration
                /*
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .jwtAuthenticationConverter(jwtAuthenticationConverterForKeycloak())))
                */

                // Updated authorization configuration - PERMIT ALL FOR NOW
                .authorizeHttpRequests(authz -> authz
                        .anyRequest().permitAll() // TEMPORARILY ALLOW ALL REQUESTS
                );

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        String jwkSetUri = "http://localhost:8080/realms/eduka/protocol/openid-connect/certs"; // ton URL Keycloak
        return NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build();
    }
}