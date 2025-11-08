import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpruntServiceService {   // <- nom réel ici
  private apiUrl = 'http://localhost:8084/api/emprunts';

  constructor(private http: HttpClient) { }

  addEmprunt(livreId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add/${livreId}`, {});
  }
}
