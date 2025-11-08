// src/app/BackOffice/pages-back/listlivre/listlivre.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LivreService } from '../../../services/livre.service';
import { Livre } from '../../../models/livre.models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-listlivre',
    standalone: true, // ✅ obligatoire si tu utilises `imports`

  imports: [FormsModule, CommonModule],
  templateUrl: './listlivre.component.html',
  styleUrls: ['./listlivre.component.css']
})
export class ListlivreComponent implements OnInit {
  livres: Livre[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  searchTerm: string = '';

  constructor(
    private livreService: LivreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLivres();
  }

  // Charger tous les livres
  loadLivres(): void {
    this.loading = true;
    this.livreService.getAllLivres().subscribe({
      next: (data) => {
        this.livres = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des livres:', error);
        this.errorMessage = 'Impossible de charger les livres';
        this.loading = false;
      }
    });
  }

  // Filtrer les livres par titre ou catégorie
  get filteredLivres(): Livre[] {
    if (!this.searchTerm) {
      return this.livres;
    }
    const term = this.searchTerm.toLowerCase();
    return this.livres.filter(livre => 
      livre.titre.toLowerCase().includes(term) ||
      livre.categorie.toLowerCase().includes(term)
    );
  }

  // Naviguer vers le formulaire d'ajout
  goToAdd(): void {
    this.router.navigate(['/admin/1/addlivre']);
  }

  // Naviguer vers le formulaire de modification
  editLivre(id: number): void {
    this.router.navigate(['/admin/1/editLivre', id]);
  }

  // Supprimer un livre
  deleteLivre(id: number, titre: string): void {
    if (confirm(`⚠️ Êtes-vous sûr de vouloir supprimer le livre "${titre}" ?`)) {
      this.livreService.deleteLivre(id).subscribe({
        next: () => {
          alert('✅ Livre supprimé avec succès !');
          this.loadLivres(); // Recharger la liste
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('❌ Erreur lors de la suppression du livre');
        }
      });
    }
  }

  // Obtenir la classe CSS selon la disponibilité
  getDisponibiliteClass(disponibilite: string): string {
    switch (disponibilite) {
      case 'DISPONIBLE':
        return 'badge-success';
      case 'EMPRUNTE':
        return 'badge-danger';
      case 'RESERVE':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  }
}