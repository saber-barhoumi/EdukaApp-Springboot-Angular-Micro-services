package com.eduka.notification.service;

import com.eduka.notification.config.RabbitMQConfig;
import com.eduka.notification.model.NotificationMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    
    private final RabbitTemplate rabbitTemplate;
    
    public void sendNotification(NotificationMessage message) {
        String routingKey = getRoutingKey(message.getType());
        
        log.info("Sending {} notification to queue with routing key: {}", 
                 message.getType(), routingKey);
        
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.NOTIFICATION_EXCHANGE,
            routingKey,
            message
        );
        
        log.info("Notification sent successfully!");
    }
    
    private String getRoutingKey(String type) {
        return switch (type.toUpperCase()) {
            case "ORDER" -> RabbitMQConfig.ORDER_ROUTING_KEY;
            case "LIBRARY" -> RabbitMQConfig.LIBRARY_ROUTING_KEY;
            case "HOUSING" -> RabbitMQConfig.HOUSING_ROUTING_KEY;
            case "EMAIL" -> RabbitMQConfig.EMAIL_ROUTING_KEY;
            default -> throw new IllegalArgumentException("Unknown notification type: " + type);
        };
    }
}
