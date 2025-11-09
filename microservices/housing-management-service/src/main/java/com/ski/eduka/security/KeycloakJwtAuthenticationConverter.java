package com.ski.eduka.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class KeycloakJwtAuthenticationConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    private static final Logger log = LoggerFactory.getLogger(KeycloakJwtAuthenticationConverter.class);

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        log.debug("Converting JWT to authorities for user: {}", jwt.getClaimAsString("preferred_username"));
        
        // Extract realm roles
        Map<String, Object> realmAccess = jwt.getClaim("realm_access");
        List<String> realmRoles = List.of();
        
        if (realmAccess != null && realmAccess.get("roles") instanceof List) {
            @SuppressWarnings("unchecked")
            List<String> roles = (List<String>) realmAccess.get("roles");
            realmRoles = roles != null ? roles : List.of();
        }
        
        // Extract client roles (if any)
        Map<String, Object> resourceAccess = jwt.getClaim("resource_access");
        List<String> clientRoles = List.of();
        
        if (resourceAccess != null) {
            // You can specify your client ID here if you have client-specific roles
            String clientId = "eduka-client"; // Replace with your actual client ID
            @SuppressWarnings("unchecked")
            Map<String, Object> clientAccess = (Map<String, Object>) resourceAccess.get(clientId);
            
            if (clientAccess != null && clientAccess.get("roles") instanceof List) {
                @SuppressWarnings("unchecked")
                List<String> roles = (List<String>) clientAccess.get("roles");
                clientRoles = roles != null ? roles : List.of();
            }
        }
        
        // Combine realm and client roles
        List<String> allRoles = new java.util.ArrayList<>(realmRoles);
        allRoles.addAll(clientRoles);
        
        log.debug("Extracted roles from JWT: {}", allRoles);
        
        return allRoles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                .collect(Collectors.toList());
    }
}