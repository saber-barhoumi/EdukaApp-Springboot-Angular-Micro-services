import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AcademicProgram } from '../models/academic-program';

@Injectable({
  providedIn: 'root'
})
export class AcademicProgramService {
  private apiUrl ='http://localhost:8888/api/v1/academic-programs';;

  constructor(private http: HttpClient) { }

  getAllPrograms(): Observable<AcademicProgram[]> {
    return this.http.get<AcademicProgram[]>(this.apiUrl);
  }

  getProgram(id: number): Observable<AcademicProgram> {
    return this.http.get<AcademicProgram>(`${this.apiUrl}/${id}`);
  }

  createProgram(program: AcademicProgram): Observable<AcademicProgram> {
    return this.http.post<AcademicProgram>(this.apiUrl, program);
  }

  updateProgram(id: number, program: AcademicProgram): Observable<AcademicProgram> {
    return this.http.put<AcademicProgram>(`${this.apiUrl}/${id}`, program);
  }

  deleteProgram(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}