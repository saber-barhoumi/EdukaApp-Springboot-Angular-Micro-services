import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService, User } from '../services/auth-dynamic.service';
// Role values match backend Role.java enum: ADMIN, TEACHER, STUDENT, ASSISTANT, CLIENT

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const user = this.authService.getCurrentUser();
    
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoles = route.data['roles'] as string[];
    
    if (allowedRoles && allowedRoles.length > 0) {
      if (this.authService.hasAnyRole(allowedRoles)) {
        return true;
      } else {
        // Redirect based on user's actual role
        this.redirectToUserRole(user);
        return false;
      }
    }

    return true;
  }

  private redirectToUserRole(user: User): void {
    const role = user.role;
    const userId = user.id;
    
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin', userId]);
        break;
      case 'TEACHER':
        this.router.navigate(['/teacher', userId]);
        break;
      case 'STUDENT':
        this.router.navigate(['/student', userId]);
        break;
      case 'ASSISTANT':
        this.router.navigate(['/assistant', userId]);
        break;
      case 'CLIENT':
        this.router.navigate(['/client', userId]);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }
}
