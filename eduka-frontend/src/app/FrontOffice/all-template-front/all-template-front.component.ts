import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderFrontComponent } from '../header-front/header-front.component';
import { FooterFrontComponent } from '../footer-front/footer-front.component';
import { BodyFrontComponent } from '../body-front/body-front.component';
@Component({
  selector: 'app-all-template-front',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, // Nécessaire pour <router-outlet>
    HeaderFrontComponent, // Nécessaire pour <app-header-front>
    FooterFrontComponent, // Nécessaire pour <app-footer-front>
    BodyFrontComponent
  ],
  templateUrl: './all-template-front.component.html',
  styleUrls: ['./all-template-front.component.css']
})
export class AllTemplateFrontComponent {}