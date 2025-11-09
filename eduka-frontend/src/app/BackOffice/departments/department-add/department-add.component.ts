import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../../services/department.service';
import { Department } from '../../../models/department';
import { AcademicProgramService } from '../../../services/academic-program.service';
import { AcademicProgram } from '../../../models/academic-program';
import { AuthService } from '../../../services/auth-dynamic.service';

@Component({
  selector: 'app-department-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-add.component.html',
  styleUrl: './department-add.component.css'
})
export class DepartmentAddComponent implements OnInit {
  department: Department = {
    departmentName: '',
    departmentCode: '',
    description: '',
    location: '',
    academicProgramId: 0,
    headOfDepartment: '',
    userId: '' // Will be set from current user
  };
  academicPrograms: AcademicProgram[] = [];

  constructor(
    private departmentService: DepartmentService,
    private academicProgramService: AcademicProgramService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAcademicPrograms();
    // Set userId from current logged-in user
    const userId = this.authService.getUserId();
    if (userId) {
      this.department.userId = userId.toString();
    }
  }

  loadAcademicPrograms(): void {
    this.academicProgramService.getAllPrograms().subscribe(
      (data) => {
        this.academicPrograms = data;
      },
      (error) => {
        console.error('Error loading academic programs:', error);
      }
    );
  }

  onSubmit(): void {
    this.departmentService.createDepartment(this.department).subscribe(
      () => {
        this.router.navigate(['/departments']);
      },
      (error) => {
        console.error('Error creating department:', error);
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/departments']);
  }

}
