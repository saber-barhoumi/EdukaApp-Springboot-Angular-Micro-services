package com.eduka.notification.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    
    // Queue names
    public static final String ORDER_NOTIFICATION_QUEUE = "order.notification.queue";
    public static final String LIBRARY_NOTIFICATION_QUEUE = "library.notification.queue";
    public static final String HOUSING_NOTIFICATION_QUEUE = "housing.notification.queue";
    public static final String EMAIL_NOTIFICATION_QUEUE = "email.notification.queue";
    
    // Exchange
    public static final String NOTIFICATION_EXCHANGE = "notification.exchange";
    
    // Routing keys
    public static final String ORDER_ROUTING_KEY = "notification.order";
    public static final String LIBRARY_ROUTING_KEY = "notification.library";
    public static final String HOUSING_ROUTING_KEY = "notification.housing";
    public static final String EMAIL_ROUTING_KEY = "notification.email";
    
    // Queues
    @Bean
    public Queue orderNotificationQueue() {
        return new Queue(ORDER_NOTIFICATION_QUEUE, true);
    }
    
    @Bean
    public Queue libraryNotificationQueue() {
        return new Queue(LIBRARY_NOTIFICATION_QUEUE, true);
    }
    
    @Bean
    public Queue housingNotificationQueue() {
        return new Queue(HOUSING_NOTIFICATION_QUEUE, true);
    }
    
    @Bean
    public Queue emailNotificationQueue() {
        return new Queue(EMAIL_NOTIFICATION_QUEUE, true);
    }
    
    // Exchange
    @Bean
    public TopicExchange notificationExchange() {
        return new TopicExchange(NOTIFICATION_EXCHANGE);
    }
    
    // Bindings
    @Bean
    public Binding orderBinding() {
        return BindingBuilder
            .bind(orderNotificationQueue())
            .to(notificationExchange())
            .with(ORDER_ROUTING_KEY);
    }
    
    @Bean
    public Binding libraryBinding() {
        return BindingBuilder
            .bind(libraryNotificationQueue())
            .to(notificationExchange())
            .with(LIBRARY_ROUTING_KEY);
    }
    
    @Bean
    public Binding housingBinding() {
        return BindingBuilder
            .bind(housingNotificationQueue())
            .to(notificationExchange())
            .with(HOUSING_ROUTING_KEY);
    }
    
    @Bean
    public Binding emailBinding() {
        return BindingBuilder
            .bind(emailNotificationQueue())
            .to(notificationExchange())
            .with(EMAIL_ROUTING_KEY);
    }
    
    // Message converter
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
    
    // RabbitTemplate
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}
