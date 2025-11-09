import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcademicProgramService } from '../../../services/academic-program.service';
import { AcademicProgram } from '../../../models/academic-program';

@Component({
  selector: 'app-academic-program-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './academic-program-add.component.html',
  styleUrl: './academic-program-add.component.css'
})
export class AcademicProgramAddComponent implements OnInit {
  program: AcademicProgram = {
    programName: '',
    programCode: '',
    description: '',
    duration: '',
    isActive: true
  };

  private userId: string = '1'; // Will be extracted from route params

  constructor(
    private programService: AcademicProgramService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Extract userId from route params (from /admin/:id)
    this.route.parent?.params.subscribe(params => {
      if (params['id']) {
        this.userId = params['id'];
        console.log('User ID from route:', this.userId);
      }
    });
  }

  onSubmit(): void {
    // Add userId to the program before sending
    const programWithUserId = {
      ...this.program,
      userId: this.userId
    };

    this.programService.createProgram(programWithUserId).subscribe(
      () => {
        this.router.navigate(['/admin', this.userId, 'academic-programs']);
      },
      (error) => {
        console.error('Error creating program:', error);
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/admin', this.userId, 'academic-programs']);
  }

}
