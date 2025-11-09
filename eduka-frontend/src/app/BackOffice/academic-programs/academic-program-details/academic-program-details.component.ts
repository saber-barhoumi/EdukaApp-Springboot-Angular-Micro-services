import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AcademicProgramService } from '../../../services/academic-program.service';
import { AcademicProgram } from '../../../models/academic-program';

@Component({
  selector: 'app-academic-program-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './academic-program-details.component.html',
  styleUrl: './academic-program-details.component.css'
})
export class AcademicProgramDetailsComponent implements OnInit {
  program: AcademicProgram | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private programService: AcademicProgramService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.programService.getProgram(id).subscribe(
        (data) => {
          this.program = data;
        },
        (error) => {
          console.error('Error loading program:', error);
        }
      );
    }
  }

  back(): void {
    this.router.navigate(['/academic-programs']);
  }

}
