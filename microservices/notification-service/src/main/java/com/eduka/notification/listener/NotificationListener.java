package com.eduka.notification.listener;

import com.eduka.notification.config.RabbitMQConfig;
import com.eduka.notification.model.NotificationMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class NotificationListener {
    
    @RabbitListener(queues = RabbitMQConfig.ORDER_NOTIFICATION_QUEUE)
    public void handleOrderNotification(NotificationMessage message) {
        log.info("📦 Received ORDER notification for user: {}", message.getUserId());
        log.info("   Order ID: {}", message.getDetails().getOrderId());
        log.info("   Restaurant: {}", message.getDetails().getRestaurantName());
        log.info("   Total: ${}", message.getDetails().getTotalAmount());
        
        // Simulate sending notification (email, SMS, push notification, etc.)
        sendNotification(message);
    }
    
    @RabbitListener(queues = RabbitMQConfig.LIBRARY_NOTIFICATION_QUEUE)
    public void handleLibraryNotification(NotificationMessage message) {
        log.info("📚 Received LIBRARY notification for user: {}", message.getUserId());
        log.info("   Book: {}", message.getDetails().getBookTitle());
        log.info("   Message: {}", message.getMessage());
        
        sendNotification(message);
    }
    
    @RabbitListener(queues = RabbitMQConfig.HOUSING_NOTIFICATION_QUEUE)
    public void handleHousingNotification(NotificationMessage message) {
        log.info("🏠 Received HOUSING notification for user: {}", message.getUserId());
        log.info("   Room: {}", message.getDetails().getRoomNumber());
        log.info("   Message: {}", message.getMessage());
        
        sendNotification(message);
    }
    
    @RabbitListener(queues = RabbitMQConfig.EMAIL_NOTIFICATION_QUEUE)
    public void handleEmailNotification(NotificationMessage message) {
        log.info("✉️ Received EMAIL notification for: {}", message.getEmail());
        log.info("   Subject: {}", message.getSubject());
        log.info("   Message: {}", message.getMessage());
        
        sendEmail(message);
    }
    
    private void sendNotification(NotificationMessage message) {
        // In production: integrate with email service, SMS gateway, push notification service
        log.info("✅ Notification sent successfully to user: {}", message.getUserId());
        log.info("   Type: {}", message.getType());
        log.info("   Subject: {}", message.getSubject());
        log.info("   Message: {}", message.getMessage());
    }
    
    private void sendEmail(NotificationMessage message) {
        // In production: use JavaMailSender or external email service (SendGrid, AWS SES)
        log.info("✅ Email sent successfully to: {}", message.getEmail());
    }
}
