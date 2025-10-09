import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Keycloak from 'keycloak-js';
import { KeycloakProfile } from 'keycloak-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { keycloakConfig } from './keycloak.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloak: Keycloak;
  private userProfile = new BehaviorSubject<KeycloakProfile | null>(null);
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.keycloak = new Keycloak(keycloakConfig);
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
      });
      
      this.isAuthenticated.next(authenticated);
      
      if (authenticated) {
        const profile = await this.keycloak.loadUserProfile();
        this.userProfile.next(profile);
      }
    } catch (error) {
      console.error('Error initializing authentication:', error);
    }
  }

  async loginWithCredentials(username: string, password: string): Promise<void> {
    try {
      const keycloakUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;
      
      const body = new URLSearchParams();
      body.set('grant_type', 'password');
      body.set('client_id', keycloakConfig.clientId);
      body.set('username', username);
      body.set('password', password);
      body.set('scope', 'openid profile email'); // Add required scopes
      
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };

      console.log('Attempting login with URL:', keycloakUrl);
      console.log('Client ID:', keycloakConfig.clientId);
      console.log('Username:', username);

      const response = await this.http.post<any>(keycloakUrl, body.toString(), { headers }).toPromise();
      
      if (response && response.access_token) {
        // Initialize Keycloak with the token
        this.keycloak.token = response.access_token;
        this.keycloak.refreshToken = response.refresh_token;
        this.keycloak.tokenParsed = this.parseJwt(response.access_token);
        
        // Update authentication state
        this.isAuthenticated.next(true);
        
        // Load user profile using the token
        try {
          const profile = await this.keycloak.loadUserProfile();
          this.userProfile.next(profile);
        } catch (profileError) {
          console.warn('Could not load user profile, using token data:', profileError);
          // Fallback to token data
          const tokenData = this.keycloak.tokenParsed;
          const fallbackProfile: KeycloakProfile = {
            username: tokenData?.['preferred_username'] || username,
            email: tokenData?.['email'] || '',
            firstName: tokenData?.['given_name'] || '',
            lastName: tokenData?.['family_name'] || ''
          };
          this.userProfile.next(fallbackProfile);
        }
        
        console.log('Login successful');
      } else {
        throw new Error('No access token received');
      }
    } catch (error: any) {
      console.error('Login with credentials failed:', error);
      
      if (error.status === 401) {
        throw new Error('Invalid username or password');
      } else if (error.status === 400) {
        if (error.error?.error === 'invalid_grant') {
          throw new Error('Invalid username or password');
        } else if (error.error?.error === 'invalid_client') {
          throw new Error('Authentication service configuration error. Please contact support.');
        } else {
          throw new Error(error.error?.error_description || 'Bad request. Please check your credentials.');
        }
      } else if (error.status === 0) {
        throw new Error('Cannot connect to authentication service. Please check if Keycloak is running.');
      } else if (error.error?.error_description) {
        throw new Error(error.error.error_description);
      } else {
        throw new Error('Login failed. Please try again.');
      }
    }
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  }

  async login(): Promise<void> {
    try {
      await this.keycloak.login({
        redirectUri: window.location.origin
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.keycloak.logout({
        redirectUri: window.location.origin
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async register(): Promise<void> {
    try {
      await this.keycloak.register({
        redirectUri: window.location.origin
      });
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  async getToken(): Promise<string> {
    try {
      await this.keycloak.updateToken(30);
      return this.keycloak.token || '';
    } catch (error) {
      console.error('Error getting token:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<void> {
    try {
      await this.keycloak.updateToken(30);
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  getUserProfile(): Observable<KeycloakProfile | null> {
    return this.userProfile.asObservable();
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  hasRole(role: string): boolean {
    return this.keycloak.hasRealmRole(role) || this.keycloak.hasResourceRole(role);
  }

  hasRealmRole(role: string): boolean {
    return this.keycloak.hasRealmRole(role);
  }

  hasResourceRole(role: string, resource: string): boolean {
    return this.keycloak.hasResourceRole(role, resource);
  }

  getUsername(): string {
    return this.keycloak.tokenParsed?.['preferred_username'] || '';
  }

  getTokenParsed(): any {
    return this.keycloak.tokenParsed;
  }

  getKeycloakInstance(): Keycloak {
    return this.keycloak;
  }
} 