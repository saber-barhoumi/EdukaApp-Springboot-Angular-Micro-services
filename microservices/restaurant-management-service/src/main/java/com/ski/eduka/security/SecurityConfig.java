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
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
// ...existing code...

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    /**
     * Global CORS configuration to allow Angular frontend
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns("http://localhost:4200", "*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }

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

    // CORS Configuration removed - handled by API Gateway

    /**
     * Configure security - TEMPORARILY DISABLED AUTHENTICATION
     */
    @Bean
    public SecurityFilterChain configure(HttpSecurity http) throws Exception {
        log.info("Configuring Security Filter Chain - AUTHENTICATION DISABLED");
        
        http
                // Updated CSRF configuration
                .csrf(csrf -> csrf.disable())

                // Enable CORS
                .cors(cors -> cors.configure(http))

                // Configure headers to allow H2 console in frames
                .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions.sameOrigin()))

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
}