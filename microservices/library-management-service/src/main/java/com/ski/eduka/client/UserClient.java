package com.ski.eduka.client;

import com.ski.eduka.dto.userrdto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
@FeignClient(name = "user-management-nodejs",url = "http://localhost:3000/api")
public interface UserClient {
    @GetMapping("/users/{id}")
    userrdto getUserById(@PathVariable("id") String id,
                         @RequestHeader("Authorization") String token);
}
