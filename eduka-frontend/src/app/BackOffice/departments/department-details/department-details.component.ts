import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DepartmentService } from '../../../services/department.service';
import { Department } from '../../../models/department';
import { AcademicProgramService } from '../../../services/academic-program.service';
import { AcademicProgram } from '../../../models/academic-program';

@Component({
  selector: 'app-department-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './department-details.component.html',
  styleUrl: './department-details.component.css'
})
export class DepartmentDetailsComponent implements OnInit {
  department: Department | null = null;
  academicProgram: AcademicProgram | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService,
    private academicProgramService: AcademicProgramService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.departmentService.getDepartment(id).subscribe(
        (data) => {
          this.department = data;
          if (this.department.academicProgramId) {
            this.loadAcademicProgram(this.department.academicProgramId);
          }
        },
        (error) => {
          console.error('Error loading department:', error);
        }
      );
    }
  }

  loadAcademicProgram(programId: number): void {
    this.academicProgramService.getProgram(programId).subscribe(
      (data) => {
        this.academicProgram = data;
      },
      (error) => {
        console.error('Error loading academic program:', error);
      }
    );
  }

  back(): void {
    this.router.navigate(['/departments']);
  }

}
