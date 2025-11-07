// src/app/enums/disponible.enum.ts

export enum Disponible {
  DISPONIBLE = 'DISPONIBLE',
  EMPRUNTE = 'EMPRUNTE',
  RESERVE = 'RESERVE'
}

// Utilitaire pour obtenir toutes les valeurs (pour les select)
export const DisponibleValues = Object.values(Disponible);