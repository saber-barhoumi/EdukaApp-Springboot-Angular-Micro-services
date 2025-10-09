package com.ski.eduka;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class edukaApplication {

	public static void main(String[] args) {
		SpringApplication.run(edukaApplication.class, args);
	}

}
