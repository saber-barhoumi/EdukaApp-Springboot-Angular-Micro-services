package com.ski.eduka.dto;

import com.ski.eduka.enums.Diponible;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LivreDto {
    private Long Livreid;

    private String titre;
    private String categorie;
    private Diponible diponible;
}
