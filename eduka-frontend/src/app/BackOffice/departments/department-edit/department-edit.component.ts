import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../../services/department.service';
import { Department } from '../../../models/department';
import { AcademicProgramService } from '../../../services/academic-program.service';
import { AcademicProgram } from '../../../models/academic-program';

@Component({
  selector: 'app-department-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-edit.component.html',
  styleUrl: './department-edit.component.css'
})
export class DepartmentEditComponent implements OnInit {
  department: Department = {
    departmentName: '',
    departmentCode: '',
    description: '',
    location: '',
    academicProgramId: 0,
    headOfDepartment: ''
  };
  academicPrograms: AcademicProgram[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService,
    private academicProgramService: AcademicProgramService
  ) {}

  ngOnInit(): void {
    this.loadAcademicPrograms();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.departmentService.getDepartment(id).subscribe(
        (data) => {
          this.department = data;
        },
        (error) => {
          console.error('Error loading department:', error);
        }
      );
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
    if (this.department.id) {
      this.departmentService.updateDepartment(this.department.id, this.department).subscribe(
        () => {
          this.router.navigate(['/departments']);
        },
        (error) => {
          console.error('Error updating department:', error);
        }
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/departments']);
  }

}
