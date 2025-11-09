package com.eduka.adminmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AcademicProgramDTO {
    private Long id;
    private String programName;
    private String programCode;
    private String description;
    private String duration;
    private boolean isActive;
    private String userId;
}