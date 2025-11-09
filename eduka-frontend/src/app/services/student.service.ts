import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Student {
  id: number;
  name: string;
  grade: string;
  class: string;
  lastAssessment?: string | Date;
  email?: string;
  phoneNumber?: string;
  profileImage?: string;
  region?: string;
  school?: string;
  subjects?: string[];
  performanceLevel?: 'excellent' | 'good' | 'average' | 'needs_improvement';
  behaviorRating?: number;
  attendanceRate?: number;
  parentContact?: string;
  age?: number;
  averageGrade?: number;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly apiUrl = 'http://localhost:8082/api/students';

  private studentsSubject = new BehaviorSubject<Student[]>([]);
  public students$ = this.studentsSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get all students for a specific teacher
   */
  getTeacherStudents(teacherId: number): Observable<Student[]> {
    this.loadingSubject.next(true);
    
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      map((response: any[]) => {
        // Transform backend response to Student interface
        const students = response.map(item => this.transformToStudent(item));
        this.studentsSubject.next(students);
        return students;
      }),
      catchError(this.handleError),
      map(students => {
        this.loadingSubject.next(false);
        return students;
      })
    );
  }



  /**
   * Search students by name, grade, or class
   */
  searchStudents(query: string): Observable<Student[]> {
    const currentStudents = this.studentsSubject.value;
    const filteredStudents = currentStudents.filter(student => 
      student.name.toLowerCase().includes(query.toLowerCase()) ||
      student.grade.toLowerCase().includes(query.toLowerCase()) ||
      student.class.toLowerCase().includes(query.toLowerCase()) ||
      (student.school && student.school.toLowerCase().includes(query.toLowerCase()))
    );
    
    return new Observable(observer => {
      observer.next(filteredStudents);
      observer.complete();
    });
  }

  /**
   * Filter students by various criteria
   */
  filterStudents(filters: {
    grade?: string;
    class?: string;
    region?: string;
    school?: string;
    performanceLevel?: string;
  }): Observable<Student[]> {
    const currentStudents = this.studentsSubject.value;
    const filteredStudents = currentStudents.filter(student => {
      if (filters.grade && student.grade !== filters.grade) return false;
      if (filters.class && student.class !== filters.class) return false;
      if (filters.region && student.region !== filters.region) return false;
      if (filters.school && student.school !== filters.school) return false;
      if (filters.performanceLevel && student.performanceLevel !== filters.performanceLevel) return false;
      return true;
    });
    
    return new Observable(observer => {
      observer.next(filteredStudents);
      observer.complete();
    });
  }

  /**
   * Get currently loaded students
   */
  getCurrentStudents(): Student[] {
    return this.studentsSubject.value;
  }

  /**
   * Check if students are currently loading
   */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  /**
   * Transform backend response to Student interface
   */
  private transformToStudent(backendStudent: any): Student {
    return {
      id: backendStudent.id,
      name: backendStudent.name,
      grade: backendStudent.grade || 'Grade 10',
      class: backendStudent.class || 'Class A',
      lastAssessment: backendStudent.lastAssessment,
      email: backendStudent.email,
      phoneNumber: backendStudent.phoneNumber,
      profileImage: backendStudent.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(backendStudent.name)}&background=random`,
      region: backendStudent.region || 'Tunis',
      school: backendStudent.school || 'École Primaire de Tunis',
      subjects: backendStudent.subjects || ['Mathematics', 'Science', 'Arabic', 'French'],
      performanceLevel: backendStudent.performanceLevel || this.generateRandomPerformanceLevel(),
      behaviorRating: backendStudent.behaviorRating || Math.floor(Math.random() * 5) + 1,
      attendanceRate: backendStudent.attendanceRate || Math.floor(Math.random() * 20) + 80,
      parentContact: backendStudent.parentContact || `parent${backendStudent.id}@email.com`,
      age: backendStudent.age || Math.floor(Math.random() * 3) + 15, // Age between 15-17
      averageGrade: backendStudent.averageGrade || Math.floor(Math.random() * 8) + 12 // Grade between 12-20
    };
  }

  /**
   * Generate random performance level for demo purposes
   */
  private generateRandomPerformanceLevel(): 'excellent' | 'good' | 'average' | 'needs_improvement' {
    const levels: ('excellent' | 'good' | 'average' | 'needs_improvement')[] = 
      ['excellent', 'good', 'average', 'needs_improvement'];
    return levels[Math.floor(Math.random() * levels.length)];
  }

  /**
   * Handle HTTP errors
   */
  private handleError = (error: HttpErrorResponse) => {
    this.loadingSubject.next(false);
    
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
      
      // Handle specific HTTP status codes
      switch (error.status) {
        case 404:
          errorMessage = 'Students not found. Please check the teacher ID.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        case 403:
          errorMessage = 'Access denied. You may not have permission to view these students.';
          break;
        case 401:
          errorMessage = 'Authentication required. Please log in again.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    console.error('StudentService Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  };

  /**
   * Test backend connection
   */
  testConnection(): Observable<any> {
    return this.http.get<any>(`http://localhost:8082/api/health`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get available grades for filtering
   */
  getAvailableGrades(): string[] {
    const students = this.studentsSubject.value;
    const grades = [...new Set(students.map(s => s.grade))];
    return grades.sort();
  }

  /**
   * Get available classes for filtering
   */
  getAvailableClasses(): string[] {
    const students = this.studentsSubject.value;
    const classes = [...new Set(students.map(s => s.class))];
    return classes.sort();
  }

  /**
   * Get available regions for filtering
   */
  getAvailableRegions(): string[] {
    const students = this.studentsSubject.value;
    const regions = [...new Set(students.map(s => s.region).filter(Boolean))] as string[];
    return regions.sort();
  }

  /**
   * Get available schools for filtering
   */
  getAvailableSchools(): string[] {
    const students = this.studentsSubject.value;
    const schools = [...new Set(students.map(s => s.school).filter(Boolean))] as string[];
    return schools.sort();
  }
}
