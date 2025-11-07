package com.ski.eduka.repository;

import com.ski.eduka.entity.Emprunt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmpruntRepository extends JpaRepository<Emprunt,Long> {
    List<Emprunt> findByEtudiantId(Long etudiantId);
}
