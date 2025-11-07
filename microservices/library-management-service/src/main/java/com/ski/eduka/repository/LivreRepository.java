package com.ski.eduka.repository;

import com.ski.eduka.entity.Livre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LivreRepository extends JpaRepository<Livre,Long> {
}
