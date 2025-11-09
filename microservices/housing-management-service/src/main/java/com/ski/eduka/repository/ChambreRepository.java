package com.ski.eduka.repository;

import com.ski.eduka.entity.Chambre;
import com.ski.eduka.enums.ChambreType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChambreRepository extends JpaRepository<Chambre, Long> {



    /**
     * Trouver toutes les chambres d'un foyer
     */
    List<Chambre> findByFoyerId(Long foyerId);

    /**
     * Trouver les chambres disponibles
     */
    List<Chambre> findByDisponibleTrue();

    /**
     * Trouver les chambres disponibles d'un type spécifique
     */
    List<Chambre> findByDisponibleTrueAndType(ChambreType type);

    /**
     * Trouver une chambre par userId (chambre assignée à un utilisateur)
     */
    Optional<Chambre> findByUserId(String userId);

    /**
     * Trouver toutes les chambres assignées
     */
    @Query("SELECT c FROM Chambre c WHERE c.userId IS NOT NULL")
    List<Chambre> findAssignedChambres();

    /**
     * Compter les chambres disponibles dans un foyer
     */
    @Query("SELECT COUNT(c) FROM Chambre c WHERE c.foyer.id = :foyerId AND c.disponible = true")
    long countAvailableChambresByFoyer(@Param("foyerId") Long foyerId);

    /**
     * Vérifier si une chambre existe par numéro dans un foyer
     */
    boolean existsByNumeroAndFoyerId(String numero, Long foyerId);
}
