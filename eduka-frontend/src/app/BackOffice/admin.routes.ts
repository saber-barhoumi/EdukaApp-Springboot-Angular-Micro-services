import { Routes } from '@angular/router';
import { AdminPageComponent } from './pages-back/admin-page/admin-page.component';
import { RoleGuard } from '../guards/role.guard';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminPageComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] }
  }
];