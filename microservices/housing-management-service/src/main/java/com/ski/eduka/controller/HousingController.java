package com.ski.eduka.controller;


import com.ski.eduka.entity.Chambre;
import com.ski.eduka.entity.Foyer;
import com.ski.eduka.enums.ChambreType;
import com.ski.eduka.service.HousingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Housing Management Controller
 *
 * 🔐 Contrôle d'Accès:
 * - ADMIN: CRUD complet (Foyers, Chambres, Affectations)
 * - USER/STUDENT: Consultation (Foyers, Chambres disponibles, Ma chambre)
 */
@RestController
@RequestMapping("/api/housing")
public class HousingController {

    @Autowired
    private HousingService housingService;

    // ============================================
    // 🔴 ADMIN ONLY - GESTION DES FOYERS
    // ============================================

    /**
     * Créer un nouveau foyer
     *
     * Exemple Body:
     * {
     *   "nom": "Foyer Universitaire A",
     *   "adresse": "123 Rue du Campus",
     *   "capacite": 100
     * }
     */
    @PostMapping("/foyers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Foyer> createFoyer(@RequestBody Foyer foyer) {
        Foyer created = housingService.createFoyer(foyer);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Mettre à jour un foyer
     */
    @PutMapping("/foyers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Foyer> updateFoyer(
            @PathVariable Long id,
            @RequestBody Foyer foyer) {
        Foyer updated = housingService.updateFoyer(id, foyer);
        return ResponseEntity.ok(updated);
    }

    /**
     * Supprimer un foyer
     */
    @DeleteMapping("/foyers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFoyer(@PathVariable Long id) {
        housingService.deleteFoyer(id);
        return ResponseEntity.noContent().build();
    }

    // ============================================
    // 🔴 ADMIN ONLY - GESTION DES CHAMBRES
    // ============================================

    /**
     * Créer une chambre dans un foyer
     *
     * Exemple Body:
     * {
     *   "numero": "101",
     *   "type": "SIMPLE"
     * }
     */
    @PostMapping("/foyers/{foyerId}/chambres")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Chambre> createChambre(
            @PathVariable Long foyerId,
            @RequestBody Chambre chambre) {
        Chambre created = housingService.createChambre(foyerId, chambre);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Mettre à jour une chambre
     */
    @PutMapping("/chambres/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Chambre> updateChambre(
            @PathVariable Long id,
            @RequestBody Chambre chambre) {
        Chambre updated = housingService.updateChambre(id, chambre);
        return ResponseEntity.ok(updated);
    }

    /**
     * Supprimer une chambre
     */
    @DeleteMapping("/chambres/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteChambre(@PathVariable Long id) {
        housingService.deleteChambre(id);
        return ResponseEntity.noContent().build();
    }

    // ============================================
    // 🔴 ADMIN ONLY - AFFECTATION DES CHAMBRES
    // ============================================

    /**
     * Assigner une chambre à un utilisateur
     *
     * Query Params:
     * - userId: ID de l'utilisateur (MongoDB ObjectId du service Node.js)
     * - userName: Nom de l'utilisateur
     *
     * Exemple: POST /chambres/5/assign?userId=507f1f77bcf86cd799439011&userName=John Doe
     */
    @PostMapping("/chambres/{chambreId}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Chambre> assignChambreToUser(
            @PathVariable Long chambreId,
            @RequestParam String userId,
            @RequestParam String userName) {
        Chambre assigned = housingService.assignChambreToUser(chambreId, userId, userName);
        return ResponseEntity.ok(assigned);
    }

    /**
     * Libérer une chambre (désaffectation)
     */
    @PostMapping("/chambres/{chambreId}/unassign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Chambre> unassignChambre(@PathVariable Long chambreId) {
        Chambre unassigned = housingService.unassignChambre(chambreId);
        return ResponseEntity.ok(unassigned);
    }

    // ============================================
    // 🟢 USER/STUDENT - CONSULTATION
    // ============================================

    /**
     * Obtenir tous les foyers
     */
    @GetMapping("/foyers")
    @PreAuthorize("hasAnyRole('USER', 'STUDENT', 'ADMIN')")
    public ResponseEntity<List<Foyer>> getAllFoyers() {
        List<Foyer> foyers = housingService.getAllFoyers();
        return ResponseEntity.ok(foyers);
    }

    /**
     * Obtenir un foyer par ID
     */
    @GetMapping("/foyers/{id}")
    @PreAuthorize("hasAnyRole('USER', 'STUDENT', 'ADMIN')")
    public ResponseEntity<Foyer> getFoyer(@PathVariable Long id) {
        Foyer foyer = housingService.getFoyer(id);
        return ResponseEntity.ok(foyer);
    }

    /**
     * Rechercher des foyers par nom
     */
    @GetMapping("/foyers/search")
    @PreAuthorize("hasAnyRole('USER', 'STUDENT', 'ADMIN')")
    public ResponseEntity<List<Foyer>> searchFoyers(@RequestParam String nom) {
        List<Foyer> foyers = housingService.searchFoyersByName(nom);
        return ResponseEntity.ok(foyers);
    }

    /**
     * Obtenir toutes les chambres d'un foyer
     */
    @GetMapping("/foyers/{foyerId}/chambres")
    @PreAuthorize("hasAnyRole('USER', 'STUDENT', 'ADMIN')")
    public ResponseEntity<List<Chambre>> getChambresByFoyer(@PathVariable Long foyerId) {
        List<Chambre> chambres = housingService.getChambresByFoyer(foyerId);
        return ResponseEntity.ok(chambres);
    }

    /**
     * Obtenir toutes les chambres disponibles
     */
    @GetMapping("/chambres/available")
    @PreAuthorize("hasAnyRole('USER', 'STUDENT', 'ADMIN')")
    public ResponseEntity<List<Chambre>> getAvailableChambres() {
        List<Chambre> chambres = housingService.getAvailableChambres();
        return ResponseEntity.ok(chambres);
    }

    /**
     * Obtenir les chambres disponibles par type
     *
     * Types possibles: SIMPLE, DOUBLE, TRIPLE
     */
    @GetMapping("/chambres/available/{type}")
    @PreAuthorize("hasAnyRole('USER', 'STUDENT', 'ADMIN')")
    public ResponseEntity<List<Chambre>> getAvailableChambresByType(
            @PathVariable ChambreType type) {
        List<Chambre> chambres = housingService.getAvailableChambresByType(type);
        return ResponseEntity.ok(chambres);
    }

    /**
     * 🔑 Obtenir MA chambre assignée (utilisateur connecté)
     *
     * Utilise le JWT token pour extraire l'ID de l'utilisateur automatiquement
     */
    @GetMapping("/my-room")
    @PreAuthorize("hasAnyRole('USER', 'STUDENT', 'ADMIN')")
    public ResponseEntity<Chambre> getMyAssignedRoom(
            @AuthenticationPrincipal Jwt jwt) {

        // Extraire l'ID utilisateur du JWT token
        String userId = jwt.getSubject(); // Keycloak user ID

        Chambre myChambre = housingService.getChambreByUserId(userId);

        if (myChambre == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null); // Aucune chambre assignée
        }

        return ResponseEntity.ok(myChambre);
    }

    /**
     * Obtenir une chambre par ID
     */
    @GetMapping("/chambres/{id}")
    @PreAuthorize("hasAnyRole('USER', 'STUDENT', 'ADMIN')")
    public ResponseEntity<Chambre> getChambre(@PathVariable Long id) {
        Chambre chambre = housingService.getChambre(id);
        return ResponseEntity.ok(chambre);
    }

    // ============================================
    // 🔴 ADMIN ONLY - STATISTIQUES
    // ============================================

    /**
     * Obtenir les statistiques d'un foyer
     *
     * Retourne: nom, total chambres, disponibles, occupées, capacité max
     */
    @GetMapping("/foyers/{foyerId}/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HousingService.FoyerStats> getFoyerStats(@PathVariable Long foyerId) {
        HousingService.FoyerStats stats = housingService.getFoyerStats(foyerId);
        return ResponseEntity.ok(stats);
    }

    /**
     * Health check endpoint (public)
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Housing Management Service is running!");
    }
}
