import { Component } from '@angular/core';
import { BannerSectionComponent } from './banner-section/banner-section.component';
import { ShippingSectionComponent } from './shipping-section/shipping-section.component';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { CategorySectionComponent } from './category-section/category-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CategorySectionComponent, HeroSectionComponent,BannerSectionComponent,ShippingSectionComponent],
  
templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
