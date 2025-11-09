package com.eduka.adminmanagement.client;

import feign.Response;
import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;

/**
 * Custom error decoder for User Service Feign Client
 * Handles errors from user-management-nodejs service
 */
@Slf4j
public class UserServiceErrorDecoder implements ErrorDecoder {

    private final ErrorDecoder defaultErrorDecoder = new Default();

    @Override
    public Exception decode(String methodKey, Response response) {
        log.error("Error calling User Service: Method={}, Status={}", methodKey, response.status());

        switch (response.status()) {
            case 404:
                return new UserNotFoundException("User not found in user-management service");
            case 401:
            case 403:
                return new UnauthorizedException("Unauthorized access to user-management service");
            case 500:
                return new UserServiceException("User service internal error");
            default:
                return defaultErrorDecoder.decode(methodKey, response);
        }
    }

    // Custom exceptions
    public static class UserNotFoundException extends RuntimeException {
        public UserNotFoundException(String message) {
            super(message);
        }
    }

    public static class UnauthorizedException extends RuntimeException {
        public UnauthorizedException(String message) {
            super(message);
        }
    }

    public static class UserServiceException extends RuntimeException {
        public UserServiceException(String message) {
            super(message);
        }
    }
}
