// src/app/FrontOffice/pages-front/afficher-livres/afficher-livres.component.ts
import { Component, OnInit } from '@angular/core';
import { LivreService } from '../../../services/livre.service';
import { EmpruntServiceService } from '../../../services/emprunt-service.service';
import { LivreDto } from '../../../models/livre.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-afficher-livres',
  templateUrl: './afficher-livres.component.html',
  styleUrls: ['./afficher-livres.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AfficherLivresComponent implements OnInit {

  livres: LivreDto[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private livreService: LivreService,
    private empruntService: EmpruntServiceService
  ) { }

  ngOnInit(): void {
    this.loadLivres();
  }

  loadLivres(): void {
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

  reserverLivre(livreId: number | undefined): void {
    if (!livreId) return;

    this.empruntService.addEmprunt(livreId).subscribe({
      next: () => {
        alert('Livre réservé avec succès !');
        this.loadLivres(); // recharge la liste pour mettre à jour la disponibilité
      },
      error: (err) => {
        console.error('Erreur lors de la réservation:', err);
        alert('Impossible de réserver ce livre');
      }
    });
  }

}
