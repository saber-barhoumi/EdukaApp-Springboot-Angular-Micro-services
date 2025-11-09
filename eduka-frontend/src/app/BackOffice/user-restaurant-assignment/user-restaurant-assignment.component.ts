import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User, UserRole } from '../../services/user.service';
import { RestaurantService, Restaurant } from '../../services/restaurant.service';

@Component({
  selector: 'app-user-restaurant-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-restaurant-assignment.component.html',
  styleUrls: ['./user-restaurant-assignment.component.css']
})
export class UserRestaurantAssignmentComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  restaurants: Restaurant[] = [];
  selectedUser: User | null = null;
  showAssignmentModal = false;
  
  // Filters
  filterRole: UserRole | '' = '';
  searchTerm = '';
  
  // Statistics
  totalUsers = 0;
  assignedUsers = 0;
  unassignedUsers = 0;

  userRoles = Object.values(UserRole);

  constructor(
    private userService: UserService,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRestaurants();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.calculateStatistics();
      },
      error: (error) => console.error('Error loading users:', error)
    });
  }

  loadRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
      },
      error: (error) => console.error('Error loading restaurants:', error)
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesRole = !this.filterRole || user.role === this.filterRole;
      const matchesSearch = !this.searchTerm || 
                           user.firstName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           user.lastName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           user.email?.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesRole && matchesSearch;
    });
    this.calculateStatistics();
  }

  calculateStatistics(): void {
    this.totalUsers = this.filteredUsers.length;
    this.assignedUsers = this.filteredUsers.filter(u => 
      u.assignedRestaurantIds && u.assignedRestaurantIds.length > 0
    ).length;
    this.unassignedUsers = this.totalUsers - this.assignedUsers;
  }

  openAssignmentModal(user: User): void {
    this.selectedUser = user;
    this.showAssignmentModal = true;
  }

  closeAssignmentModal(): void {
    this.showAssignmentModal = false;
    this.selectedUser = null;
  }

  isRestaurantAssigned(restaurantId: number): boolean {
    return this.selectedUser?.assignedRestaurantIds?.includes(restaurantId) || false;
  }

  toggleRestaurantAssignment(restaurantId: number): void {
    if (!this.selectedUser || !this.selectedUser.id) return;

    if (this.isRestaurantAssigned(restaurantId)) {
      this.userService.unassignRestaurant(this.selectedUser.id, restaurantId).subscribe({
        next: () => {
          this.loadUsers();
          alert('Restaurant unassigned successfully!');
        },
        error: (error) => {
          console.error('Error unassigning restaurant:', error);
          alert('Failed to unassign restaurant');
        }
      });
    } else {
      this.userService.assignRestaurant(this.selectedUser.id, restaurantId).subscribe({
        next: () => {
          this.loadUsers();
          alert('Restaurant assigned successfully!');
        },
        error: (error) => {
          console.error('Error assigning restaurant:', error);
          alert('Failed to assign restaurant');
        }
      });
    }
  }

  getRestaurantNames(restaurantIds: number[]): string {
    if (!restaurantIds || restaurantIds.length === 0) {
      return 'No assignments';
    }
    const names = restaurantIds.map(id => {
      const restaurant = this.restaurants.find(r => r.id === id);
      return restaurant ? restaurant.name : `#${id}`;
    });
    return names.join(', ');
  }

  getAssignmentCount(user: User): number {
    return user.assignedRestaurantIds?.length || 0;
  }

  getRoleBadgeClass(role: UserRole): string {
    const roleClasses: { [key in UserRole]: string } = {
      [UserRole.ADMIN]: 'bg-danger',
      [UserRole.STAFF]: 'bg-primary',
      [UserRole.STUDENT]: 'bg-info',
      [UserRole.CLIENT]: 'bg-secondary'
    };
    return roleClasses[role];
  }

  getRestaurantNameById(restaurantId: number): string {
    const restaurant = this.restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.name : `Restaurant #${restaurantId}`;
  }

  bulkAssignRestaurant(restaurantId: number): void {
    const selectedUserIds = this.filteredUsers
      .filter(u => !u.assignedRestaurantIds?.includes(restaurantId))
      .map(u => u.id!);
    
    if (selectedUserIds.length === 0) {
      alert('All filtered users are already assigned to this restaurant');
      return;
    }

    if (confirm(`Assign ${selectedUserIds.length} users to selected restaurant?`)) {
      let completed = 0;
      selectedUserIds.forEach(userId => {
        this.userService.assignRestaurant(userId, restaurantId).subscribe({
          next: () => {
            completed++;
            if (completed === selectedUserIds.length) {
              this.loadUsers();
              alert(`Successfully assigned ${completed} users!`);
            }
          },
          error: (error) => console.error('Error in bulk assign:', error)
        });
      });
    }
  }
}
