import { KeycloakConfig } from 'keycloak-js';

export const keycloakConfig = {
  config: {
    url: 'http://localhost:8080',
    realm: 'eduka-realm',
    clientId: 'eduka-client'
  } as KeycloakConfig
};

export const environment = {
  production: false,
  keycloak: keycloakConfig,
  apiUrl: 'http://localhost:8082' // Your Spring Boot backend URL
}; 