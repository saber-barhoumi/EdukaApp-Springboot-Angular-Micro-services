package com.eduka.notification.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationMessage {
    private String userId;
    private String type; // ORDER, LIBRARY, HOUSING, EMAIL
    private String subject;
    private String message;
    private String email;
    private LocalDateTime timestamp;
    private NotificationDetails details;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NotificationDetails {
        private String orderId;
        private String restaurantName;
        private Double totalAmount;
        private String bookTitle;
        private String roomNumber;
        private String additionalInfo;
    }
}
