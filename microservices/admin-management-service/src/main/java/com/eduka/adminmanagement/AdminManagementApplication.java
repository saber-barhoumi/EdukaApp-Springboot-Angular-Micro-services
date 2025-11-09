package com.eduka.adminmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
@EntityScan("com.eduka.adminmanagement.entities")
@EnableJpaRepositories("com.eduka.adminmanagement.repositories")
public class AdminManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdminManagementApplication.class, args);
    }
}