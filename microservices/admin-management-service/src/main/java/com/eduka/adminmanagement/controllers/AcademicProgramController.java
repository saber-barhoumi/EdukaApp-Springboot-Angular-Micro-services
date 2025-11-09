package com.eduka.adminmanagement.controllers;

import com.eduka.adminmanagement.dto.AcademicProgramDTO;
import com.eduka.adminmanagement.services.AcademicProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/academic-programs")
@RequiredArgsConstructor
public class AcademicProgramController {
    
    private final AcademicProgramService academicProgramService;

    @PostMapping
    public ResponseEntity<AcademicProgramDTO> createProgram(@RequestBody AcademicProgramDTO dto) {
        return ResponseEntity.ok(academicProgramService.createProgram(dto));
    }

    @GetMapping
    public ResponseEntity<List<AcademicProgramDTO>> getAllPrograms() {
        return ResponseEntity.ok(academicProgramService.getAllPrograms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AcademicProgramDTO> getProgramById(@PathVariable Long id) {
        return ResponseEntity.ok(academicProgramService.getProgramById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AcademicProgramDTO> updateProgram(
            @PathVariable Long id,
            @RequestBody AcademicProgramDTO dto) {
        return ResponseEntity.ok(academicProgramService.updateProgram(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgram(@PathVariable Long id) {
        academicProgramService.deleteProgram(id);
        return ResponseEntity.noContent().build();
    }
}