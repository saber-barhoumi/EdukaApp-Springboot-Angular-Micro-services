package com.eduka.adminmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentDTO {
    private Long id;
    private String departmentName;
    private String departmentCode;
    private String description;
    private String location;
    private Long academicProgramId;
    private String headOfDepartment;
    private String userId;
}