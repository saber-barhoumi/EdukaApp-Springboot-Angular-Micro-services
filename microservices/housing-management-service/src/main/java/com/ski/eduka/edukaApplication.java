package com.ski.eduka;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
//@EnableFeignClients(basePackages = "com.ski.eduka.client")
@EnableFeignClients
public class edukaApplication {

	public static void main(String[] args) {
		SpringApplication.run(edukaApplication.class, args);
	}

}
