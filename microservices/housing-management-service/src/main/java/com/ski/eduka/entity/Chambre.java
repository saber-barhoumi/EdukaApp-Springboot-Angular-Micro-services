package com.ski.eduka.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ski.eduka.enums.ChambreType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chambre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String numero;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChambreType type; // SIMPLE, DOUBLE, TRIPLE

    @Column(nullable = false)
    private boolean disponible = true;

    // 🆕 ID de l'utilisateur assigné (venant du service User Management Node.js)
    @Column(name = "user_id")
    private String userId; // MongoDB ObjectId du service Node.js

    // 🆕 Nom de l'utilisateur (pour faciliter l'affichage)
    @Column(name = "user_name")
    private String userName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "foyer_id", nullable = false)
    @JsonIgnore // Éviter la sérialisation circulaire
    private Foyer foyer;



    // ============================================
    // Helper Methods
    // ============================================

    /**
     * Assigner la chambre à un utilisateur
     */
    public void assignToUser(String userId, String userName) {
        this.userId = userId;
        this.userName = userName;
        this.disponible = false;
    }

    /**
     * Libérer la chambre
     */
    public void unassign() {
        this.userId = null;
        this.userName = null;
        this.disponible = true;
    }

    /**
     * Vérifier si la chambre est assignée
     */
    public boolean isAssigned() {
        return userId != null && !userId.isEmpty();
    }
}