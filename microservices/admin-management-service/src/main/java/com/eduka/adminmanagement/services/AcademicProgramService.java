package com.eduka.adminmanagement.services;

import com.eduka.adminmanagement.dto.AcademicProgramDTO;
import com.eduka.adminmanagement.entities.AcademicProgram;
import com.eduka.adminmanagement.repositories.AcademicProgramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AcademicProgramService {
    
    private final AcademicProgramRepository academicProgramRepository;
    private final SystemAuditService auditService;

    @Transactional
    public AcademicProgramDTO createProgram(AcademicProgramDTO dto) {
        if (academicProgramRepository.existsByProgramCode(dto.getProgramCode())) {
            throw new RuntimeException("Program code already exists");
        }

        AcademicProgram program = new AcademicProgram();
        program.setProgramName(dto.getProgramName());
        program.setProgramCode(dto.getProgramCode());
        program.setDescription(dto.getDescription());
        program.setDuration(dto.getDuration());
        program.setActive(dto.isActive());
        program.setUserId(dto.getUserId()); // Set userId from DTO

        program = academicProgramRepository.save(program);
        auditService.logAction("CREATE", "ACADEMIC_PROGRAM", program.getId().toString(), 
            "Created new academic program: " + program.getProgramName());

        return convertToDTO(program);
    }

    public List<AcademicProgramDTO> getAllPrograms() {
        return academicProgramRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public AcademicProgramDTO getProgramById(Long id) {
        return academicProgramRepository.findById(id)
            .map(this::convertToDTO)
            .orElseThrow(() -> new RuntimeException("Program not found"));
    }

    @Transactional
    public AcademicProgramDTO updateProgram(Long id, AcademicProgramDTO dto) {
        AcademicProgram program = academicProgramRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Program not found"));

        program.setProgramName(dto.getProgramName());
        program.setDescription(dto.getDescription());
        program.setDuration(dto.getDuration());
        program.setActive(dto.isActive());

        program = academicProgramRepository.save(program);
        auditService.logAction("UPDATE", "ACADEMIC_PROGRAM", program.getId().toString(),
            "Updated academic program: " + program.getProgramName());

        return convertToDTO(program);
    }

    @Transactional
    public void deleteProgram(Long id) {
        AcademicProgram program = academicProgramRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Program not found"));
            
        // You might want to check if there are any departments associated with this program
        if (!program.getDepartments().isEmpty()) {
            throw new RuntimeException("Cannot delete program with associated departments");
        }

        academicProgramRepository.delete(program);
        auditService.logAction("DELETE", "ACADEMIC_PROGRAM", id.toString(),
            "Deleted academic program: " + program.getProgramName());
    }

    private AcademicProgramDTO convertToDTO(AcademicProgram program) {
        return new AcademicProgramDTO(
            program.getId(),
            program.getProgramName(),
            program.getProgramCode(),
            program.getDescription(),
            program.getDuration(),
            program.isActive(),
            program.getUserId()
        );
    }
}