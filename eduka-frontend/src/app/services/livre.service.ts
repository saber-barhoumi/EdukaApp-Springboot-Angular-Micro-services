// src/app/services/livre.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Livre, LivreDto } from '../models/livre.models';

@Injectable({
  providedIn: 'root'
})
export class LivreService {
  private apiUrl = 'http://localhost:8084/api/livres';

  constructor(private http: HttpClient) {}

  // 📚 Récupérer tous les livres
  getAllLivres(): Observable<Livre[]> {
    return this.http.get<Livre[]>(`${this.apiUrl}/all`);
  }

  // 📖 Récupérer un livre par ID
  getLivreById(id: number): Observable<Livre> {
    return this.http.get<Livre>(`${this.apiUrl}/${id}`);
  }

  // ➕ Ajouter un nouveau livre
  addLivre(livreDto: LivreDto): Observable<Livre> {
    return this.http.post<Livre>(`${this.apiUrl}/add`, livreDto);
  }

  // ✏️ Modifier un livre existant
  updateLivre(id: number, livreDto: LivreDto): Observable<Livre> {
    return this.http.put<Livre>(`${this.apiUrl}/update/${id}`, livreDto);
  }

  // 🗑️ Supprimer un livre
  deleteLivre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}