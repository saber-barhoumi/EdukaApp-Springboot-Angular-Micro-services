import { KeycloakConfig } from 'keycloak-js';

export const keycloakConfig: KeycloakConfig = {
  url: 'http://localhost:8080', // Keycloak server URL (standard port)
  realm: 'eduka-realm', // Your Keycloak realm name
  clientId: 'eduka-client' // Updated to match backend configuration
};

export const environment = {
  production: false,
  keycloak: keycloakConfig,
  apiUrl: 'http://localhost:8082' // Your Spring Boot backend URL
}; 