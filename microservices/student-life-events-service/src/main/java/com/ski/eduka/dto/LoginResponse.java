package com.ski.eduka.dto;

import com.ski.eduka.enums.Role;

public class LoginResponse {
    private boolean authenticated;
    private boolean success;
    private String message;
    private UserDto user;
    private String token; // For future JWT implementation

    public LoginResponse() {}

    public LoginResponse(boolean authenticated, String message) {
        this.authenticated = authenticated;
        this.success = authenticated;
        this.message = message;
    }

    public LoginResponse(boolean authenticated, String message, UserDto user) {
        this.authenticated = authenticated;
        this.success = authenticated;
        this.message = message;
        this.user = user;
    }

    public boolean isAuthenticated() {
        return authenticated;
    }

    public void setAuthenticated(boolean authenticated) {
        this.authenticated = authenticated;
        this.success = authenticated;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
        this.authenticated = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
