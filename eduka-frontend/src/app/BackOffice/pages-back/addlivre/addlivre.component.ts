// src/app/BackOffice/pages-back/addlivre/addlivre.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LivreService } from '../../../services/livre.service';
import { LivreDto } from '../../../models/livre.models';
import { Disponible, DisponibleValues } from '../../../enums/disponible.enums';

@Component({
  selector: 'app-addlivre',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './addlivre.component.html',
  styleUrls: ['./addlivre.component.css']
})
export class AddlivreComponent {
  // Objet qui contient les données du formulaire
  livre: LivreDto = {
    titre: '',
    categorie: '',
    diponible: Disponible.DISPONIBLE
  };

  // Liste des valeurs pour le select de disponibilité
  disponibleOptions = DisponibleValues;

  constructor(
    private livreService: LivreService,
    private router: Router
  ) {}

  // Méthode appelée lors de la soumission du formulaire
  onSubmit(): void {
    if (this.isFormValid()) {
      this.livreService.addLivre(this.livre).subscribe({
        next: (response) => {
          console.log('Livre ajouté avec succès !', response);
          alert('✅ Livre ajouté avec succès !');
          this.router.navigate(['/admin/1/listlivre']);
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du livre:', error);
          alert('❌ Erreur lors de l\'ajout du livre');
        }
      });
    } else {
      alert('⚠️ Veuillez remplir tous les champs obligatoires');
    }
  }

  // Validation du formulaire
  isFormValid(): boolean {
    return this.livre.titre.trim() !== '' && 
           this.livre.categorie.trim() !== '';
  }

  // Annuler et retourner à la liste
  onCancel(): void {
    this.router.navigate(['/admin/1/listlivre']);
  }
}