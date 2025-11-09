package com.ski.eduka.dto;

import com.ski.eduka.enums.Role;
import lombok.Data;


@Data
public class UserDto {
    //private Long id;
    private String id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private boolean active;
    private Integer age;
    private String phoneNumber;


}
