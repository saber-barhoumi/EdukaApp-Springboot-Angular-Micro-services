package com.ski.eduka.controller;

import com.ski.eduka.entity.Emprunt;
import com.ski.eduka.service.EmpruntServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emprunts")
@RequiredArgsConstructor
public class EmpruntController {

    private final EmpruntServiceImpl empruntService;


    @PostMapping("/add/{livreId}")
    public ResponseEntity<Emprunt> addEmprunt(
            @PathVariable Long livreId,
            @RequestHeader("Authorization") String token) {
        Emprunt emprunt = empruntService.addEmprunt(livreId, token);
        return ResponseEntity.ok(emprunt);
    }

    /**
     * ✏️ Mettre à jour un emprunt (ex: date de retour ou statut)
     */
    @PutMapping("/update/{empruntId}")
    public ResponseEntity<Emprunt> updateEmprunt(
            @PathVariable Long empruntId,
            @RequestBody Emprunt empruntDetails) {
        Emprunt updated = empruntService.updateEmprunt(empruntId, empruntDetails);
        return ResponseEntity.ok(updated);
    }

    /**
     * ❌ Supprimer un emprunt
     */
    @DeleteMapping("/delete/{empruntId}")
    public ResponseEntity<Void> deleteEmprunt(@PathVariable Long empruntId) {
        empruntService.deleteEmprunt(empruntId);
        return ResponseEntity.noContent().build();
    }

    /**
     * 🔍 Récupérer un emprunt par ID
     */
    @GetMapping("/{empruntId}")
    public ResponseEntity<Emprunt> getEmpruntById(@PathVariable Long empruntId) {
        Emprunt emprunt = empruntService.getEmpruntById(empruntId);
        return ResponseEntity.ok(emprunt);
    }

    /**
     * 📚 Récupérer tous les emprunts (admin ou test)
     */
    @GetMapping("/all")
    public ResponseEntity<List<Emprunt>> getAllEmprunts() {
        return ResponseEntity.ok(empruntService.getAllEmprunts());
    }

    /**
     * 👤 Récupérer les emprunts de l'utilisateur connecté
     */
    @GetMapping("/my-emprunts")
    public ResponseEntity<List<Emprunt>> getEmpruntsByCurrentUser(
            @RequestHeader("Authorization") String token) {
        List<Emprunt> emprunts = empruntService.getEmpruntsByUserId(token);
        return ResponseEntity.ok(emprunts);
    }
}
