package com.ski.eduka.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;




@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Foyer {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String adresse;
    private int capacite;

    @OneToMany(mappedBy = "foyer", cascade = CascadeType.ALL)
    private List<Chambre> chambres;
}
