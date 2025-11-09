import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DepartmentService } from '../../../services/department.service';
import { Department } from '../../../models/department';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.css'
})
export class DepartmentListComponent implements OnInit {
  departments: Department[] = [];

  constructor(
    private departmentService: DepartmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe(
      (data) => {
        this.departments = data;
      },
      (error) => {
        console.error('Error loading departments:', error);
      }
    );
  }

  addDepartment(): void {
    this.router.navigate(['/departments/add']);
  }

  editDepartment(id: number): void {
    this.router.navigate(['/departments/edit', id]);
  }

  deleteDepartment(id: number): void {
    if (confirm('Are you sure you want to delete this department?')) {
      this.departmentService.deleteDepartment(id).subscribe(
        () => {
          this.loadDepartments();
        },
        (error) => {
          console.error('Error deleting department:', error);
        }
      );
    }
  }

  viewDetails(id: number): void {
    this.router.navigate(['/departments/details', id]);
  }

}
