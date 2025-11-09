package com.eduka.adminmanagement.repositories;

import com.eduka.adminmanagement.entities.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findByDepartmentCode(String departmentCode);
    List<Department> findByAcademicProgramId(Long academicProgramId);
    boolean existsByDepartmentCode(String departmentCode);
}