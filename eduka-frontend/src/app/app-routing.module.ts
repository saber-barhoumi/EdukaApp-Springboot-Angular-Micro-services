import { Routes } from '@angular/router';
import { AllTemplateFrontComponent } from './FrontOffice/all-template-front/all-template-front.component';
import { AllTemplateBackComponent } from './BackOffice/all-template-back/all-template-back.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { TeacherPageComponent } from './FrontOffice/pages-front/teacher-page/teacher-page.component';
import { StudentPageComponent } from './FrontOffice/pages-front/student-page/student-page.component';
import { ClientPageComponent } from './FrontOffice/pages-front/client-page/client-page.component';
import { AdminPageComponent } from './BackOffice/pages-back/admin-page/admin-page.component';
import { MenuItemsComponent } from './FrontOffice/menu-items/menu-items.component';
// New components
import { RestaurantManagementBackComponent } from './BackOffice/restaurant-management-back/restaurant-management-back.component';
import { OrderManagementBackComponent } from './BackOffice/order-management-back/order-management-back.component';
import { UserRestaurantAssignmentComponent } from './BackOffice/user-restaurant-assignment/user-restaurant-assignment.component';
import { RestaurantListComponent } from './FrontOffice/restaurant-list/restaurant-list.component';
import { RestaurantDetailsComponent } from './FrontOffice/restaurant-details/restaurant-details.component';
import { PlaceOrderComponent } from './FrontOffice/place-order/place-order.component';
import { MyOrdersComponent } from './FrontOffice/my-orders/my-orders.component';
// Role values match backend Role.java enum: ADMIN, TEACHER, STUDENT, ASSISTANT, CLIENT

export const routes: Routes = [


  {
    path: '',
    component: AllTemplateFrontComponent,
    children: [
      { 
        path: 'teacher/:id', 
        component: TeacherPageComponent,
        canActivate: [RoleGuard],
        data: { roles: ['TEACHER', 'ASSISTANT'] }
      },
      { 
        path: 'student/:id', 
        component: StudentPageComponent,
        canActivate: [RoleGuard],
        data: { roles: ['STUDENT'] }
      },


      { 
        path: 'client/:id', 
        component: ClientPageComponent,
        canActivate: [RoleGuard],
        data: { roles: ['CLIENT'] }
      },

      // Public routes for FrontOffice
      { path: 'restaurants', component: RestaurantListComponent },
      { path: 'restaurant/:id', component: RestaurantDetailsComponent },
      { path: 'place-order', component: PlaceOrderComponent },
      { path: 'my-orders', component: MyOrdersComponent },
      { path: 'menu-items', component: MenuItemsComponent },
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'admin/:id',
    component: AllTemplateBackComponent,
    // canActivate: [RoleGuard], // Temporarily disabled for testing
    // data: { roles: [Role.ADMIN] }, // Temporarily disabled for testing
    children: [
      { path: '', component: AdminPageComponent },
      { path: 'menu-items', loadComponent: () => import('./BackOffice/menu-items-back/menu-items-back.component').then(m => m.MenuItemsBackComponent) },
      // Restaurant Management routes
      { path: 'restaurant-management', component: RestaurantManagementBackComponent },
      { path: 'order-management', component: OrderManagementBackComponent },
      { path: 'user-restaurant-assignment', component: UserRestaurantAssignmentComponent },
      // Protected routes for BackOffice
    ]
  },
  {
    path: 'admin',
    redirectTo: '/admin/1',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: ''
  }
];