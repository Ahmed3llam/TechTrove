import { Component, OnInit } from '@angular/core';
import { ProductItemComponent } from './product-item/product-item.component';
import { ProductService } from '../../Services/product.service';
import { IProduct } from '../../Models/ProductInterfaces/IProduct';
import { RouterModule } from '@angular/router';
import { IProductResponse } from '../../Models/ProductInterfaces/IProductResponse';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../Services/category.service';
import { Category, IFilterCategory } from '../../Models/CategoryInterfaces/ICategory';
import { ICategoryResponse } from '../../Models/CategoryInterfaces/IApiResponse';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductItemComponent,RouterModule,CommonModule,FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: IProduct[] = [];
  categories: IFilterCategory[] = [];
  totalPages = 1;
  currentPage = 1;
  pageSize = 9;
  filter:boolean = false;
  totalPagesArray: number[] = [];
  selectedCategories: string[] = [];

  constructor(public productService: ProductService,public categoryService:CategoryService) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchCategories();
  }

  fetchProducts(): void {
    const selectedCategoryTitles = this.categories.filter(category => category.selected).map(category => category.title);
    this.productService.filterProducts(selectedCategoryTitles,this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        this.products = response.products.$values;
        this.totalPages = response.totalPages;
        this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  
  fetchCategories(page: number = 1, pageSize: number = 30): void {
    this.categoryService.getCategories(page, pageSize).subscribe({
      next: (response: ICategoryResponse) => {
        this.categories = response.categories.$values.map(category => ({
          ...category,
          selected: false
        }));
        this.totalPages = response.totalPages;
        this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  deleteCategory(id: number): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== id);
      },
      error: (err) => {
        console.log("error",err);
      }
    });
  }

  filterProducts(): void {
    this.fetchProducts();
  }
  reset(): void {
    this.selectedCategories = [];
    this.categories.forEach(category => {
      category.selected = false;
    });
    this.fetchProducts();
  }
  goToPage(page: number): void {
    this.currentPage = page;
    this.fetchProducts();
  }
}