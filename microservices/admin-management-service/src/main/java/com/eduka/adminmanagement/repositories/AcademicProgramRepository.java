package com.eduka.adminmanagement.repositories;

import com.eduka.adminmanagement.entities.AcademicProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AcademicProgramRepository extends JpaRepository<AcademicProgram, Long> {
    Optional<AcademicProgram> findByProgramCode(String programCode);
    boolean existsByProgramCode(String programCode);
}