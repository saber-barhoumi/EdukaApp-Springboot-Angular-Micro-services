package com.ski.eduka.controller;

import com.ski.eduka.dto.LivreDto;
import com.ski.eduka.entity.Livre;
import com.ski.eduka.service.LivreService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Livre")
@RequiredArgsConstructor
public class LivreController {
    @Autowired
    private final LivreService livreService;
    // 🟢 Endpoint pour ajouter un livre
    @PostMapping("/add")
    public ResponseEntity<Livre> addLivre(@RequestBody LivreDto livreDto) {
        Livre nouveauLivre = livreService.addlivre(livreDto);
        return ResponseEntity.ok(nouveauLivre);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Livre>> getAllLivres() {
        List<Livre> livres = livreService.getall();
        return ResponseEntity.ok(livres);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Livre> getLivreById(@PathVariable("id") Long id) {
        Livre livre = livreService.getbyid(id);
        if (livre != null) {
            return ResponseEntity.ok(livre);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 🔴 Supprimer un livre par ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteLivre(@PathVariable("id") Long id) {
        livreService.deletebyid(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Livre> updateLivre(@PathVariable Long id,@RequestBody LivreDto livreDto) {
        livreDto.setLivreid(id);
        Livre livreMisAJour = livreService.updatelivre(livreDto);
        return ResponseEntity.ok(livreMisAJour);
    }

}
