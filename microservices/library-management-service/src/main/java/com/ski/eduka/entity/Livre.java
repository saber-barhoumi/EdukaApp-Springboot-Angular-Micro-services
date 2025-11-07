package com.ski.eduka.entity;

import com.ski.eduka.enums.Diponible;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@AllArgsConstructor
@Data
@NoArgsConstructor
public class Livre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Livreid;
    private String titre;
    private String categorie;
    @Enumerated(EnumType.STRING)
    private Diponible diponible;
     @OneToMany(mappedBy = "livre")
    List<Emprunt>emprunts;

}
