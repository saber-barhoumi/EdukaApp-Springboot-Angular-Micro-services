package com.ski.eduka.entity;

import com.ski.eduka.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@AllArgsConstructor
@Data
@NoArgsConstructor
public class Emprunt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Empruntid;
    private Long etudiantId;
    private LocalDate dateEmprunt;
    private LocalDate dateRetouRéele;
    @Enumerated(EnumType.STRING)
    private Status status;
    @ManyToOne
    private Livre livre;
}
