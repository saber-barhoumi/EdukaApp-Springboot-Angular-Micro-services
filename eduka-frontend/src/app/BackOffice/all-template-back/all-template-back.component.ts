import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// Import des composants
import { HeaderBackComponent } from '../header-back/header-back.component';
import { SidebarBackComponent } from '../sidebar-back/sidebar-back.component';
import { DashboardCardsComponent } from '../dashboard-cards/dashboard-cards.component';
import { StatisticsCardsComponent } from '../statistics-cards/statistics-cards.component';
import { InvoiceTableComponent } from '../invoice-table/invoice-table.component';
import { TaskListComponent } from '../task-list/task-list.component';

@Component({
  selector: 'app-all-template-back',
  imports: [
    CommonModule,
    RouterModule,
    HeaderBackComponent,
    SidebarBackComponent,
    DashboardCardsComponent,
    StatisticsCardsComponent,
    InvoiceTableComponent,
    TaskListComponent
  ],
  templateUrl: './all-template-back.component.html',
  styleUrls: ['./all-template-back.component.css']
})
export class AllTemplateBackComponent implements OnInit {
  showDashboard = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check initial route
    this.checkRoute(this.router.url);

    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkRoute(event.urlAfterRedirects);
      });
  }

  private checkRoute(url: string): void {
    // Show dashboard only on the main admin page (e.g., /admin/1)
    // Hide dashboard on child routes (e.g., /admin/1/academic-programs)
    const segments = url.split('/').filter(s => s);
    // If URL is exactly /admin/{id}, show dashboard
    // If URL is /admin/{id}/something, hide dashboard
    this.showDashboard = segments.length === 2 && segments[0] === 'admin';
  }
}
