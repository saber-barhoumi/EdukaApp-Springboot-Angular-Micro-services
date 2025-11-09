package com.ski.eduka.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class userrdto {
    private String id;
    private String username;
    private String email;
    private String role;
}
