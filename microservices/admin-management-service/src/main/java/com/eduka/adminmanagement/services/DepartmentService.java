package com.eduka.adminmanagement.services;

import com.eduka.adminmanagement.dto.DepartmentDTO;
import com.eduka.adminmanagement.entities.AcademicProgram;
import com.eduka.adminmanagement.entities.Department;
import com.eduka.adminmanagement.repositories.AcademicProgramRepository;
import com.eduka.adminmanagement.repositories.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {
    
    private final DepartmentRepository departmentRepository;
    private final AcademicProgramRepository academicProgramRepository;
    private final SystemAuditService auditService;

    @Transactional
    public DepartmentDTO createDepartment(DepartmentDTO dto) {
        if (departmentRepository.existsByDepartmentCode(dto.getDepartmentCode())) {
            throw new RuntimeException("Department code already exists");
        }

        AcademicProgram program = academicProgramRepository.findById(dto.getAcademicProgramId())
            .orElseThrow(() -> new RuntimeException("Academic program not found"));

        Department department = new Department();
        department.setDepartmentName(dto.getDepartmentName());
        department.setDepartmentCode(dto.getDepartmentCode());
        department.setDescription(dto.getDescription());
        department.setLocation(dto.getLocation());
        department.setHeadOfDepartment(dto.getHeadOfDepartment());
        department.setAcademicProgram(program);
        department.setUserId(dto.getUserId()); // Set userId from DTO

        department = departmentRepository.save(department);
        auditService.logAction("CREATE", "DEPARTMENT", department.getId().toString(),
            "Created new department: " + department.getDepartmentName());

        return convertToDTO(department);
    }

    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<DepartmentDTO> getDepartmentsByProgram(Long programId) {
        return departmentRepository.findByAcademicProgramId(programId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public DepartmentDTO getDepartmentById(Long id) {
        return departmentRepository.findById(id)
            .map(this::convertToDTO)
            .orElseThrow(() -> new RuntimeException("Department not found"));
    }

    @Transactional
    public DepartmentDTO updateDepartment(Long id, DepartmentDTO dto) {
        Department department = departmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Department not found"));

        if (dto.getAcademicProgramId() != null) {
            AcademicProgram program = academicProgramRepository.findById(dto.getAcademicProgramId())
                .orElseThrow(() -> new RuntimeException("Academic program not found"));
            department.setAcademicProgram(program);
        }

        department.setDepartmentName(dto.getDepartmentName());
        department.setDescription(dto.getDescription());
        department.setLocation(dto.getLocation());
        department.setHeadOfDepartment(dto.getHeadOfDepartment());

        department = departmentRepository.save(department);
        auditService.logAction("UPDATE", "DEPARTMENT", department.getId().toString(),
            "Updated department: " + department.getDepartmentName());

        return convertToDTO(department);
    }

    @Transactional
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Department not found"));

        departmentRepository.delete(department);
        auditService.logAction("DELETE", "DEPARTMENT", id.toString(),
            "Deleted department: " + department.getDepartmentName());
    }

    private DepartmentDTO convertToDTO(Department department) {
        return new DepartmentDTO(
            department.getId(),
            department.getDepartmentName(),
            department.getDepartmentCode(),
            department.getDescription(),
            department.getLocation(),
            department.getAcademicProgram().getId(),
            department.getHeadOfDepartment(),
            department.getUserId()
        );
    }
}