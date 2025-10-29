import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AssetLoaderService } from './services/asset-loader.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'eduka-frontend';
  private routeSub: any;

  // Define asset lists for each layout
  private frontOfficeAssets = {
    css: [
      'assets/FrontOffice/css/bootstrap.min.css',
      'assets/FrontOffice/css/all-fontawesome.min.css',
      'assets/FrontOffice/css/animate.min.css',
      'assets/FrontOffice/css/magnific-popup.min.css',
      'assets/FrontOffice/css/owl.carousel.min.css',
      'assets/FrontOffice/css/style.css'
    ],
    js: [
      'assets/FrontOffice/js/jquery-3.7.1.min.js',
      'assets/FrontOffice/js/modernizr.min.js',
      'assets/FrontOffice/js/bootstrap.bundle.min.js',
      'assets/FrontOffice/js/imagesloaded.pkgd.min.js',
      'assets/FrontOffice/js/jquery.magnific-popup.min.js',
      'assets/FrontOffice/js/isotope.pkgd.min.js',
      'assets/FrontOffice/js/jquery.appear.min.js',
      'assets/FrontOffice/js/jquery.easing.min.js',
      'assets/FrontOffice/js/owl.carousel.min.js',
      'assets/FrontOffice/js/counter-up.js',
      'assets/FrontOffice/js/wow.min.js',
      'assets/FrontOffice/js/main.js'
    ]
  };
  private backOfficeAssets = {
    css: [
      'assets/BackOffice/css/bootstrap.min.css',
      'assets/BackOffice/css/style.css'
    ],
    js: [
      'assets/BackOffice/js/jquery-3.7.1.min.js',
      'assets/BackOffice/js/bootstrap.bundle.min.js',
      'assets/BackOffice/js/main.js'
    ]
  };

  constructor(private assetLoader: AssetLoaderService, private router: Router) {}

  ngOnInit() {
    this.routeSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.assetLoader.unloadAll();
        // BackOffice route: starts with '/admin'
        if (event.urlAfterRedirects.startsWith('/admin')) {
          this.backOfficeAssets.css.forEach(css => this.assetLoader.loadCss(css));
          this.backOfficeAssets.js.forEach(js => this.assetLoader.loadJs(js));
        } else {
          this.frontOfficeAssets.css.forEach(css => this.assetLoader.loadCss(css));
          this.frontOfficeAssets.js.forEach(js => this.assetLoader.loadJs(js));
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSub) this.routeSub.unsubscribe();
    this.assetLoader.unloadAll();
  }
}
