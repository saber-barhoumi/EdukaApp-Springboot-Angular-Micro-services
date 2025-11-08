// src/app/BackOffice/pages-back/editlivre/editlivre.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LivreService } from '../../../services/livre.service';
import { LivreDto } from '../../../models/livre.models';
import { Disponible, DisponibleValues } from '../../../enums/disponible.enums';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editlivre',
    imports: [FormsModule, CommonModule],
  templateUrl: './editlivre.component.html',
  styleUrls: ['./editlivre.component.css']
})
export class EditlivreComponent implements OnInit {
  livre: LivreDto = {
    livreid: 0,
    titre: '',
    categorie: '',
    diponible: Disponible.DISPONIBLE
  };

  disponibleOptions = DisponibleValues;
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private livreService: LivreService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID depuis l'URL
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadLivre(+id);
    }
  }

  // Charger les données du livre
  loadLivre(id: number): void {
    this.livreService.getLivreById(id).subscribe({
      next: (data) => {
        this.livre = {
          livreid: data.livreid,
          titre: data.titre,
          categorie: data.categorie,
          diponible: data.diponible
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du livre:', error);
        this.errorMessage = 'Impossible de charger le livre';
        this.loading = false;
      }
    });
  }

  // Soumettre les modifications
onSubmit(): void {
  if (this.isFormValid()) {
    // Payload correct, diponible déjà enum
const payload: LivreDto = {
  ...this.livre,
  diponible: this.livre.diponible  // déjà de type Disponible grâce à [ngValue]
};

    this.livreService.updateLivre(this.livre.livreid!, payload).subscribe({
      next: (response) => {
        console.log('Livre modifié avec succès !', response);
        alert('✅ Livre modifié avec succès !');
        this.router.navigate(['/admin/1/listlivre']);
      },
      error: (error) => {
        console.error('Erreur lors de la modification:', error);
        alert('❌ Erreur lors de la modification du livre');
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