// src/app/models/livre.model.ts

import { Disponible } from '../enums/disponible.enums';

export interface Livre {
  livreid?: number;  // Optionnel car généré par le backend
  titre: string;
  categorie: string;
  diponible: Disponible;
}

export interface LivreDto {
  livreid?: number;
  titre: string;
  categorie: string;
  diponible: Disponible;
}