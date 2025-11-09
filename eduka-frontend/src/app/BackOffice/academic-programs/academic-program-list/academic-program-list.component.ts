import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AcademicProgramService } from '../../../services/academic-program.service';
import { AcademicProgram } from '../../../models/academic-program';

@Component({
  selector: 'app-academic-program-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './academic-program-list.component.html',
  styleUrl: './academic-program-list.component.css'
})
export class AcademicProgramListComponent implements OnInit {
  programs: AcademicProgram[] = [];

  constructor(
    private programService: AcademicProgramService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPrograms();
  }

  loadPrograms(): void {
    this.programService.getAllPrograms().subscribe(
      (data) => {
        this.programs = data;
      },
      (error) => {
        console.error('Error loading programs:', error);
      }
    );
  }

  addProgram(): void {
    this.router.navigate(['/academic-programs/add']);
  }

  editProgram(id: number): void {
    this.router.navigate(['/academic-programs/edit', id]);
  }

  deleteProgram(id: number): void {
    if (confirm('Are you sure you want to delete this program?')) {
      this.programService.deleteProgram(id).subscribe(
        () => {
          this.loadPrograms();
        },
        (error) => {
          console.error('Error deleting program:', error);
        }
      );
    }
  }

  viewDetails(id: number): void {
    this.router.navigate(['/academic-programs/details', id]);
  }

}
