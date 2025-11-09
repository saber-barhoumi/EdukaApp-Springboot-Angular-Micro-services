package com.ski.eduka.controller;


import com.ski.eduka.entity.Chambre;
import com.ski.eduka.entity.User;
import com.ski.eduka.repository.ChambreRepository;
import com.ski.eduka.repository.UserRepository;
import com.ski.eduka.service.ChambreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chambres")
@RequiredArgsConstructor

public class ChambreController {

    private final ChambreRepository chambreRepository;
    private final UserRepository userRepository;
    private final ChambreService chambreService;

    @GetMapping
    public List<Chambre> getAll() {
        return chambreRepository.findAll();
    }

    @GetMapping("/disponibles")
    public List<Chambre> getDisponibles() {
        return chambreRepository.findByDisponibleTrue();
    }

    @PostMapping
    public Chambre add(@RequestBody Chambre chambre) {
        return chambreRepository.save(chambre);
    }

    @PutMapping("/{id}")
    public Chambre update(@PathVariable Long id, @RequestBody Chambre chambre) {
        //chambre.setId(id);
        chambre.setId(id);
        return chambreRepository.save(chambre);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        chambreRepository.deleteById(id);
    }





    @PostMapping("/affecter/{chambreId}/{userId}")
    public ResponseEntity<Chambre> affecterChambre(
            @PathVariable Long chambreId,
            @PathVariable String userId) {

        Chambre chambre = chambreService.affecterChambre(chambreId, userId);
        return ResponseEntity.ok(chambre);
    }



}
