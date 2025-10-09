import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-page',
  imports: [CommonModule],
  templateUrl: './student-page.component.html',
  styleUrl: './student-page.component.css'
})
export class StudentPageComponent implements OnInit {
  userId: string | null = null;
  userRole: string = 'Student';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    console.log('Student Page - User ID:', this.userId);
  }

  navigateToAIInsights(): void {
    if (this.userId) {
      console.log('Navigating to AI insights for student:', this.userId);
      this.router.navigate(['/student/ai-insights', this.userId]);
    }
  }
}
