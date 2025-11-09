package com.ski.eduka.repository;

import com.ski.eduka.entity.Foyer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoyerRepository extends JpaRepository<Foyer, Long> {


    List<Foyer> findByNomContainingIgnoreCase(String nom);

    /**
     * Trouver des foyers avec capacité minimale
     */
    List<Foyer> findByCapaciteGreaterThanEqual(int capacite);

    /**
     * Compter le nombre de foyers
     */
    @Query("SELECT COUNT(f) FROM Foyer f")
    long countFoyers();
}
