import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  styleUrl: './all-template-back.component.css'
})
export class AllTemplateBackComponent {
  
}
