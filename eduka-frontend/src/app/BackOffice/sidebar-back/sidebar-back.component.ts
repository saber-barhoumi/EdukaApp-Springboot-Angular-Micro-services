import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-back',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-back.component.html',
  styleUrl: './sidebar-back.component.css'
})
export class SidebarBackComponent {
  // Simplified component - no dropdown functionality needed
}
