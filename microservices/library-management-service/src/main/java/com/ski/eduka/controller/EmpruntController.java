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
@CrossOrigin(origins = "*")
public class EmpruntController {

    private final EmpruntServiceImpl empruntService;

    /**
     * ✅ Créer un emprunt pour un livre (l'utilisateur connecté sera automatiquement associé)
     */
    @PostMapping("/add/{livreId}")
    public ResponseEntity<Emprunt> addEmprunt(@PathVariable Long livreId) {
        Emprunt emprunt = empruntService.addEmprunt(livreId);
        return ResponseEntity.ok(emprunt);
    }

    /**
     * ✏️ Mettre à jour un emprunt (par ex. retour du livre)
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
     * 🔍 Récupérer un emprunt par son ID
     */
    @GetMapping("/{empruntId}")
    public ResponseEntity<Emprunt> getEmpruntById(@PathVariable Long empruntId) {
        Emprunt emprunt = empruntService.getEmpruntById(empruntId);
        return ResponseEntity.ok(emprunt);
    }

    /**
     * 📚 Récupérer tous les emprunts (pour admin ou test)
     */
    @GetMapping("/all")
    public ResponseEntity<List<Emprunt>> getAllEmprunts() {
        return ResponseEntity.ok(empruntService.getAllEmprunts());
    }

    /**
     * 👤 Récupérer les emprunts de l'utilisateur actuellement connecté
     */
    @GetMapping("/my-emprunts")
    public ResponseEntity<List<Emprunt>> getEmpruntsByCurrentUser() {
        List<Emprunt> emprunts = empruntService.getEmpruntsByCurrentUser();
        return ResponseEntity.ok(emprunts);
    }
}
