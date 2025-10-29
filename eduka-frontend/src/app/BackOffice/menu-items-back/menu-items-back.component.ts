import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface MenuItem {
  id?: number;
  name: string;
  description: string;
  price: number;
}

@Component({
  selector: 'app-menu-items-back',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './menu-items-back.component.html',
  styleUrls: ['./menu-items-back.component.css']
})
export class MenuItemsBackComponent implements OnInit {
  menuItems: MenuItem[] = [];
  form: FormGroup;
  editingItem: MenuItem | null = null;
  apiUrl = 'http://localhost:8086/api/menu-items';

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadMenuItems();
  }

  loadMenuItems() {
    this.http.get<MenuItem[]>(this.apiUrl).subscribe(data => this.menuItems = data);
  }

  submit() {
    if (this.form.invalid) return;
    const item = this.form.value;
    if (this.editingItem) {
      this.http.put<MenuItem>(`${this.apiUrl}/${this.editingItem.id}`, item).subscribe(() => {
        this.editingItem = null;
        this.form.reset();
        this.loadMenuItems();
      });
    } else {
      this.http.post<MenuItem>(this.apiUrl, item).subscribe(() => {
        this.form.reset();
        this.loadMenuItems();
      });
    }
  }

  edit(item: MenuItem) {
    this.editingItem = item;
    this.form.patchValue(item);
  }

  delete(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => this.loadMenuItems());
  }

  cancelEdit() {
    this.editingItem = null;
    this.form.reset();
  }
}
