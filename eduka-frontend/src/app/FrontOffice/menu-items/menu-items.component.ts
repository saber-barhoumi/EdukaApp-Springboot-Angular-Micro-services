import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
}

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class MenuItemsComponent implements OnInit {
  menuItems: MenuItem[] = [];
  readonly apiUrl = 'http://localhost:8086/api/menu-items';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getMenuItems();
  }

  getMenuItems(): void {
    this.http.get<MenuItem[]>(this.apiUrl).subscribe({
      next: data => {
        this.menuItems = data;
      },
      error: err => {
        console.error('Error loading menu items:', err);
      }
    });
  }
}
