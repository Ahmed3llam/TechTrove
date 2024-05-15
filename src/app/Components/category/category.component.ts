import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../Services/category.service';
import { Category } from '../../Models/CategoryInterfaces/ICategory';
import { ICategoryResponse } from '../../Models/CategoryInterfaces/IApiResponse';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  totalPages = 1;
  currentPage = 1;
  pageSize = 10;
  totalPagesArray: number[] = [];

  constructor(public categoryService: CategoryService) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.categoryService.getCategories(this.currentPage, this.pageSize).subscribe({
      next: (response: ICategoryResponse) => {
        this.categories = response.categories.$values;
        this.totalPages = response.totalPages;
        this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  
  deleteCategory(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(id).subscribe({
          next: () => {
            this.categories = this.categories.filter(category => category.id !== id);
            Swal.fire(
              'Deleted!',
              'This category has been deleted.',
              'success'
            );
          },
          error: (err) => {
            console.log("error",err);
          }
        });
      }
    });
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.fetchCategories();
  }
}
