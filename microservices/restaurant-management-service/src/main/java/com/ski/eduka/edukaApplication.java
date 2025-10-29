package com.ski.eduka;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableDiscoveryClient
@ComponentScan(basePackages = {"com.ski.eduka", "com.eduka.restaurant.controller", "com.eduka.restaurant.service", "com.eduka.restaurant.model", "com.eduka.restaurant.repository"})
@EntityScan(basePackages = {"com.eduka.restaurant.model", "com.ski.eduka.entity"})
@EnableJpaRepositories(basePackages = {"com.eduka.restaurant.repository", "com.ski.eduka.repository"})
public class edukaApplication {

	public static void main(String[] args) {
		SpringApplication.run(edukaApplication.class, args);
	}

}
