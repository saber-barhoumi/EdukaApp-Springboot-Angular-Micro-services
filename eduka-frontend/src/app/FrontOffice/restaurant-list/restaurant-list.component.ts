import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RestaurantService, Restaurant } from '../../services/restaurant.service';

declare var $: any;

@Component({
  selector: 'app-restaurant-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.css']
})
export class RestaurantListComponent implements OnInit, AfterViewInit {
  restaurants: Restaurant[] = [];
  filteredRestaurants: Restaurant[] = [];
  searchTerm = '';
  filterType = '';
  
  restaurantTypes = ['Cafeteria', 'Fast Food', 'Fine Dining', 'Food Court', 'Other'];

  constructor(
    private restaurantService: RestaurantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRestaurants();
  }

  ngAfterViewInit(): void {
    // Initialize Owl Carousel after view is loaded
    setTimeout(() => {
      this.initializeOwlCarousel();
    }, 500);
  }

  loadRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        // Only show active restaurants to front-office users
        this.restaurants = data.filter(r => r.isActive);
        this.filteredRestaurants = this.restaurants;
        // Reinitialize carousel after data loads
        setTimeout(() => {
          this.initializeOwlCarousel();
        }, 100);
      },
      error: (error) => console.error('Error loading restaurants:', error)
    });
  }

  filterRestaurants(): void {
    this.filteredRestaurants = this.restaurants.filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           restaurant.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = !this.filterType || restaurant.type === this.filterType;
      return matchesSearch && matchesType;
    });
    
    // Reinitialize carousel after filtering
    setTimeout(() => {
      this.initializeOwlCarousel();
    }, 100);
  }

  viewRestaurantDetails(restaurantId: number): void {
    this.router.navigate(['/restaurant', restaurantId]);
  }

  getDefaultImage(): string {
    return '/assets/FrontOffice/img/event/event-01.jpg';
  }

  private initializeOwlCarousel(): void {
    if (typeof $ !== 'undefined' && $('.event-slider').length > 0) {
      // Destroy existing carousel if it exists
      $('.event-slider').trigger('destroy.owl.carousel');
      $('.event-slider').removeClass('owl-loaded');
      $('.event-slider').find('.owl-stage-outer').children().unwrap();
      
      // Initialize new carousel
      $('.event-slider').owlCarousel({
        loop: true,
        margin: 25,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        navText: [
          '<i class="far fa-angle-left"></i>',
          '<i class="far fa-angle-right"></i>'
        ],
        responsive: {
          0: {
            items: 1
          },
          768: {
            items: 2
          },
          992: {
            items: 3
          }
        }
      });
    }
  }
}
