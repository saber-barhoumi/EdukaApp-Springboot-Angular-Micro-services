import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcademicProgramService } from '../../../services/academic-program.service';
import { AcademicProgram } from '../../../models/academic-program';

@Component({
  selector: 'app-academic-program-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './academic-program-edit.component.html',
  styleUrl: './academic-program-edit.component.css'
})
export class AcademicProgramEditComponent implements OnInit {
  program: AcademicProgram = {
    programName: '',
    programCode: '',
    description: '',
    duration: '',
    isActive: true
  };

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

  onSubmit(): void {
    if (this.program.id) {
      this.programService.updateProgram(this.program.id, this.program).subscribe(
        () => {
          this.router.navigate(['/academic-programs']);
        },
        (error) => {
          console.error('Error updating program:', error);
        }
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/academic-programs']);
  }

}
