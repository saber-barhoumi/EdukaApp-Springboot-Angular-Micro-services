package com.eduka.adminmanagement.client;

import feign.Logger;
import feign.codec.ErrorDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for User Service Feign Client
 */
@Configuration
public class UserServiceClientConfig {

    /**
     * Configure Feign logging level
     */
    @Bean
    Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL; // Log all request and response details
    }

    /**
     * Custom error decoder for handling errors from User Service
     */
    @Bean
    public ErrorDecoder errorDecoder() {
        return new UserServiceErrorDecoder();
    }
}
